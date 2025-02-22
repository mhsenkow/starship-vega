import styled from 'styled-components'
import { TopLevelSpec } from 'vega-lite'
import { useMemo, useState, useRef, useEffect } from 'react'
import { EncodingChannel, MarkType, EncodingUpdate } from '../../types/vega'
import { sampleDatasets } from '../../utils/sampleData'
import { DatasetSelector } from './DatasetSelector'
import { generateRandomEncoding } from '../../utils/chartAdapters'
import { IconButton, Tooltip } from '@mui/material'
import TimelineIcon from '@mui/icons-material/Timeline'
import BarChartIcon from '@mui/icons-material/BarChart'
import CategoryIcon from '@mui/icons-material/Category'
import NumbersIcon from '@mui/icons-material/Numbers'
import { DatasetMetadata } from '../../types/dataset'
import Papa from 'papaparse'
import { DatasetSection } from './DatasetSection'
import { DataTransformerPanel } from './DataTransformerPanel'
import { markTypes } from '../../constants/markTypes'
import { inferDataTypes } from '../../utils/dataUtils'
import { getChartRecommendations } from '../../services/aiRecommendations'
import AutoGraphIcon from '@mui/icons-material/AutoGraph'
import RecommendIcon from '@mui/icons-material/Recommend'

const Container = styled.div`
  padding: 16px;
  height: 100%;
  overflow-y: auto;
`

const Section = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
`

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
`

const Control = styled.div`
  margin-bottom: 16px;
  &:last-child {
    margin-bottom: 0;
  }
`

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 500;
`

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  color: #495057;
  transition: border-color 0.2s;

  &:hover {
    border-color: #adb5bd;
  }

  &:focus {
    border-color: #4dabf7;
    outline: none;
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
  }
`

const EncodingGrid = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
`

const EncodingControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TypeButtons = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 4px;
  background: #f8f9fa;
  border-radius: 4px;
`

const TypeButton = styled(IconButton)<{ $active: boolean }>`
  && {
    background: ${props => props.$active ? props.theme.colors.primary + '20' : 'transparent'};
    color: ${props => props.$active ? props.theme.colors.primary : props.theme.text.secondary};
    border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
    padding: 4px;

    &:hover {
      background: ${props => props.$active ? props.theme.colors.primary + '30' : props.theme.colors.border + '40'};
    }
  }
`

const EncodingTypeButton = styled(IconButton)<{ $active: boolean; $compatible?: boolean }>`
  && {
    background: ${props => props.$active ? props.theme.colors.primary + '20' : 'transparent'};
    color: ${props => 
      props.$active ? props.theme.colors.primary : 
      props.$compatible !== false ? props.theme.text.secondary :
      props.theme.colors.border};
    opacity: ${props => props.$compatible !== false ? 1 : 0.5};
    cursor: ${props => props.$compatible !== false ? 'pointer' : 'not-allowed'};
    padding: 4px;
    border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
    
    &:hover {
      background: ${props => props.$compatible !== false ? props.theme.colors.primary + '10' : 'transparent'};
    }
  }
`;

const DatasetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
    
    &:hover {
      background: #bbb;
    }
  }
`

const DatasetCard = styled.button<{ $active: boolean; $disabled: boolean }>`
  padding: 12px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.$active ? `${props.theme.colors.primary}10` : 'white'};
  text-align: left;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.5 : 1};
  
  &:hover {
    border-color: ${props => !props.$disabled && props.theme.colors.primary};
  }
`

const DatasetName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`

const DatasetDescription = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
`

const RandomizeButton = styled.button`
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;

  &:hover {
    background: #f8f9fa;
  }
`

const EncodingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 8px;
`

const MarkTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
`

const MarkTypeCard = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: ${props => props.$active ? props.theme.colors.primary + '10' : '#fff'};
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : '#e9ecef'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary + '05'};
  }
`

const MarkIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`

const MarkName = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
`

const MarkTooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  width: max-content;
  max-width: 200px;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s;
  z-index: 1000;

  ul {
    margin: 4px 0 0 0;
    padding: 0 0 0 16px;
    list-style-type: none;
    
    li {
      margin: 2px 0;
      &:before {
        content: "•";
        margin-right: 4px;
      }
    }
  }

  ${MarkTypeCard}:hover & {
    visibility: visible;
    opacity: 1;
    bottom: calc(100% + 8px);
  }

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.8);
  }
`

const MarkInfo = styled.div`
  text-align: center;
`

const MarkDescription = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
`

const DatasetInfo = styled.div`
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
`

const EncodingRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 12px;
  align-items: center;
`;

const EncodingLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
`;

const EncodingTypeControls = styled.div`
  display: flex;
  gap: 4px;
`;

const EncodingHint = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary};
  margin-top: 4px;
`;

const EncodingPreview = styled.div`
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-top: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
`;

const Accordion = styled.div`
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;

  &:last-child {
    margin-bottom: 0;
  }
`;

const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 16px;
  background: #f8f9fa;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text.primary};
  transition: background 0.2s;

  &:hover {
    background: #f1f3f5;
  }

  svg {
    transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
    transition: transform 0.3s ease;
  }
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  padding: 0;
  height: ${props => props.$isOpen ? 'auto' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  
  > div {
    padding: 16px;
  }
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    opacity: 0.9;
  }
`;

const RecommendButton = styled(ActionButton)`
  background: #6366f1;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    font-size: 18px;
  }
`;

const RecommendationCard = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  text-align: left;
  background: ${props => props.$active ? '#f0f7ff' : 'white'};
  border: 1px solid ${props => props.$active ? '#4dabf7' : '#e9ecef'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4dabf7;
    background: #f8f9fa;
  }
`;

const RecommendationTitle = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const RecommendationReason = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 8px;
`;

const ConfidenceBadge = styled.span<{ $confidence: number }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${props => {
    if (props.$confidence > 0.8) return '#d3f9d8';
    if (props.$confidence > 0.6) return '#fff3bf';
    return '#ffe3e3';
  }};
  color: ${props => {
    if (props.$confidence > 0.8) return '#2b8a3e';
    if (props.$confidence > 0.6) return '#e67700';
    return '#c92a2a';
  }};
`;

interface AccordionStates {
  data: boolean;
  filter: boolean;
  chartType: boolean;
  encoding: boolean;
}

interface DataTransform {
  type: 'filter' | 'calculate' | 'aggregate' | 'bin' | 'timeUnit';
  field?: string;
  as?: string;
  operation?: string;
  value?: any;
  test?: (d: any) => boolean;
}

interface ExtendedSpec extends TopLevelSpec {
  mark?: string | {
    type: string;
    [key: string]: any;
  };
  encoding?: {
    [key: string]: {
      field?: string;
      type?: string;
      [key: string]: any;
    };
  };
  data?: {
    values?: any[];
    [key: string]: any;
  };
}

interface VisualEditorProps {
  spec: ExtendedSpec;
  onChange: (updates: Partial<ExtendedSpec>) => void;
}

export const VisualEditor = ({ spec, onChange }: VisualEditorProps) => {
  const [currentDataset, setCurrentDataset] = useState<string | null>(null);
  const [customDatasets, setCustomDatasets] = useState<Record<string, DatasetMetadata>>({});
  const [filterField, setFilterField] = useState('');
  const [filterType, setFilterType] = useState('equals');
  const [filterValue, setFilterValue] = useState('');
  const currentMark = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
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
  const handleDatasetSelect = (datasetId: string) => {
    const dataset = customDatasets[datasetId] || sampleDatasets[datasetId];
    if (!dataset) return;

    setCurrentDataset(datasetId);
    
    // Preserve current mark type and encoding while updating data
    const currentMark = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type;
    const currentEncoding = spec.encoding;
    
    onChange({
      ...spec,
      data: { values: dataset.values },
      // Ensure mark type persists
      mark: typeof spec.mark === 'string' ? currentMark : { 
        ...spec.mark, 
        type: currentMark 
      },
      // Keep current encoding if it exists
      encoding: currentEncoding
    });
  };

  const handleMarkTypeChange = (markType: MarkType) => {
    // Get current encodings that are compatible with the new mark type
    const compatibleEncodings = {};
    const currentEncodings = spec.encoding || {};
    
    // Smart defaults based on mark type
    switch (markType) {
      case 'bar':
        // Try to make categorical x-axis and quantitative y-axis
        if (currentEncodings.x?.field) {
          compatibleEncodings['x'] = {
            ...currentEncodings.x,
            type: 'nominal' // Force categorical for bars
          };
        }
        if (currentEncodings.y?.field) {
          compatibleEncodings['y'] = {
            ...currentEncodings.y,
            type: 'quantitative',
            aggregate: 'sum' // Add aggregation for bars
          };
        }
        break;

      case 'line':
        // Try to make x temporal if possible
        if (currentEncodings.x?.field) {
          const field = currentEncodings.x.field;
          const isTimeField = spec.data?.values?.some(d => !isNaN(Date.parse(d[field])));
          compatibleEncodings['x'] = {
            ...currentEncodings.x,
            type: isTimeField ? 'temporal' : currentEncodings.x.type
          };
        }
        break;

      case 'arc':
        // Convert to pie chart configuration
        if (currentEncodings.y?.field) {
          compatibleEncodings['theta'] = {
            field: currentEncodings.y.field,
            type: 'quantitative'
          };
        }
        if (currentEncodings.x?.field) {
          compatibleEncodings['color'] = {
            field: currentEncodings.x.field,
            type: 'nominal'
          };
        }
        break;

      // Add more cases for other mark types
    }

    // Add mark-specific configurations
    const markConfig = {
      type: markType,
      tooltip: true,
      ...(markType === 'point' && {
        type: 'point',
        size: 50,
        filled: true,
        shape: 'circle',
        stroke: '#4c78a8',
        strokeWidth: 2
      }),
      ...(markType === 'line' && { 
        point: true,
        interpolate: 'monotone'
      }),
      ...(markType === 'area' && { 
        line: true,
        opacity: 0.7
      }),
      ...(markType === 'bar' && {
        cornerRadius: 2
      }),
      ...(markType === 'circle' && {
        opacity: 0.7
      })
    };

    onChange({
      ...spec,
      mark: markConfig,
      encoding: compatibleEncodings
    });
  };

  const handleEncodingChange = (channel: string, update: EncodingUpdate) => {
    // Check if the encoding is compatible with the current mark type
    if (currentMark === 'line' && (channel === 'theta' || channel === 'radius')) {
      console.warn(`${channel} encoding is not compatible with line mark`);
      return;
    }

    const currentEncoding = spec.encoding?.[channel] || {};
    
    // Get compatible types for this field
    const compatibleTypes = update.field ? 
      getCompatibleTypes(update.field, spec.data?.values || []) : 
      ['nominal'];
    
    // If type is being updated, ensure it's compatible
    if (update.type && !compatibleTypes.includes(update.type)) {
      update.type = compatibleTypes[0];
    }
    
    // Set appropriate scale based on type
    let scale = undefined;
    if (update.type === 'quantitative') {
      scale = { type: 'linear', zero: channel === 'y' };
    } else if (update.type === 'temporal') {
      scale = { type: 'time' };
    } else {
      scale = { type: 'point' };
    }

    onChange({
      ...spec,
      encoding: {
        ...spec.encoding,
        [channel]: {
          ...currentEncoding,
          ...update,
          ...(scale && { scale })
        }
      }
    });
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
    try {
      const mark = typeof spec.mark === 'string' ? spec.mark : spec.mark?.type
      switch (mark) {
        case 'text':
          return ['x', 'y', 'text', 'color', 'size', 'angle', 'tooltip'];
        case 'circle':
          return ['x', 'y', 'size', 'color', 'tooltip'];
        case 'point':
          return ['x', 'y', 'size', 'color', 'shape', 'tooltip'];
        case 'bar':
          return ['x', 'y', 'color', 'tooltip', 'order'];
        case 'line':
          return ['x', 'y', 'color', 'strokeWidth', 'tooltip', 'order'];
        case 'area':
          return ['x', 'y', 'color', 'tooltip', 'order'];
        case 'boxplot':
          return ['x', 'y', 'color', 'tooltip'];
        case 'text':
          return ['x', 'y', 'text', 'color', 'size', 'tooltip'];
        default:
          return ['x', 'y', 'color', 'tooltip'];
      }
    } catch (err) {
      console.error('Error getting available encodings:', err)
      return ['x', 'y']
    }
  }

  const detectDataTypes = (values: any[]): Record<string, string> => {
    if (!values.length) return {}
    
    const sampleRow = values[0]
    const types: Record<string, string> = {}
    
    Object.entries(sampleRow).forEach(([field, value]) => {
      if (typeof value === 'number') {
        types[field] = 'quantitative'
      } else if (value instanceof Date || !isNaN(Date.parse(value as string))) {
        types[field] = 'temporal'
      } else if (typeof value === 'string') {
        // Check if it's ordinal (numbers as strings) or nominal
        const isNumeric = !isNaN(Number(value))
        types[field] = isNumeric ? 'ordinal' : 'nominal'
      }
    })
    
    return types
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

  const handleRandomize = () => {
    if (!spec.data?.values?.length) return;

    // Get available fields from data
    const fields = Object.keys(spec.data.values[0]);
    
    // Generate random encodings
    const newEncodings = generateRandomEncoding(fields, spec.data.values);

    // Preserve the current mark configuration while updating encodings
    const currentMark = typeof spec.mark === 'string' ? { type: spec.mark } : spec.mark;
    
    onChange({
      ...spec,
      mark: {
        ...currentMark,
        // Ensure we keep mark-specific configurations
        ...(currentMark.type === 'point' && {
          filled: true,
          stroke: currentMark.stroke || '#4c78a8',
          strokeWidth: currentMark.strokeWidth || 2
        })
      },
      encoding: newEncodings
    });
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

    const dataset = {
      values: spec.data.values,
      dataTypes: inferDataTypes(spec.data.values)
    };

    const recs = getChartRecommendations(dataset);
    setRecommendations(recs);
  };

  const applyRecommendation = (recommendation) => {
    const newSpec = {
      ...spec,
      mark: recommendation.chartType,
      encoding: Object.entries(recommendation.suggestedEncodings).reduce((acc, [channel, config]) => ({
        ...acc,
        [channel]: {
          field: config.field,
          type: config.type,
          ...(config.aggregate && { aggregate: config.aggregate }),
          ...(config.scale && { scale: config.scale })
        }
      }), {})
    };

    onChange(newSpec);
  };

  if (!spec) {
    return <div>Invalid specification</div>
  }

  return (
    <Container>
      <Accordion>
        <AccordionHeader 
          onClick={() => toggleAccordion('data')}
          $isOpen={accordionStates.data}
        >
          Dataset
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </AccordionHeader>
        <AccordionContent $isOpen={accordionStates.data}>
          <div>
            <DatasetSection onDatasetLoad={handleDataUpload} />
            <DatasetSelector
              currentDataset={currentDataset || ''}
              onSelect={handleDatasetSelect}
              customDatasets={customDatasets}
            />
            {spec.data?.values && (
              <>
                <DatasetInfo>
                  <div>Rows: {spec.data.values.length}</div>
                  <div>
                    Columns: {Object.keys(spec.data.values[0] || {}).length}
                  </div>
                </DatasetInfo>
                <DataTransformerPanel
                  dataset={{
                    id: 'current',
                    name: 'Current Dataset',
                    description: '',
                    values: spec.data.values
                  }}
                  onDatasetUpdate={(updatedDataset) => {
                    onChange({
                      ...spec,
                      data: { values: updatedDataset.values }
                    });
                  }}
                />
              </>
            )}
          </div>
        </AccordionContent>
      </Accordion>

      <Accordion>
        <AccordionHeader 
          onClick={() => toggleAccordion('filter')}
          $isOpen={accordionStates.filter}
        >
          Filter
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </AccordionHeader>
        <AccordionContent $isOpen={accordionStates.filter}>
          <div>
            <Control>
              <Label>Field</Label>
              <Select
                value={filterField || ''}
                onChange={(e) => setFilterField(e.target.value)}
              >
                <option value="">Select field to filter</option>
                {fields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </Select>
            </Control>
            {filterField && (
              <>
                <Control>
                  <Label>Filter Type</Label>
                  <Select
                    value={filterType || ''}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="equals">Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greater">Greater than</option>
                    <option value="less">Less than</option>
                  </Select>
                </Control>
                <Control>
                  <Label>Value</Label>
                  <input
                    type="text"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    placeholder="Enter filter value"
                  />
                </Control>
                <ActionButton onClick={applyFilter}>
                  Apply Filter
                </ActionButton>
              </>
            )}
          </div>
        </AccordionContent>
      </Accordion>

      <Accordion>
        <AccordionHeader 
          onClick={() => toggleAccordion('chartType')}
          $isOpen={accordionStates.chartType}
        >
          Chart Type
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </AccordionHeader>
        <AccordionContent $isOpen={accordionStates.chartType}>
          <p style={{ color: '#6c757d', marginBottom: '16px' }}>
            Choose the best visual mark for your data. Different marks work better for different types of data and comparisons.
          </p>
          <MarkTypeGrid>
            {markTypes.map(mark => (
              <MarkTypeCard
                key={mark.type}
                $active={currentMark === mark.type}
                onClick={() => handleMarkTypeChange(mark.type)}
              >
                <MarkIcon>{mark.icon}</MarkIcon>
                <MarkName>{mark.name}</MarkName>
                <MarkTooltip>
                  <div>{mark.description}</div>
                  {mark.bestFor && (
                    <ul>
                      {mark.bestFor.map(use => (
                        <li key={use}>{use}</li>
                      ))}
                    </ul>
                  )}
                </MarkTooltip>
              </MarkTypeCard>
            ))}
          </MarkTypeGrid>
        </AccordionContent>
      </Accordion>

      <Accordion>
        <AccordionHeader 
          onClick={() => toggleAccordion('encoding')}
          $isOpen={accordionStates.encoding}
        >
          Encoding
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </AccordionHeader>
        <AccordionContent $isOpen={accordionStates.encoding}>
          <div>
            <div style={{ 
              display: 'flex', 
              gap: '8px',
              marginBottom: '16px' 
            }}>
              <RandomizeButton onClick={handleRandomize}>
                🎲 Randomize Encodings
              </RandomizeButton>
              <RecommendButton onClick={handleRecommendEncodings}>
                <RecommendIcon />
                Smart Recommend
              </RecommendButton>
            </div>

            {recommendations.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <Label>AI Recommendations</Label>
                {recommendations.map((rec, i) => (
                  <RecommendationCard
                    key={i}
                    $active={false}
                    onClick={() => applyRecommendation(rec)}
                  >
                    <RecommendationTitle>
                      {rec.chartType} Chart
                      <ConfidenceBadge $confidence={rec.confidence}>
                        {Math.round(rec.confidence * 100)}% confident
                      </ConfidenceBadge>
                    </RecommendationTitle>
                    <RecommendationReason>
                      {rec.reason}
                    </RecommendationReason>
                    <div style={{ fontSize: '0.9rem' }}>
                      Suggested encodings: {Object.entries(rec.suggestedEncodings)
                        .map(([channel, field]) => `${channel}=${field}`)
                        .join(', ')}
                    </div>
                  </RecommendationCard>
                ))}
              </div>
            )}

            {getAvailableEncodings().map(channel => (
              <Control key={channel}>
                <EncodingGrid>
                  <Label>{channel.toUpperCase()}</Label>
                  <EncodingControl>
                    <Select
                      value={spec.encoding?.[channel]?.field || ''}
                      onChange={(e) => handleEncodingChange(channel, { field: e.target.value })}
                    >
                      <option value="">Select field</option>
                      {fields.map(field => (
                        <option key={field} value={field}>{field}</option>
                      ))}
                    </Select>
                    
                    {spec.encoding?.[channel]?.field && (
                      <>
                        <TypeButtons>
                          {[
                            { type: 'quantitative', icon: <NumbersIcon />, label: 'Number' },
                            { type: 'temporal', icon: <TimelineIcon />, label: 'Time' },
                            { type: 'nominal', icon: <CategoryIcon />, label: 'Category' },
                            { type: 'ordinal', icon: <BarChartIcon />, label: 'Ordered' }
                          ].map(({ type, icon, label }) => {
                            const field = spec.encoding?.[channel]?.field;
                            const compatibleTypes = field ? 
                              getCompatibleTypes(field, spec.data?.values || []) : 
                              [];
                            const isCompatible = compatibleTypes.includes(type);
                            
                            return (
                              <Tooltip key={type} title={label}>
                                <span>
                                  <EncodingTypeButton
                                    $active={spec.encoding?.[channel]?.type === type}
                                    $compatible={isCompatible}
                                    onClick={() => isCompatible && handleEncodingChange(channel, { type })}
                                    size="small"
                                    disabled={!isCompatible}
                                  >
                                    {icon}
                                  </EncodingTypeButton>
                                </span>
                              </Tooltip>
                            );
                          })}
                        </TypeButtons>
                        
                        <EncodingHint>
                          {channel === 'x' && 'Usually numbers or dates for x-axis'}
                          {channel === 'y' && 'Usually numbers for y-axis'}
                          {channel === 'color' && 'Categories work well for color'}
                          {channel === 'size' && 'Numbers work best for size'}
                        </EncodingHint>
                      </>
                    )}
                  </EncodingControl>
                </EncodingGrid>
              </Control>
            ))}
          </div>
        </AccordionContent>
      </Accordion>
    </Container>
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
    <EncodingRow>
      <EncodingLabel>{label}</EncodingLabel>
      <select 
        value={field} 
        onChange={(e) => onChange(e.target.value, type)}
      >
        <option value="">Select field</option>
        {availableFields.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <EncodingTypeControls>
        {types.map(t => (
          <Tooltip key={t.value} title={t.label}>
            <EncodingTypeButton
              $active={type === t.value}
              onClick={() => onChange(field, t.value)}
              size="small"
            >
              {t.icon}
            </EncodingTypeButton>
          </Tooltip>
        ))}
      </EncodingTypeControls>
    </EncodingRow>
  );
};

// Add these helper functions above the component
const isCompatibleEncoding = (channel: string, markType: MarkType): boolean => {
  const commonChannels = ['x', 'y', 'color', 'tooltip'];
  const compatibleChannels: Record<MarkType, string[]> = {
    bar: [...commonChannels, 'size'],
    line: [...commonChannels, 'strokeWidth', 'order'],
    point: [...commonChannels, 'size', 'shape'],
    circle: [...commonChannels, 'size'],
    area: [...commonChannels, 'order'],
    text: [...commonChannels, 'text', 'size', 'angle'],
    boxplot: commonChannels,
    arc: ['theta', 'radius', 'color', 'tooltip'],
    rect: [...commonChannels, 'size', 'fill', 'stroke'],
    rule: [...commonChannels, 'size', 'strokeWidth'],
    square: [...commonChannels, 'size', 'fill'],
    tick: [...commonChannels, 'size', 'thickness'],
    trail: [...commonChannels, 'size', 'strokeWidth', 'order'],
    image: [...commonChannels, 'url', 'aspect'],
    geoshape: [...commonChannels, 'shape', 'stroke', 'fill'],
    errorband: [...commonChannels, 'extent', 'band'],
    errorbar: [...commonChannels, 'extent'],
    violin: [...commonChannels, 'size', 'fill', 'density']
  };

  return compatibleChannels[markType]?.includes(channel) ?? false;
};

const getDefaultEncoding = (channel: string, field: string, type: string = 'quantitative') => {
  return {
    field,
    type,
    ...(type === 'quantitative' ? { scale: { zero: true } } : {})
  };
};

const getCompatibleTypes = (field: string, values: any[]): string[] => {
  if (!values.length || !values[0]?.[field]) return ['nominal'];
  
  const sampleValue = values[0][field];
  const allValues = values.map(v => v[field]).filter(v => v != null);
  
  const types = [];
  
  // Check for quantitative
  if (allValues.every(v => typeof v === 'number' && isFinite(v))) {
    types.push('quantitative');
  }
  
  // Check for temporal
  if (allValues.every(v => !isNaN(Date.parse(String(v))))) {
    types.push('temporal');
  }
  
  // Check for ordinal
  const uniqueValues = new Set(allValues);
  if (uniqueValues.size <= 20) {
    types.push('ordinal');
  }
  
  // Always allow nominal
  types.push('nominal');
  
  return types;
}; 