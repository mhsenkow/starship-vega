import styles from './VisualEditor.module.css';
import { TopLevelSpec } from 'vega-lite'
import { useMemo, useState, useRef, useEffect } from 'react'
import { EncodingChannel, MarkType, EncodingUpdate } from '../../types/vega'
import { sampleDatasets } from '../../utils/sampleData'
import { DatasetSelector } from './DatasetSelector'
import { generateRandomEncoding } from '../../utils/chartAdapters'
import { Tooltip } from '../../design-system';
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem';
import { 
  TimelineIcon, 
  BarChartIcon, 
  CategoryIcon, 
  NumbersIcon 
} from '../common/Icons'
import { DatasetMetadata } from '../../types/dataset'
import { DatasetSection } from './DatasetSection'
import { DataTransformerPanel } from './DataTransformerPanel'
import { markTypes } from '../../constants/markTypes'
import { inferDataTypes } from '../../utils/dataUtils'
import { getChartRecommendations } from '../../services/aiRecommendations'
import { AutoGraphIcon, RecommendIcon } from '../common/Icons'
import { detectDataTypes } from '../../utils/dataUtils'
import { initDB, getDataset } from '../../utils/indexedDB'
import { ExtendedSpec as VegaExtendedSpec } from '../../types/vega'
import { transformEncodings, createMarkConfig } from '../../utils/specUtils'
import DataColumnToken, { ColumnMetadata, ColumnDragItem } from '../common/DataColumnToken.module'

// Chart template interface
interface ChartTemplate {
  name: string;
  icon: string;
  markType: MarkType;
  description: string;
  encodings: Record<string, any>;
  config?: Record<string, any>;
}

interface VisualEditorProps {
  spec: TopLevelSpec;
  onChange: (spec: TopLevelSpec) => void;
  onChartRender?: () => void;
}

// Define MARK_ENCODINGS constant
const MARK_ENCODINGS = {
  bar: {
    name: 'Bar',
    icon: '📊',
    description: 'Compare quantities across categories',
    channels: ['x', 'y', 'color', 'size', 'opacity', 'row', 'column'],
    hints: {
      x: 'Categorical field for bars',
      y: 'Quantitative field for bar height',
      color: 'Different colors for categories'
    }
  },
  line: {
    name: 'Line',
    icon: '📈',
    description: 'Show trends over time',
    channels: ['x', 'y', 'color', 'size', 'opacity', 'row', 'column'],
    hints: {
      x: 'Temporal or quantitative field',
      y: 'Quantitative field for line position',
      color: 'Different lines for categories'
    }
  },
  point: {
    name: 'Point',
    icon: '⚪',
    description: 'Show relationships between variables',
    channels: ['x', 'y', 'color', 'size', 'opacity', 'row', 'column'],
    hints: {
      x: 'Quantitative field for x-axis',
      y: 'Quantitative field for y-axis',
      color: 'Different colors for categories'
    }
  },
  area: {
    name: 'Area',
    icon: '📉',
    description: 'Show cumulative values',
    channels: ['x', 'y', 'color', 'opacity', 'row', 'column'],
    hints: {
      x: 'Temporal or quantitative field',
      y: 'Quantitative field for area height',
      color: 'Different areas for categories'
    }
  },
  circle: {
    name: 'Circle',
    icon: '⭕',
    description: 'Show relationships with size',
    channels: ['x', 'y', 'color', 'size', 'opacity', 'row', 'column'],
    hints: {
      x: 'Quantitative field for x-axis',
      y: 'Quantitative field for y-axis',
      size: 'Circle size based on value',
      color: 'Different colors for categories'
    }
  },
  boxplot: {
    name: 'Box Plot',
    icon: '📦',
    description: 'Show statistical distributions',
    channels: ['x', 'y', 'color', 'opacity', 'row', 'column'],
    hints: {
      x: 'Categorical field for grouping',
      y: 'Quantitative field for distribution',
      color: 'Different colors for categories'
    }
  },
  text: {
    name: 'Text',
    icon: '📝',
    description: 'Display values directly as text',
    channels: ['x', 'y', 'text', 'color', 'size', 'opacity', 'row', 'column'],
    hints: {
      x: 'Position for text',
      y: 'Position for text',
      text: 'Text field to display',
      color: 'Text color'
    }
  },
  rect: {
    name: 'Rectangle',
    icon: '⬛',
    description: 'Create heatmaps and treemaps',
    channels: ['x', 'y', 'color', 'size', 'opacity', 'row', 'column'],
    hints: {
      x: 'Categorical field for x-axis',
      y: 'Categorical field for y-axis',
      color: 'Value for color intensity'
    }
  },
  arc: {
    name: 'Arc',
    icon: '🥧',
    description: 'Create pie charts and radial visualizations',
    channels: ['theta', 'color', 'opacity', 'row', 'column'],
    hints: {
      theta: 'Quantitative field for arc size',
      color: 'Different colors for categories'
    }
  }
};

// Define encoding options constants
const AGGREGATION_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'sum', label: 'Sum' },
  { value: 'mean', label: 'Mean' },
  { value: 'median', label: 'Median' },
  { value: 'min', label: 'Min' },
  { value: 'max', label: 'Max' },
  { value: 'count', label: 'Count' },
  { value: 'distinct', label: 'Distinct Count' }
];

const TIME_UNIT_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'year', label: 'Year' },
  { value: 'month', label: 'Month' },
  { value: 'day', label: 'Day' },
  { value: 'hour', label: 'Hour' },
  { value: 'minute', label: 'Minute' },
  { value: 'second', label: 'Second' }
];

const BINNING_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'bin', label: 'Bin (Auto)' },
  { value: 'bin-10', label: 'Bin (10 bins)' },
  { value: 'bin-20', label: 'Bin (20 bins)' },
  { value: 'bin-50', label: 'Bin (50 bins)' }
];

// Helper function to get compatible types for a field
const getCompatibleTypes = (field: string, data: any[]): string[] => {
  if (!data || data.length === 0) return ['nominal'];
  
  const sampleValue = data[0]?.[field];
  if (sampleValue === undefined || sampleValue === null) return ['nominal'];
  
  // Check if it's a number
  if (typeof sampleValue === 'number') {
    return ['quantitative', 'nominal', 'ordinal'];
  }
  
  // Check if it's a date
  if (sampleValue instanceof Date || (typeof sampleValue === 'string' && !isNaN(Date.parse(sampleValue)))) {
    return ['temporal', 'nominal', 'ordinal'];
  }
  
  // Check if it's a string that could be ordinal
  if (typeof sampleValue === 'string') {
    // Check if all values are strings and could be ordered
    const uniqueValues = [...new Set(data.map(d => d[field]).filter(v => v != null))];
    if (uniqueValues.length <= 10 && uniqueValues.every(v => typeof v === 'string')) {
      return ['nominal', 'ordinal'];
    }
    return ['nominal'];
  }
  
  // Default to nominal
  return ['nominal'];
};

export const VisualEditor = ({ spec, onChange, onChartRender }: VisualEditorProps) => {
  // Add state for dataset cache
  const [datasetCache, setDatasetCache] = useState<Record<string, DatasetMetadata>>({});
  const [currentDataset, setCurrentDataset] = useState<string | null>(null);
  const [customDatasets, setCustomDatasets] = useState<Record<string, DatasetMetadata>>({});
  const [filterField, setFilterField] = useState('');
  const [filterType, setFilterType] = useState('equals');
  const [filterValue, setFilterValue] = useState('');
  const [currentMark, setCurrentMark] = useState<MarkType>(() => {
    try {
      if (typeof spec === 'string') {
        const parsed = JSON.parse(spec);
        return typeof parsed.mark === 'string' ? parsed.mark : parsed.mark?.type || 'point';
      }
      return typeof spec.mark === 'string' ? spec.mark : spec.mark?.type || 'point';
    } catch (e) {
      console.error('Failed to parse spec:', e);
      return 'point';
    }
  });
  const [encodings, setEncodings] = useState(() => {
    try {
      if (typeof spec === 'string') {
        const parsed = JSON.parse(spec);
        return parsed.encoding || {};
      }
      return spec.encoding || {};
    } catch (e) {
      console.error('Failed to parse spec:', e);
      return {};
    }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const loadSavedStates = (): AccordionStates => {
    const saved = localStorage.getItem('visualEditorAccordionStates');
    return saved ? JSON.parse(saved) : {
      data: true,
      filter: false,
      chartType: true,
      encoding: true
    };
  };

  const [accordionStates, setAccordionStates] = useState<AccordionStates>(loadSavedStates());

  useEffect(() => {
    localStorage.setItem('visualEditorAccordionStates', JSON.stringify(accordionStates));
  }, [accordionStates]);

  // Update mark type and encodings when spec changes (e.g., when new chart is loaded)
  useEffect(() => {
    try {
      let parsedSpec;
      if (typeof spec === 'string') {
        parsedSpec = JSON.parse(spec);
      } else {
        parsedSpec = spec;
      }
      
      if (parsedSpec) {
        // Update mark type if it changed
        const newMarkType = typeof parsedSpec.mark === 'string' ? parsedSpec.mark : parsedSpec.mark?.type;
        if (newMarkType && newMarkType !== currentMark) {
          setCurrentMark(newMarkType);
        }
        
        // Update encodings if they changed
        if (parsedSpec.encoding && JSON.stringify(parsedSpec.encoding) !== JSON.stringify(encodings)) {
          setEncodings(parsedSpec.encoding);
        }
      }
    } catch (e) {
      console.error('Failed to parse spec for updates:', e);
    }
  }, [spec, currentMark, encodings]);

  const toggleAccordion = (section: keyof AccordionStates) => {
    setAccordionStates((prev: AccordionStates) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get current dataset from either custom or sample datasets
  const getCurrentDataset = () => {
    return customDatasets[currentDataset] || sampleDatasets[currentDataset];
  };

  const validateData = (data: any[]): any[] => {
    if (!Array.isArray(data)) return [];
    
    return data.filter(row => {
      if (!row || typeof row !== 'object') return false;
      // Filter out rows with invalid values
      return Object.values(row).every(value => 
        value === null || 
        value === undefined || 
        typeof value === 'string' ||
        typeof value === 'number' ||
        value instanceof Date
      );
    });
  };

  // Handle dataset upload from DatasetSection
  const handleDataUpload = (data: any[]) => {
    const validData = validateData(data);
    // Create a new dataset entry
    const newDataset: DatasetMetadata = {
      id: `upload-${Date.now()}`,
      name: `Uploaded Dataset ${Object.keys(customDatasets).length + 1}`,
      description: `Dataset with ${validData.length} rows and ${Object.keys(validData[0] || {}).length} columns`,
      values: validData,
      source: 'upload',
      uploadDate: new Date(),
      dataTypes: detectDataTypes(validData)
    };

    setCustomDatasets(prev => ({
      ...prev,
      [newDataset.id]: newDataset
    }));

    setCurrentDataset(newDataset.id);

    // Update the chart with the new data and default mark type
    onChange({
      data: { values: validData },
      mark: 'point', // Set a default mark type
      encoding: {
        x: { 
          field: Object.keys(validData[0])[0], 
          type: 'quantitative'
        },
        y: { 
          field: Object.keys(validData[0])[1], 
          type: 'quantitative'
        }
      }
    });
  };

  // Handle dataset selection
  const handleDatasetSelect = async (datasetId: string | DatasetMetadata) => {
    try {
      let dataset;

      // If it's a string ID, try to get from sample datasets first
      if (typeof datasetId === 'string') {
        if (sampleDatasets[datasetId]) {
          dataset = {
            id: datasetId,
            ...sampleDatasets[datasetId]
          };
        } else {
          // Try to get from IndexedDB
          dataset = await getDataset(datasetId);
        }
      } else {
        // It's already a dataset object
        dataset = datasetId;
      }

      if (!dataset || !dataset.values) {
        console.error('Dataset not found or invalid:', datasetId);
        return;
      }

      // Set current dataset ID
      setCurrentDataset(typeof datasetId === 'string' ? datasetId : dataset.id);

      // Create Vega-Lite spec with the dataset
      const newSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        description: dataset.description || '',
        data: {
          values: dataset.values
        },
        mark: currentMark || 'area',
        encoding: {
          x: {
            field: dataset.columns?.[0] || Object.keys(dataset.values[0])[0],
            type: dataset.dataTypes?.[dataset.columns?.[0]] || 'nominal'
          },
          y: {
            field: dataset.columns?.find(col => dataset.dataTypes?.[col] === 'quantitative') 
              || Object.keys(dataset.values[0])[1],
            type: 'quantitative'
          }
        }
      };

      // Add color encoding if there's a categorical field available
      const categoricalField = dataset.columns?.find(col => 
        dataset.dataTypes?.[col] === 'nominal' || dataset.dataTypes?.[col] === 'ordinal'
      );
      
      if (categoricalField && categoricalField !== newSpec.encoding.x.field) {
        newSpec.encoding.color = {
          field: categoricalField,
          type: dataset.dataTypes?.[categoricalField] || 'nominal'
        };
      }

      onChange(newSpec);

    } catch (error) {
      console.error('Failed to load dataset:', error);
    }
  };

  const handleMarkTypeChange = (newMarkType: MarkType) => {
    setCurrentMark(newMarkType);

    // Get available encodings for the new mark type
    const availableEncodings = MARK_ENCODINGS[newMarkType].channels;

    // Filter out incompatible encodings and keep compatible ones
    const updatedEncodings = Object.entries(spec.encoding || {}).reduce((acc, [channel, encoding]) => {
      if (availableEncodings.includes(channel as EncodingChannel)) {
        acc[channel] = encoding;
      }
      return acc;
    }, {});

    // Define default mark configurations based on type
    const getDefaultMarkConfig = (type: MarkType) => {
      const baseConfig = {
        type,
        tooltip: true
      };

      switch (type) {
        case 'point':
        case 'circle':
          return {
            ...baseConfig,
            filled: true,
            size: 100,
            opacity: 0.7
          };
        case 'bar':
          return {
            ...baseConfig,
            cornerRadius: 0,
            opacity: 0.8
          };
        case 'line':
          return {
            ...baseConfig,
            point: true,
            strokeWidth: 2,
            interpolate: 'linear'
          };
        case 'area':
          return {
            ...baseConfig,
            opacity: 0.6,
            line: true
          };
        case 'text':
          return {
            ...baseConfig,
            fontSize: 11,
            fontWeight: 400
          };
        default:
          return baseConfig;
      }
    };

    // Update the spec with new mark type and filtered encodings
    onChange({
      ...spec,
      mark: getDefaultMarkConfig(newMarkType),
      encoding: {
        ...updatedEncodings,
        // Ensure size encoding is handled properly
        ...(spec.encoding?.size && {
          size: {
            ...spec.encoding.size,
            scale: { type: 'linear', range: [50, 1000] }
          }
        })
      },
      config: {
        ...spec.config,
        mark: {
          ...spec.config?.mark,
          invalid: 'filter'
        }
      }
    });
  };

  const handleEncodingChange = (channel: string, update: EncodingUpdate) => {
    const currentEncoding = encodings[channel] || {};
    const newEncoding = {
      ...currentEncoding,
      ...update
    };

    // Remove properties with empty string values
    Object.keys(newEncoding).forEach(key => {
      if (newEncoding[key] === '') {
        delete newEncoding[key];
      }
    });

    // Handle bin specially since it can be boolean or object
    if (update.bin === '') {
      delete newEncoding.bin;
    } else if (typeof update.bin === 'string' && update.bin.startsWith('bin-')) {
      const binCount = parseInt(update.bin.split('-')[1]);
      newEncoding.bin = { maxbins: binCount };
    }

    const updatedEncodings = {
      ...encodings,
      [channel]: newEncoding
    };

    setEncodings(updatedEncodings);
    onChange({ ...spec, encoding: updatedEncodings });
  };

  const fields = useMemo(() => {
    try {
      if (spec.data?.values && Array.isArray(spec.data.values)) {
        const sampleRow = spec.data.values[0]
        return Object.keys(sampleRow || {})
      }
      return []
    } catch (err) {
      console.error('Error getting data fields:', err)
      return []
    }
  }, [spec.data?.values])

  const getAvailableEncodings = (): EncodingChannel[] => {
    return MARK_ENCODINGS[currentMark]?.channels || [];
  }

  const suggestEncodings = () => {
    const data = spec.data?.values || [];
    if (!data.length) return;

    const dataTypes = inferDataTypes(data);
    const suggestions: Record<string, any> = {};

    // Find temporal field for x-axis
    const temporalField = Object.entries(dataTypes)
      .find(([_, types]) => types.includes('temporal'))?.[0];
    if (temporalField) {
      suggestions.x = { field: temporalField, type: 'temporal' };
    }

    // Find quantitative field for y-axis
    const quantField = Object.entries(dataTypes)
      .find(([_, types]) => types.includes('quantitative'))?.[0];
    if (quantField) {
      suggestions.y = { field: quantField, type: 'quantitative' };
    }

    // Find categorical field for color
    const nominalField = Object.entries(dataTypes)
      .find(([_, types]) => types.includes('nominal'))?.[0];
    if (nominalField) {
      suggestions.color = { field: nominalField, type: 'nominal' };
    }

    return suggestions;
  };

  const handleRandomizeEncodings = () => {
    const markConfig = MARK_ENCODINGS[currentMark];
    const newEncodings = {};
    
    markConfig.channels.forEach(channel => {
      const compatibleFields = fields.filter(field => {
        switch (channel) {
          case 'theta':
          case 'radius':
          case 'size':
            return fieldTypes[field] === 'quantitative';
          case 'color':
            return fieldTypes[field] === 'nominal';
          case 'x':
          case 'y':
            return true; // Accept any type
          default:
            return true;
        }
      });
      
      if (compatibleFields.length) {
        const randomField = compatibleFields[
          Math.floor(Math.random() * compatibleFields.length)
        ];
        
        const fieldType = fieldTypes[randomField];
        const encoding = {
          field: randomField,
          type: fieldType
        };
        
        // Add suggested encoding options
        const suggestion = suggestEncodingOption(randomField, channel, fieldType);
        if (suggestion) {
          if (fieldType === 'quantitative') {
            if (suggestion === 'bin') {
              encoding.bin = true;
            } else {
              encoding.aggregate = suggestion;
            }
          } else if (fieldType === 'temporal') {
            encoding.timeUnit = suggestion;
          }
        }
        
        newEncodings[channel] = encoding;
      }
    });
    
    setEncodings(newEncodings);
    onChange({ ...spec, encoding: newEncodings });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Parse CSV file
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        // Update the spec with the new data
        onChange({
          data: { values: results.data },
          // Reset encodings when new data is loaded
          encoding: {
            x: { field: Object.keys(results.data[0])[0], type: 'quantitative' },
            y: { field: Object.keys(results.data[0])[1], type: 'quantitative' }
          }
        });

        // Create dataset metadata
        const dataset: DatasetMetadata = {
          id: file.name,
          name: file.name.split('.')[0],
          description: `Uploaded ${file.name}`,
          values: results.data,
          uploadDate: new Date(),
          source: 'upload'
        };

        // You can pass this to a parent component if needed
        console.log('Dataset loaded:', dataset);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  };

  // Type guard for data values
  const getDataValues = () => {
    if ('values' in spec.data) {
      return spec.data.values;
    }
    return null;
  };

  const handleFieldSelect = (channel: string, field: string) => {
    const compatibleTypes = getCompatibleTypes(field, spec.data?.values || []);
    
    // Choose best default type based on channel and data
    let defaultType = 'nominal';
    if (channel === 'y' && compatibleTypes.includes('quantitative')) {
      defaultType = 'quantitative';
    } else if (channel === 'x' && compatibleTypes.includes('temporal')) {
      defaultType = 'temporal';
    } else if (channel === 'size' && compatibleTypes.includes('quantitative')) {
      defaultType = 'quantitative';
    } else if (compatibleTypes.includes('nominal')) {
      defaultType = 'nominal';
    }

    handleEncodingChange(channel, { 
      field,
      type: defaultType
    });
  };

  const [transforms, setTransforms] = useState<DataTransform[]>([]);
  const [activeTransform, setActiveTransform] = useState<DataTransform | null>(null);

  const applyTransforms = (data: any[]) => {
    return transforms.reduce((result, transform) => {
      switch (transform.type) {
        case 'filter':
          return result.filter(row => {
            if (!row[transform.field]) return false;
            const value = row[transform.field];
            switch (transform.operation) {
              case 'equals':
                return String(value) === transform.value;
              case 'contains':
                return String(value).toLowerCase().includes(String(transform.value).toLowerCase());
              case 'greater':
                return !isNaN(Number(value)) && Number(value) > Number(transform.value);
              case 'less':
                return !isNaN(Number(value)) && Number(value) < Number(transform.value);
              default:
                return true;
            }
          });

        case 'calculate':
          return result.map(row => {
            try {
              return {
                ...row,
                [transform.as]: transform.test?.(row)
              };
            } catch (e) {
              return row;
            }
          });

        case 'aggregate':
          try {
            const groups = {};
            result.forEach(row => {
              const key = row[transform.field];
              if (key != null) {  // Skip null/undefined values
                if (!groups[key]) groups[key] = [];
                groups[key].push(row);
              }
            });
            return Object.entries(groups).map(([key, values]) => ({
              [transform.field]: key,
              [transform.as]: aggregateValues(values, transform.operation)
            }));
          } catch (e) {
            console.warn('Aggregation failed:', e);
            return result;
          }

        default:
          return result;
      }
    }, data.filter(row => row != null)); // Filter out null/undefined rows
  };

  const applyFilter = () => {
    if (!filterField || !filterValue) return;

    const newTransform: DataTransform = {
      type: 'filter',
      field: filterField,
      operation: filterType,
      value: filterValue
    };

    setTransforms(prev => [...prev, newTransform]);
    
    if (spec.data?.values) {
      const filteredData = applyTransforms([...spec.data.values]);
      onChange({
        ...spec,
        data: { values: filteredData }
      });
    }
  };

  const aggregateValues = (values: any[], operation: string) => {
    const nums = values
      .map(v => Number(v))
      .filter(n => !isNaN(n) && isFinite(n)); // Filter out NaN and Infinity

    if (nums.length === 0) return 0;

    switch (operation) {
      case 'sum':
        return nums.reduce((a, b) => a + b, 0);
      case 'mean':
        return nums.reduce((a, b) => a + b, 0) / nums.length;
      case 'min':
        return Math.min(...nums);
      case 'max':
        return Math.max(...nums);
      default:
        return values.length; // count
    }
  };

  const [recommendations, setRecommendations] = useState([]);

  const handleRecommendEncodings = () => {
    if (!spec.data?.values?.length) return;

    // Get clean data and correct data types for better recommendations
    const dataValues = spec.data.values;
    const dataTypes = inferDataTypes(dataValues);
    
    // Create a properly formatted dataset for recommendations
    const dataset = {
      values: dataValues,
      dataTypes: Object.entries(dataTypes).reduce((acc, [field, types]) => {
        // Choose the most appropriate type from the inferred types
        acc[field] = types[0]; // Take the first inferred type
        return acc;
      }, {})
    };

    console.log('Getting recommendations for dataset:', dataset);
    const recs = getChartRecommendations(dataset);
    console.log('Received recommendations:', recs);
    setRecommendations(recs);
  };

  const applyRecommendation = (recommendation) => {
    // Add debug log
    console.log('Applying recommendation:', recommendation);
    
    // Update the current mark type
    setCurrentMark(recommendation.chartType);
    
    // Process the encodings using our utility function
    const newEncodings = transformEncodings(recommendation.suggestedEncodings);
    
    // Update encodings state
    setEncodings(newEncodings);
    
    // Create a new spec object with the new mark type and encodings
    const newSpec = {
      ...spec,
      mark: createMarkConfig(recommendation.chartType),
      encoding: newEncodings
    };

    // Apply the changes
    onChange(newSpec);
    
    // Force a complete re-render immediately 
    if (onChartRender) {
      onChartRender();
    }
    
    // Apply a second update after a short delay to ensure the chart refreshes properly
    setTimeout(() => {
      // Create a slightly modified copy of the spec to force a re-render
      const refreshedSpec = {
        ...newSpec,
        width: newSpec.width || undefined, // Trigger width recalculation
        height: newSpec.height || undefined, // Trigger height recalculation
        // Add a renderKey to force Vega-Lite to create a new View
        config: {
          ...(newSpec.config || {}),
          _renderKey: Date.now() // Add a unique render key
        }
      };
      onChange(refreshedSpec);
      
      // Notify parent to update chart render key
      if (onChartRender) {
        onChartRender();
      }
    }, 50);
  };

  // Detect field types with better logic
  const fieldTypes = useMemo(() => {
    const data = spec.data?.values || [];
    if (!data.length) return {};
    
    return fields.reduce((acc, field) => {
      const values = data.map(row => row[field]).filter(val => val !== null && val !== undefined);
      if (!values.length) {
        acc[field] = 'nominal';
        return acc;
      }
      
      // Check if all values are numbers
      const allNumbers = values.every(val => typeof val === 'number' && !isNaN(val));
      if (allNumbers) {
        acc[field] = 'quantitative';
        return acc;
      }
      
      // Check if all values are dates or date strings
      const allDates = values.every(val => {
        if (val instanceof Date) return true;
        if (typeof val === 'string') {
          const parsed = new Date(val);
          return !isNaN(parsed.getTime());
        }
        return false;
      });
      if (allDates) {
        acc[field] = 'temporal';
        return acc;
      }
      
      // Check if values look like categories (limited unique values)
      const uniqueValues = new Set(values.map(val => String(val)));
      if (uniqueValues.size <= Math.min(20, values.length * 0.5)) {
        acc[field] = 'nominal';
        return acc;
      }
      
      // Default to nominal
      acc[field] = 'nominal';
      return acc;
    }, {} as Record<string, string>);
  }, [fields, spec.data?.values]);

  // Safe spec parsing
  const parsedSpec = useMemo(() => {
    try {
      return typeof spec === 'string' ? JSON.parse(spec) : spec;
    } catch (e) {
      console.error('Failed to parse spec:', e);
      return {
        mark: { type: 'point' },
        encoding: {},
        data: { values: [] }
      };
    }
  }, [spec]);

  // Safe mark type access
  const markType = useMemo(() => {
    if (!parsedSpec) return 'point';
    if (typeof parsedSpec.mark === 'string') return parsedSpec.mark;
    return parsedSpec.mark?.type || 'point';
  }, [parsedSpec]);

  const [templates, setTemplates] = useState<ChartTemplate[]>(CHART_TEMPLATES);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleApplyTemplate = (template: ChartTemplate) => {
    // Update mark type
    setCurrentMark(template.markType);
    
    // Find fields that match the required types for the template
    const dataValues = spec.data?.values || [];
    if (!dataValues.length) return;
    
    const dataTypes = inferDataTypes(dataValues);
    const fieldsByType = Object.entries(dataTypes).reduce((acc, [field, types]) => {
      types.forEach(type => {
        if (!acc[type]) acc[type] = [];
        acc[type].push(field);
      });
      return acc;
    }, {} as Record<string, string[]>);
    
    // Map template encodings to actual fields
    const newEncodings = Object.entries(template.encodings).reduce((acc, [channel, config]) => {
      const requiredType = config.type;
      const fields = fieldsByType[requiredType] || [];
      
      if (fields.length > 0) {
        // Choose different fields for different channels if possible
        const availableFields = fields.filter(field => 
          !Object.values(acc).some(enc => enc.field === field)
        );
        
        const fieldToUse = availableFields.length > 0 ? availableFields[0] : fields[0];
        
        acc[channel] = {
          field: fieldToUse,
          type: requiredType,
          ...(config.bin && { bin: config.bin }),
          ...(config.aggregate && { aggregate: config.aggregate }),
          ...(config.timeUnit && { timeUnit: config.timeUnit })
        };
      }
      
      return acc;
    }, {});
    
    // Create mark configuration
    const markConfig = typeof template.config === 'object' ? 
      { type: template.markType, ...template.config } : 
      template.markType;
    
    // Update encodings state
    setEncodings(newEncodings);
    
    // Update the spec
    const newSpec = {
      ...spec,
      mark: markConfig,
      encoding: newEncodings
    };
    
    // Apply the changes
    onChange(newSpec);
    
    // Force chart re-render
    if (onChartRender) {
      onChartRender();
    }
    
    // Hide templates panel
    setShowTemplates(false);
  };

  // Add this state for data tabs
  const [activeDataTab, setActiveDataTab] = useState<DataTabSection>('dataset');

  // Add helper to get appropriate encoding options based on field type
  const getEncodingOptions = (channel: string, fieldType: string) => {
    if (fieldType === 'quantitative') {
      return AGGREGATION_OPTIONS.concat(BINNING_OPTIONS);
    } else if (fieldType === 'temporal') {
      return TIME_UNIT_OPTIONS;
    }
    return [];
  };

  // Add helper to detect if a field would benefit from aggregation
  const suggestEncodingOption = (field: string, channel: string, fieldType: string) => {
    if (!field || !spec.data?.values) return '';
    
    // Get data for field
    const values = spec.data.values.map(d => d[field]).filter(v => v !== undefined && v !== null);
    
    if (fieldType === 'quantitative') {
      const uniqueCount = new Set(values).size;
      const totalCount = values.length;
      
      // If there are many unique values and channel is y, suggest sum or mean
      if (uniqueCount > 20 && channel === 'y') {
        return 'mean';
      }
      
      // If there are many values but few uniques, suggest binning
      if (uniqueCount < totalCount * 0.1 && uniqueCount > 10) {
        return 'bin';
      }
    } else if (fieldType === 'temporal') {
      // For date fields, suggest appropriate time unit
      const dates = values.map(v => new Date(v));
      const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
      
      const daysDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 365 * 2) return 'year';
      if (daysDiff > 90) return 'month';
      if (daysDiff > 30) return 'week';
      if (daysDiff > 2) return 'day';
      
      return 'hour';
    }
    
    return '';
  };

  const [columnMetadata, setColumnMetadata] = useState<Record<string, ColumnMetadata>>({});

  // Internal implementation of the suggestEncodingChannel function
  const suggestEncodingChannel = (column: ColumnMetadata): string | null => {
    switch(column.type) {
      case "quantitative":
        return "y";
      case "temporal":
        return "x";
      case "nominal":
      case "ordinal":
        return "color";
      default:
        return null;
    }
  };

  // Update to calculate column metadata when data changes
  useEffect(() => {
    const values = getDataValues();
    if (!values || values.length === 0) return;
    
    const dataTypes = detectDataTypes(values);
    const metadata: Record<string, ColumnMetadata> = {};
    
    // Extract columns from the first row of data
    Object.keys(values[0] || {}).forEach(column => {
      // Get column values for statistics
      const columnValues = values
        .map(row => row[column])
        .filter(val => val !== null && val !== undefined);
        
      const uniqueValues = new Set(columnValues).size;
      const missingValues = values.length - columnValues.length;
      
      // Calculate basic statistics for numerical columns
      let stats = undefined;
      if (dataTypes[column] === 'quantitative') {
        const numericValues = columnValues.map(v => Number(v)).filter(v => !isNaN(v));
        if (numericValues.length > 0) {
          const min = Math.min(...numericValues);
          const max = Math.max(...numericValues);
          const sum = numericValues.reduce((a, b) => a + b, 0);
          const mean = sum / numericValues.length;
          
          stats = { min, max, mean };
        }
      }
      
      metadata[column] = {
        name: column,
        type: dataTypes[column] || 'nominal',
        uniqueValues,
        missingValues,
        stats
      };
    });
    
    setColumnMetadata(metadata);
  }, [spec.data]);

  // Handler for field drop on encoding
  const handleColumnDrop = (channel: string, column: ColumnMetadata) => {
    const newEncodings = {
      ...encodings,
      [channel]: {
        field: column.name,
        type: column.type,
      }
    };
    
    setEncodings(newEncodings);
    onChange({ ...spec, encoding: newEncodings } as VegaExtendedSpec);
  };

  // Create encoding component (simplified without drag-and-drop)
  const EncodingDropTarget = ({ channel }: { channel: string }) => {
    // Simple state for hover effects (no drag-and-drop)
    const [isHovered, setIsHovered] = useState(false);

    // Handle dropdown open/close states to prevent theme interference
    const handleSelectFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      console.log('SELECT FOCUS - Adding dropdown-open class');
      // Add class to body to disable theme effects
      document.body.classList.add('dropdown-open');
      
      // Force the select to stay focused
      const selectElement = e.target;
      selectElement.style.zIndex = '999999';
      selectElement.style.position = 'relative';
      
      // Prevent event bubbling
      e.stopPropagation();
      e.preventDefault();
    };

    const handleSelectBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      console.log('SELECT BLUR - Removing dropdown-open class');
      
      // Delay removal to allow for option selection
      setTimeout(() => {
        document.body.classList.remove('dropdown-open');
      }, 150);
      
      // Prevent event bubbling
      e.stopPropagation();
    };

    const handleSelectMouseDown = (e: React.MouseEvent<HTMLSelectElement>) => {
      console.log('SELECT MOUSEDOWN - Preventing interference');
      // Prevent any interference from parent components
      e.stopPropagation();
      
      // Force focus
      const selectElement = e.target as HTMLSelectElement;
      setTimeout(() => {
        selectElement.focus();
      }, 0);
    };

    const handleSelectClick = (e: React.MouseEvent<HTMLSelectElement>) => {
      console.log('SELECT CLICK - Ensuring dropdown opens');
      // Prevent event bubbling that might close the dropdown
      e.stopPropagation();
      
      // Ensure the dropdown opens
      const selectElement = e.target as HTMLSelectElement;
      selectElement.style.zIndex = '999999';
      
      // Force open the dropdown
      if (!selectElement.matches(':focus')) {
        selectElement.focus();
      }
    };

    return (
      <div 
        className={`${styles.droppableEncodingControl} ${isHovered ? styles.isOver : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {encodings[channel]?.field ? (
          <div className={styles.columnTokenContainer}>
            {columnMetadata[encodings[channel].field] && (
              <DataColumnToken 
                column={columnMetadata[encodings[channel].field]}
                showStats={false}
                onClick={() => {/* Optional click handler */}}
              />
            )}
          </div>
        ) : (
          <div className={styles.dropHint}>
            <div className={styles.dragIcon}>📊</div>
            Select a column below
          </div>
        )}
        
        <select
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            fontSize: '0.9rem',
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            position: 'relative',
            zIndex: 999999,
            cursor: 'pointer'
          }}
          value={encodings[channel]?.field || ''}
          onChange={(e) => {
            console.log('SELECT CHANGE - Field changed to:', e.target.value);
            const newEncodings = {
              ...encodings,
              [channel]: e.target.value ? {
                field: e.target.value,
                type: fieldTypes[e.target.value]
              } : undefined
            };
            setEncodings(newEncodings);
            onChange({ ...spec, encoding: newEncodings });
          }}
          onFocus={handleSelectFocus}
          onBlur={handleSelectBlur}
          onClick={handleSelectClick}
          onMouseDown={handleSelectMouseDown}
        >
          <option value="">Select field</option>
          {fields.map(field => (
            <option key={field} value={field}>
              {field} ({fieldTypes[field]})
            </option>
          ))}
        </select>
        
        {encodings[channel]?.field && (
          <>
            <div className={styles.typeButtons}>
              {[
                { type: 'quantitative', icon: <NumbersIcon />, label: 'Number' },
                { type: 'temporal', icon: <TimelineIcon />, label: 'Time' },
                { type: 'nominal', icon: <CategoryIcon />, label: 'Category' },
                { type: 'ordinal', icon: <BarChartIcon />, label: 'Ordered' }
              ].map(({ type, icon, label }) => {
                const field = encodings[channel]?.field;
                const compatibleTypes = field ? 
                  getCompatibleTypes(field, spec.data?.values || []) : 
                  [];
                
                const isCompatible = compatibleTypes.includes(type);
                
                return (
                  <Tooltip key={type} title={label}>
                    <span>
                      <button 
                        className={`${styles.encodingTypeButton} ${encodings[channel]?.type === type ? styles.active : ''} ${isCompatible ? styles.compatible : styles.incompatible}`}
                        onClick={() => isCompatible && handleEncodingChange(channel, { type })}
                        disabled={!isCompatible}
                      >
                        {icon}
                      </button>
                    </span>
                  </Tooltip>
                );
              })}
            </div>
            
            {encodings[channel]?.type && (
              <select
                className={styles.encodingOptionSelect}
                value={
                  encodings[channel]?.aggregate || 
                  encodings[channel]?.timeUnit || 
                  (encodings[channel]?.bin ? 
                    (typeof encodings[channel].bin === 'object' && 'maxbins' in encodings[channel].bin) ? 
                      `bin-${encodings[channel].bin.maxbins}` : 'bin' 
                    : '')
                }
                onChange={(e) => {
                  const value = e.target.value;
                  const update: EncodingUpdate = {};
                  
                  // Clear all transformation properties first
                  update.aggregate = '';
                  update.timeUnit = '';
                  update.bin = '';
                  
                  // Set the selected transformation
                  if (AGGREGATION_OPTIONS.some(opt => opt.value === value)) {
                    update.aggregate = value;
                  } else if (TIME_UNIT_OPTIONS.some(opt => opt.value === value)) {
                    update.timeUnit = value;
                  } else if (value === 'bin') {
                    update.bin = true;
                  } else if (value.startsWith('bin-')) {
                    update.bin = value;
                  }
                  
                  handleEncodingChange(channel, update);
                }}
                onFocus={handleSelectFocus}
                onBlur={handleSelectBlur}
                onClick={handleSelectClick}
                onMouseDown={handleSelectMouseDown}
              >
                <option value="">Select option</option>
                {encodings[channel].type === 'quantitative' && (
                  <>
                    <optgroup label="Aggregation">
                      {AGGREGATION_OPTIONS.filter(opt => opt.value).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Binning">
                      {BINNING_OPTIONS.filter(opt => opt.value).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </optgroup>
                  </>
                )}
                {encodings[channel].type === 'temporal' && (
                  <optgroup label="Time Unit">
                    {TIME_UNIT_OPTIONS.filter(opt => opt.value).map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            )}
          </>
        )}
      </div>
    );
  };

  // Update the rendering of available encodings
  const renderEncodingSection = () => {
    return (
      <div>
        {getAvailableEncodings().map(channel => (
            <div className={styles.control} key={channel}>
              <div className={styles.encodingGrid}>
              <label className={styles.label}>{channel.toUpperCase()}</label>
              <EncodingDropTarget channel={channel} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!spec) {
    return <div>Invalid specification</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.dataTabsContainer}>
        <ButtonGroup buttonStyle="embedded">
          <Button
            variant={activeDataTab === 'dataset' ? 'primary' : 'ghost'}
            size="small"
            buttonStyle="embedded"
            onClick={() => setActiveDataTab('dataset')}
          >
            Data
          </Button>
          <Button
            variant={activeDataTab === 'filter' ? 'primary' : 'ghost'}
            size="small"
            buttonStyle="embedded"
            onClick={() => setActiveDataTab('filter')}
          >
            Filter
          </Button>
          <Button
            variant={activeDataTab === 'chartType' ? 'primary' : 'ghost'}
            size="small"
            buttonStyle="embedded"
            onClick={() => setActiveDataTab('chartType')}
          >
            Type
          </Button>
          <Button
            variant={activeDataTab === 'encoding' ? 'primary' : 'ghost'}
            size="small"
            buttonStyle="embedded"
            onClick={() => setActiveDataTab('encoding')}
          >
            Encode
          </Button>
        </ButtonGroup>
      </div>

      {activeDataTab === 'dataset' && (
        <div className={styles.tabContent}>
          <DatasetSelector
            chartId={currentMark}
            currentDataset={currentDataset || ''}
            onSelect={handleDatasetSelect}
            datasetCache={datasetCache}
            setDatasetCache={setDatasetCache}
          />
        </div>
      )}

      {activeDataTab === 'filter' && (
        <div className={styles.tabContent}>
          <div>
            <div className={styles.control}>
              <label className={styles.label}>Field</label>
              <select
                className={styles.filterSelect}
                value={filterField || ''}
                onChange={(e) => {
                  console.log('FILTER FIELD CHANGE:', e.target.value);
                  setFilterField(e.target.value);
                }}
                onFocus={(e) => {
                  console.log('FILTER FIELD FOCUS - Adding dropdown-open class');
                  document.body.classList.add('dropdown-open');
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onBlur={(e) => {
                  console.log('FILTER FIELD BLUR - Removing dropdown-open class');
                  setTimeout(() => {
                    document.body.classList.remove('dropdown-open');
                  }, 150);
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  console.log('FILTER FIELD CLICK');
                  e.stopPropagation();
                }}
                onMouseDown={(e) => {
                  console.log('FILTER FIELD MOUSEDOWN');
                  e.stopPropagation();
                }}
              >
                <option value="">Select field to filter</option>
                {fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>
            {filterField && (
              <>
                <div className={styles.control}>
                  <label className={styles.label}>Filter Type</label>
                  <Select
                    value={filterType || ''}
                    onChange={(e) => setFilterType(e.target.value)}
                    onFocus={(e) => {
                      document.body.classList.add('dropdown-open');
                      e.stopPropagation();
                    }}
                    onBlur={(e) => {
                      document.body.classList.remove('dropdown-open');
                      e.stopPropagation();
                    }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater">Greater than</option>
                    <option value="less">Less than</option>
                  </Select>
                </div>
                <div className={styles.control}>
                  <label className={styles.label}>Value</label>
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Enter filter value"
                  />
                </div>
                <button className={styles.actionButton} onClick={applyFilter}>
                  Apply Filter
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {activeDataTab === 'chartType' && (
        <div className={styles.tabContent}>
          <p className={styles.description}>
            Choose the best visual mark for your data. Different marks work better for different types of data and comparisons.
          </p>
          <div className={styles.markTypeGrid}>
            {Object.entries(MARK_ENCODINGS).map(([type, config]) => (
              <div
                key={type}
                className={`${styles.markTypeCard} ${currentMark === type ? styles.active : ''}`}
                onClick={() => handleMarkTypeChange(type as MarkType)}
              >
                <div className={styles.markIcon}>{config.icon}</div>
                <div className={styles.markName}>{type}</div>
                <div className={styles.markTooltip}>
                  <div>{config.description}</div>
                  {config.hints && (
                    <ul>
                      {Object.entries(config.hints).map(([hint, description]) => (
                        <li key={hint}>{hint}: {description}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeDataTab === 'encoding' && (
        <div className={styles.tabContent}>
          <div>
            <div className={styles.buttonGroup}>
              <Button
                variant="secondary"
                size="small"
                buttonStyle="floating"
                onClick={handleRandomizeEncodings}
              >
                🎲 Random
              </Button>
              <Button
                variant="secondary"
                size="small"
                buttonStyle="floating"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                📋 Templates
              </Button>
              <Button
                variant="secondary"
                size="small"
                buttonStyle="floating"
                onClick={handleRecommendEncodings}
              >
                🤖 Smart
              </Button>
            </div>

            {showTemplates && (
              <div className={styles.templateSection}>
                <label className={styles.label}>Chart Templates</label>
                <div className={styles.templateGrid}>
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className={styles.recommendationCard}
                      onClick={() => handleApplyTemplate(template)}
                    >
                      <div className={styles.templateHeader}>
                        <span className={styles.templateIcon}>{template.icon}</span>
                        <div className={styles.recommendationTitle}>{template.name}</div>
                      </div>
                      <div className={styles.recommendationReason}>{template.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations.length > 0 && (
              <div className={styles.recommendationSection}>
                <label className={styles.label}>AI Recommendations</label>
                {recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={styles.recommendationCard}
                    onClick={() => applyRecommendation(rec)}
                  >
                    <div className={styles.recommendationTitle}>
                      {rec.chartType} Chart
                      <div className={`${styles.confidenceBadge} ${styles[`confidence-${Math.round(rec.confidence * 10) * 10}`]}`}>
                        {Math.round(rec.confidence * 100)}% confident
                      </div>
                    </div>
                    <div className={styles.recommendationReason}>
                      {rec.reason}
                    </div>
                    <div className={styles.suggestionText}>
                      Suggested encodings: {Object.entries(rec.suggestedEncodings)
                        .map(([channel, enc]) => {
                          if (Array.isArray(enc)) {
                            return `${channel}: [Array of ${enc.length} fields]`;
                          } else if (enc && typeof enc === 'object' && 'field' in enc && 'type' in enc) {
                            return `${channel}: ${enc.field} (${enc.type})`;
                          }
                          return `${channel}: [${typeof enc}]`;
                        })
                        .join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.columnsSection}>
              <h3 className={styles.sectionTitle}>Available Columns</h3>
              <div className={styles.availableColumnsContainer}>
                {/* Group by data type */}
                {(() => {
                  // Organize columns by type
                  const columnsByType = {
                    quantitative: [] as ColumnMetadata[],
                    temporal: [] as ColumnMetadata[],
                    nominal: [] as ColumnMetadata[],
                    ordinal: [] as ColumnMetadata[]
                  };
                  
                  Object.values(columnMetadata).forEach(column => {
                    if (column.type in columnsByType) {
                      columnsByType[column.type as keyof typeof columnsByType].push(column);
                    } else {
                      columnsByType.nominal.push(column);
                    }
                  });
                  
                  return (
                    <>
                      {Object.entries(columnsByType).map(([type, columns]) => {
                        if (columns.length === 0) return null;
                        
                        return (
                          <div key={type} className={styles.columnTypeSection}>
                            <div className={styles.columnTypeHeading}>
                              {type === 'quantitative' && <NumbersIcon fontSize="small" />}
                              {type === 'temporal' && <TimelineIcon fontSize="small" />}
                              {type === 'nominal' && <CategoryIcon fontSize="small" />}
                              {type === 'ordinal' && <BarChartIcon fontSize="small" />}
                              {type.charAt(0).toUpperCase() + type.slice(1)} ({columns.length})
                            </div>
                            <div className={styles.columnTokenContainer}>
                              {columns.map(column => (
                                <DataColumnToken 
                                  key={column.name}
                                  column={column}
                                  showStats={true}
                                  onClick={(col) => {
                                    const bestChannel = suggestEncodingChannel(col);
                                    if (bestChannel) {
                                      handleColumnDrop(bestChannel, col);
                                    }
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className={styles.encodingsSection}>
              {renderEncodingSection()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const EncodingField: React.FC<{
  label: string;
  field: string;
  type: string;
  onChange: (field: string, type: string) => void;
  availableFields?: string[];
}> = ({ label, field, type, onChange, availableFields = [] }) => {
  const types = [
    { value: 'quantitative', icon: <NumbersIcon />, label: 'Quantitative' },
    { value: 'temporal', icon: <TimelineIcon />, label: 'Time Series' },
    { value: 'nominal', icon: <CategoryIcon />, label: 'Nominal' },
    { value: 'ordinal', icon: <BarChartIcon />, label: 'Ordinal' }
  ]
  
  return (
    <div className={styles.encodingRow}>
      <div className={styles.encodingLabel}>{label}</div>
      <select 
        value={field} 
        onChange={(e) => onChange(e.target.value, type)}
      >
        <option value="">Select field</option>
        {availableFields.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <div className={styles.encodingTypeControls}>
        {types.map(t => (
          <Tooltip key={t.value} title={t.label}>
            <button
              className={`${styles.encodingTypeButton} ${type === t.value ? styles.active : ''}`}
              onClick={() => onChange(field, t.value)}
            >
              {t.icon}
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

// Add these helper functions above the component
const isCompatibleEncoding = (channel: string, markType: MarkType): boolean => {
  const commonChannels = ['x', 'y', 'color', 'tooltip'];
  const compatibleChannels: Record<MarkType, string[]> = {
    bar: [...commonChannels, 'size', 'text'],
    line: [...commonChannels, 'strokeWidth', 'order', 'text'],
    point: [...commonChannels, 'size', 'shape', 'text'],
    circle: [...commonChannels, 'size', 'text'],
    area: [...commonChannels, 'order', 'text'],
    text: [...commonChannels, 'text', 'size', 'angle'],
    boxplot: [...commonChannels, 'size', 'text'],
    arc: ['theta', 'radius', 'color', 'tooltip', 'text'],
    rect: [...commonChannels, 'size', 'fill', 'stroke', 'text'],
    rule: [...commonChannels, 'size', 'strokeWidth', 'text'],
    square: [...commonChannels, 'size', 'fill', 'text'],
    tick: [...commonChannels, 'size', 'thickness', 'text'],
    trail: [...commonChannels, 'size', 'strokeWidth', 'order', 'text'],
    image: [...commonChannels, 'url', 'aspect'],
    geoshape: [...commonChannels, 'shape', 'stroke', 'fill'],
    errorband: [...commonChannels, 'extent', 'band'],
    errorbar: [...commonChannels, 'extent'],
    violin: [...commonChannels, 'size', 'fill', 'density', 'text'],
    sunburst: ['theta', 'radius', 'color', 'tooltip', 'text'],
    treemap: ['size', 'color', 'tooltip', 'text']
  };

  return compatibleChannels[markType]?.includes(channel) ?? false;
};

// Add more detailed templates with encoding options
const CHART_TEMPLATES: ChartTemplate[] = [
  {
    name: 'Time Series',
    icon: '📈',
    markType: 'line',
    description: 'Visualize trends over time',
    encodings: {
      x: { type: 'temporal', timeUnit: 'yearmonth' },
      y: { type: 'quantitative' },
      color: { type: 'nominal' }
    },
    config: {
      interpolate: 'monotone',
      point: true
    }
  },
  {
    name: 'Bar Comparison',
    icon: '📊',
    markType: 'bar',
    description: 'Compare values across categories',
    encodings: {
      x: { type: 'nominal' },
      y: { type: 'quantitative', aggregate: 'sum' },
      color: { type: 'nominal' }
    }
  },
  {
    name: 'Scatter Plot',
    icon: '🔵',
    markType: 'point',
    description: 'Visualize relationships between two variables',
    encodings: {
      x: { type: 'quantitative' },
      y: { type: 'quantitative' },
      size: { type: 'quantitative' },
      color: { type: 'nominal' }
    }
  },
  {
    name: 'Binned Heatmap',
    icon: '🟦',
    markType: 'rect',
    description: 'Show density of points with binning',
    encodings: {
      x: { type: 'quantitative', bin: true },
      y: { type: 'quantitative', bin: true },
      color: { type: 'quantitative', aggregate: 'count' }
    }
  },
  {
    name: 'Pie Chart',
    icon: '🥧',
    markType: 'arc',
    description: 'Show composition of a whole',
    encodings: {
      theta: { type: 'quantitative', aggregate: 'sum' },
      color: { type: 'nominal' }
    }
  },
  {
    name: 'Box Plot',
    icon: '📦',
    markType: 'boxplot',
    description: 'Show distribution statistics',
    encodings: {
      x: { type: 'nominal' },
      y: { type: 'quantitative' },
      color: { type: 'nominal' }
    }
  },
  {
    name: 'Monthly Trends',
    icon: '📅',
    markType: 'line',
    description: 'Visualize monthly patterns',
    encodings: {
      x: { type: 'temporal', timeUnit: 'month' },
      y: { type: 'quantitative', aggregate: 'mean' },
      color: { type: 'nominal' }
    }
  },
  {
    name: 'Histogram',
    icon: '📊',
    markType: 'bar',
    description: 'Show distribution of values',
    encodings: {
      x: { type: 'quantitative', bin: { maxbins: 20 } },
      y: { type: 'quantitative', aggregate: 'count' }
    }
  }
];

 