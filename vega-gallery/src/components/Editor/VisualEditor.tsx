import styled from 'styled-components'
import { TopLevelSpec } from 'vega-lite'
import { useMemo, useState, useEffect } from 'react'
import type { EncodingChannel, MarkType, EncodingField } from '../../types/vega'
import { sampleDatasets } from '../../utils/sampleData'
import { DatasetSelector } from './DatasetSelector'
import { generateRandomEncoding } from '../../utils/chartAdapters'
import type { DatasetMetadata } from '../../types/dataset'
import { analyzeDataset } from '../../utils/dataAnalyzer'
import { detectDataTypes } from '../../utils/dataUtils'
import type { ChartSpec } from '../../types/vega'
import {
  NumbersOutlined,
  CalendarMonthOutlined, 
  CategoryOutlined,
  SortOutlined,
  HelpOutline,
  BarChart,
  Timeline,
  ScatterPlot,
  PieChart,
  StackedLineChart
} from '@mui/icons-material';
import { Tooltip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import React from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

const HeaderSection = styled.div`
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
`

const ScrollSection = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  
  ${props => props.$isEncodingTab && `
    .section-title {
      display: none;
    }
  `}
`

const FooterSection = styled.div`
  padding: 16px;
  background: white;
  border-top: 1px solid #e2e8f0;
`

const Section = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: #334155;
  margin: 0 0 16px 0;
  font-weight: 600;
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
  align-items: center;
`

const EncodingControl = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`

const EncodingLabel = styled.label`
  font-weight: 500;
  color: #475569;
  font-size: 0.875rem;
`

const EncodingSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #1e293b;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    border-color: #94a3b8;
  }

  &:focus {
    border-color: #64748b;
    outline: none;
    box-shadow: 0 0 0 2px rgba(100, 116, 139, 0.1);
  }
`

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

const DatasetCard = styled.button<{ $active: boolean; $compatible: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${props => props.$active ? props.theme.colors?.primary?.[50] || '#ebf8ff' : 'white'};
  border: 1px solid ${props => props.$active 
    ? props.theme.colors?.primary?.[200] || '#90cdf4' 
    : props.theme.colors?.border || '#e2e8f0'};
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &:hover {
    background: #f8fafc;
    border-color: ${props => props.theme.colors.primary[200]};
  }
`

const DatasetName = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
  color: #2c3e50;
`

const DatasetDescription = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`

const RandomizeButton = styled.button`
  padding: 8px 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #4dabf7;
  }
`

const ChartSuggestions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
`

const SuggestionCard = styled.button<{ $active: boolean }>`
  padding: 12px;
  background: ${props => props.$active ? 'rgba(77, 171, 247, 0.1)' : 'white'};
  border: 1px solid ${props => props.$active ? '#4dabf7' : '#e9ecef'};
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  .title {
    font-weight: 500;
    color: ${props => props.$active ? '#4dabf7' : '#495057'};
    margin-bottom: 4px;
  }

  .reason {
    font-size: 0.8rem;
    color: #6c757d;
  }

  &:hover {
    border-color: #4dabf7;
    background: ${props => props.$active ? 'rgba(77, 171, 247, 0.15)' : 'rgba(77, 171, 247, 0.05)'};
  }
`

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const PreviewArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
`;

// Update styled components for better visual hierarchy
const ChartTypeSection = styled.div`
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ChartTypeGrid = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const ChartTypeButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: ${props => props.$active ? props.theme.colors.neutral[100] : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.neutral[900] : props.theme.colors.neutral[600]};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.neutral[100]};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SuggestedChartsSection = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  h4 {
    margin: 0 0 12px 0;
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 500;
  }
`;

// Add UI for showing why a visualization was chosen
const SuggestionReason = styled.div`
  margin-top: 8px;
  padding: 8px;
  background: #e7f5ff;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #1864ab;
`;

const EncodingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EncodingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Add type options
const DATA_TYPES = {
  quantitative: 'Number',
  temporal: 'Time',
  nominal: 'Category',
  ordinal: 'Ordinal'
};

// Add to the encoding controls section
const StackingControl = styled.div`
  margin: 16px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
`;

const CHART_TYPES = [
  { id: 'bar', label: 'Bar Chart', icon: '📊' },
  { id: 'line', label: 'Line Chart', icon: '📈' },
  { id: 'scatter', label: 'Scatter Plot', icon: '🔵' },
  { id: 'area', label: 'Area Chart', icon: '📉' },
  { id: 'pie', label: 'Pie Chart', icon: '🥧' }
] as const;

// Add styled components for the encoding controls
const EncodingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.surface.default};
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const EncodingControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FieldControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const FieldSelect = styled.select`
  flex: 1;
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: white;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary[400]};
  }
`;

const TypeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 120px; // Align with field name
  margin-top: 4px;
`;

const TypeToggleGroup = styled(ToggleButtonGroup)`
  &.MuiToggleButtonGroup-root {
    gap: 4px;
  }
`;

const TypeToggle = styled(ToggleButton)<{ $disabled?: boolean }>`
  &.MuiToggleButton-root {
    border: 1px solid ${props => props.theme.colors.border};
    padding: 6px;
    min-width: 36px;
    opacity: ${props => props.$disabled ? 0.5 : 1};
    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
    
    &.Mui-selected {
      background: ${props => props.theme.colors.primary[100]};
      border-color: ${props => props.theme.colors.primary[500]};
      color: ${props => props.theme.colors.primary[700]};
    }

    svg {
      font-size: 18px;
    }
  }
`;

// Add type-safe interfaces for icons and labels
interface TypeIconMap {
  quantitative: JSX.Element;
  temporal: JSX.Element;
  nominal: JSX.Element;
  ordinal: JSX.Element;
}

interface TypeLabelMap {
  quantitative: string;
  temporal: string;
  nominal: string;
  ordinal: string;
}

// Update EncodingFieldProps to be more type-safe
interface EncodingFieldProps {
  channel: EncodingChannel;
  field: string;
  type: keyof TypeIconMap;
  availableFields: string[];
  compatibleTypes: Array<keyof TypeIconMap>;
  onChange: (field: string, type: keyof TypeIconMap) => void;
}

// Move the EncodingField component definition before the VisualEditor
const EncodingFieldComponent = ({
  channel,
  field,
  type,
  availableFields,
  compatibleTypes,
  onChange
}: EncodingFieldProps) => {
  const typeIcons: TypeIconMap = {
    quantitative: <NumbersOutlined />,
    temporal: <CalendarMonthOutlined />,
    nominal: <CategoryOutlined />,
    ordinal: <SortOutlined />
  };

  const typeLabels: TypeLabelMap = {
    quantitative: 'Numbers',
    temporal: 'Time',
    nominal: 'Categories',
    ordinal: 'Ordered Categories'
  };

  return (
    <EncodingRow>
      <EncodingHeader>
        <ChannelLabel>
          {channel}
          <Tooltip title={`Map data to the ${channel} channel`}>
            <HelpOutline fontSize="small" sx={{ fontSize: 16 }} />
          </Tooltip>
        </ChannelLabel>
        <FieldSelect
          value={field}
          onChange={(e) => onChange(e.target.value, type)}
        >
          <option value="">Select field</option>
          {availableFields.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </FieldSelect>
      </EncodingHeader>

      {field && (
        <TypeToggleContainer>
          <TypeToggleGroup
            value={type}
            exclusive
            onChange={(_, value) => value && onChange(field, value as keyof TypeIconMap)}
            size="small"
          >
            {(Object.keys(typeIcons) as Array<keyof TypeIconMap>).map(t => (
              <Tooltip 
                key={t} 
                title={typeLabels[t]}
                componentsProps={{
                  popper: {
                    sx: {
                      opacity: compatibleTypes.includes(t) ? 1 : 0
                    }
                  }
                }}
              >
                <span>
                  <TypeToggle 
                    value={t}
                    $disabled={!compatibleTypes.includes(t)}
                    disabled={!compatibleTypes.includes(t)}
                  >
                    {typeIcons[t]}
                  </TypeToggle>
                </span>
              </Tooltip>
            ))}
          </TypeToggleGroup>
        </TypeToggleContainer>
      )}
    </EncodingRow>
  );
};

// Update styled components with proper theme typing
const ChannelLabel = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.neutral[700]};
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;
  width: 120px;
`;

// Add these mark type configurations
const MARK_TYPES = {
  bar: {
    marks: ['bar', 'grouped', 'stacked'],
    defaultMark: 'bar'
  },
  line: {
    marks: ['line', 'area', 'trail'],
    defaultMark: 'line'
  },
  point: {
    marks: ['point', 'circle', 'square'],
    defaultMark: 'point'
  },
  pie: {
    marks: ['arc'],
    defaultMark: 'arc',
    defaultEncodings: {
      theta: { field: 'value', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    }
  },
  area: {
    marks: ['area', 'stacked', 'normalized'],
    defaultMark: 'area'
  }
} as const;

// Add the styled components for mark type selector
const MarkTypeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 8px;
  background: ${props => props.theme.colors.neutral[50]};
  border-radius: 6px;
`;

const MarkTypeButton = styled.button<{ $active: boolean }>`
  padding: 4px 8px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary[200] : 'transparent'};
  border-radius: 4px;
  background: ${props => props.$active ? props.theme.colors.primary[50] : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary[700] : props.theme.colors.neutral[600]};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? props.theme.colors.primary[100] : props.theme.colors.neutral[100]};
  }
`;

/**
 * Visual chart editor component
 * - Handles chart type switching and encoding updates
 * - Manages dataset selection and preview
 * Dependencies: DatasetSelector, chartAdapters
 */

interface VisualEditorProps {
  spec: ChartSpec;
  onChange: (spec: ChartSpec) => void;
}

// Add this function before the VisualEditor component
function getChartIcon(type: string) {
  const iconSize = 16;
  const iconColor = "currentColor";

  switch (type) {
    case 'bar':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <rect x="2" y="8" width="2" height="6" rx="1" fill={iconColor} />
          <rect x="7" y="4" width="2" height="10" rx="1" fill={iconColor} />
          <rect x="12" y="6" width="2" height="8" rx="1" fill={iconColor} />
        </svg>
      );
    case 'line':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <path d="M2 12L6 8L10 10L14 4" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'area':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <path d="M2 12L6 8L10 10L14 4V12H2Z" fill={iconColor} opacity="0.5" />
          <path d="M2 12L6 8L10 10L14 4" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'point':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <circle cx="4" cy="8" r="2" fill={iconColor} />
          <circle cx="8" cy="4" r="2" fill={iconColor} />
          <circle cx="12" cy="10" r="2" fill={iconColor} />
        </svg>
      );
    case 'pie':
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <path d="M8 2V8L14 8" stroke={iconColor} strokeWidth="2" />
          <circle cx="8" cy="8" r="6" stroke={iconColor} strokeWidth="2" fill="none" />
        </svg>
      );
    default:
      return (
        <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke={iconColor} strokeWidth="2" fill="none" />
        </svg>
      );
  }
}

// Update the default encodings function to be more specific for each chart type
const getDefaultEncodingsForType = (type: MarkType, sampleData: any) => {
  if (!sampleData) return {};

  const fields = Object.keys(sampleData);
  const dataTypes = detectDataTypes(sampleData);
  
  const numericFields = fields.filter(f => dataTypes[f] === 'number');
  const temporalFields = fields.filter(f => dataTypes[f] === 'date');
  const categoricalFields = fields.filter(f => dataTypes[f] === 'string');

  switch (type) {
    case 'bar':
      return {
        x: { field: categoricalFields[0], type: 'nominal' },
        y: { field: numericFields[0], type: 'quantitative' },
        tooltip: [
          { field: categoricalFields[0], type: 'nominal' },
          { field: numericFields[0], type: 'quantitative' }
        ]
      };

    case 'line':
      return {
        x: { 
          field: temporalFields[0] || categoricalFields[0], 
          type: temporalFields[0] ? 'temporal' : 'nominal' 
        },
        y: { field: numericFields[0], type: 'quantitative' },
        tooltip: [
          { field: temporalFields[0] || categoricalFields[0], type: temporalFields[0] ? 'temporal' : 'nominal' },
          { field: numericFields[0], type: 'quantitative' }
        ]
      };

    case 'point':
    case 'circle':
    case 'square':
      return {
        x: { field: numericFields[0], type: 'quantitative' },
        y: { field: numericFields[1] || numericFields[0], type: 'quantitative' },
        tooltip: numericFields.map(field => ({ field, type: 'quantitative' })),
        ...(categoricalFields.length > 0 && {
          color: { field: categoricalFields[0], type: 'nominal' }
        })
      };

    case 'arc':
    case 'pie':
      return {
        theta: { field: numericFields[0], type: 'quantitative', stack: true },
        color: { field: categoricalFields[0], type: 'nominal' },
        tooltip: [
          { field: categoricalFields[0], type: 'nominal' },
          { field: numericFields[0], type: 'quantitative' }
        ]
      };

    case 'area':
      return {
        x: { 
          field: temporalFields[0] || categoricalFields[0], 
          type: temporalFields[0] ? 'temporal' : 'nominal'
        },
        y: { field: numericFields[0], type: 'quantitative', stack: true },
        ...(categoricalFields.length > 0 && {
          color: { field: categoricalFields[0], type: 'nominal' }
        }),
        tooltip: [
          { field: temporalFields[0] || categoricalFields[0], type: temporalFields[0] ? 'temporal' : 'nominal' },
          { field: numericFields[0], type: 'quantitative' }
        ]
      };

    default:
      return {};
  }
};

// Update the mark configuration handling
const getMarkConfig = (chartType: keyof typeof MARK_TYPES, markType: string) => {
  const baseConfig = {
    type: markType,
    tooltip: true
  };

  switch (chartType) {
    case 'bar':
      return {
        ...baseConfig,
        cornerRadius: 0,
        orient: 'vertical'
      };
      
    case 'line':
      return {
        ...baseConfig,
        point: true,
        interpolate: 'linear'
      };
      
    case 'point':
      return {
        ...baseConfig,
        filled: true,
        size: 60
      };
      
    case 'pie':
      return {
        type: 'arc',
        tooltip: true,
        innerRadius: 0,
        padAngle: 0.05
      };
      
    case 'area':
      return {
        ...baseConfig,
        line: true,
        point: false
      };
      
    default:
      return baseConfig;
  }
};

// Update the handleMarkTypeChange function
const handleMarkTypeChange = (chartType: keyof typeof MARK_TYPES, markType?: string) => {
  const selectedMarkType = markType || MARK_TYPES[chartType].defaultMark;
  
  // Get default encodings for the new chart type
  const defaultEncodings = getDefaultEncodingsForType(selectedMarkType as MarkType, spec.data?.values?.[0]);

  // Create new spec with proper mark configuration
  const newSpec = {
    ...spec,
    mark: getMarkConfig(chartType, selectedMarkType),
    encoding: defaultEncodings,
    width: 'container',
    height: 'container',
    autosize: { type: 'fit', contains: 'padding' }
  };

  onChange(newSpec);
};

export const VisualEditor = ({ spec, onChange }: VisualEditorProps) => {
  const [currentDataset, setCurrentDataset] = useState(Object.keys(sampleDatasets)[0])
  const currentMark = useMemo(() => {
    if (!spec) return 'bar' as MarkType;
    return (typeof spec.mark === 'string' ? spec.mark : spec.mark.type) as MarkType;
  }, [spec])
  const [customDatasets, setCustomDatasets] = useState<Record<string, DatasetMetadata>>({});
  const [dataAnalysis, setDataAnalysis] = useState(() => 
    analyzeDataset(spec?.data?.values || [])
  );
  const [suggestionReason, setSuggestionReason] = useState<string | null>(null);
  const [isStacked, setIsStacked] = useState(true);
  
  // Get current dataset from either custom or sample datasets
  const getCurrentDataset = (datasetId: string) => {
    return customDatasets[datasetId] || sampleDatasets[datasetId];
  };

  // Update analysis when data changes
  useEffect(() => {
    setDataAnalysis(analyzeDataset(spec?.data?.values || []));
  }, [spec?.data?.values]);

  const handleDatasetChange = (datasetId: string) => {
    const dataset = getCurrentDataset(datasetId);
    if (!dataset) return;

    const { fields, suggestions } = analyzeDataset(dataset.values);
    
    if (suggestions.length > 0) {
      // Get the best suggestion
      const bestViz = suggestions[0];
      
      onChange({
        ...spec,
        data: { values: dataset.values },
        mark: { type: bestViz.markType },
        encoding: bestViz.encodings,
        width: 'container',
        height: 'container',
        autosize: {
          type: 'fit',
          contains: 'padding',
          resize: true
        }
      });

      // Show suggestion reason in UI
      setSuggestionReason(bestViz.reason);
    }

    setCurrentDataset(datasetId);
    setDataAnalysis({ fields, suggestions });
  };

  const adjustScaleForChartType = (
    markType: MarkType, 
    channel: EncodingChannel, 
    currentScale?: any
  ) => {
    switch (markType) {
      case 'line':
        if (channel === 'y') {
          return {
            ...currentScale,
            nice: true,
            zero: false,
            padding: 0.1
          };
        }
        if (channel === 'x') {
          return {
            ...currentScale,
            nice: true,
            padding: 0.1
          };
        }
        return currentScale;
      case 'bar':
        if (channel === 'y') {
          return {
            ...currentScale,
            nice: true,
            zero: true
          };
        }
        return currentScale;
      default:
        return currentScale;
    }
  };

  const getCompatibleEncodings = (markType: MarkType): EncodingChannel[] => {
    const commonEncodings: EncodingChannel[] = ['x', 'y', 'color', 'tooltip'];
    
    switch (markType) {
      case 'bar':
        return [...commonEncodings, 'xOffset'];
      case 'line':
        return [...commonEncodings, 'strokeWidth', 'order'];
      case 'point':
        return [...commonEncodings, 'size', 'shape'];
      case 'arc':
        return ['theta', 'radius', 'color', 'tooltip'] as EncodingChannel[];
      case 'area':
        return [...commonEncodings, 'order'];
      case 'boxplot':
        return [...commonEncodings];
      case 'text':
        return [...commonEncodings, 'size'];
      case 'rect':
        return [...commonEncodings, 'size'];
      case 'rule':
        return [...commonEncodings];
      case 'tick':
        return [...commonEncodings];
      case 'trail':
        return [...commonEncodings, 'order'];
      default:
        return commonEncodings;
    }
  }

  const handleEncodingChange = (channel: EncodingChannel, field: string, type: string) => {
    const newSpec = { ...spec };
    
    // Initialize encoding if it doesn't exist
    if (!newSpec.encoding) {
      newSpec.encoding = {};
    }

    if (field) {
      // Add or update encoding
      newSpec.encoding[channel] = {
        field,
        type,
        scale: adjustScaleForType(type, channel)
      };
    } else {
      // Remove encoding if field is empty
      const { [channel]: _, ...rest } = newSpec.encoding;
      newSpec.encoding = rest;
    }

    onChange(newSpec);
  };

  const handleEncodingTypeChange = (channel: string, newType: string) => {
    // Create new encoding with updated type
    const updatedEncoding = {
      ...encodings[channel],
      type: newType
    };

    // Create new encodings object
    const newEncodings = {
      ...encodings,
      [channel]: updatedEncoding
    };

    // Update local state
    setEncodings(newEncodings);

    // Update parent with new spec
    onChange({
      ...spec,
      encoding: newEncodings
    });

    // Adjust scale based on new type
    const adjustedSpec = adjustScaleForType(spec, channel, newType);
    onChange(adjustedSpec);
  };

  const adjustScaleForType = (currentSpec: any, channel: string, newType: string) => {
    const newSpec = { ...currentSpec };
    
    if (!newSpec.encoding[channel].scale) {
      newSpec.encoding[channel].scale = {};
    }

    switch (newType) {
      case 'quantitative':
        newSpec.encoding[channel].scale = {
          ...newSpec.encoding[channel].scale,
          type: 'linear',
          zero: channel === 'y',
          nice: true
        };
        break;
      case 'temporal':
        newSpec.encoding[channel].scale = {
          ...newSpec.encoding[channel].scale,
          type: 'time',
          nice: true
        };
        break;
      case 'ordinal':
        newSpec.encoding[channel].scale = {
          ...newSpec.encoding[channel].scale,
          type: 'point'
        };
        break;
      case 'nominal':
        newSpec.encoding[channel].scale = {
          ...newSpec.encoding[channel].scale,
          type: 'band'
        };
        break;
    }

    return newSpec;
  };

  // Add this function to handle field changes
  const handleFieldChange = (channel: string, field: string) => {
    const newEncodings = {
      ...encodings,
      [channel]: {
        ...encodings[channel],
        field
      }
    };

    setEncodings(newEncodings);
    onChange({
      ...spec,
      encoding: newEncodings
    });
  };

  // Add state for tracking current encodings
  const [encodings, setEncodings] = useState<Record<string, EncodingField>>(spec.encoding || {});

  const fields = useMemo(() => {
    if (!spec.data || !('values' in spec.data) || !Array.isArray(spec.data.values)) {
      return [];
    }
    return Object.keys(spec.data.values[0] || {});
  }, [spec.data]);

  const suggestEncodings = (markType: MarkType, currentEncoding: EncodingMap) => {
    const suggestedEncodings = getDefaultEncodings(markType);
    const rest = { ...currentEncoding };

    Object.keys(suggestedEncodings).forEach(channel => {
      if (suggestedEncodings[channel] && !rest[channel]) {
        rest[channel] = suggestedEncodings[channel];
      }
    });

    return rest;
  };

  const handleRandomize = () => {
    const randomEncoding = generateRandomEncoding(fields);
    onChange({
      ...spec,
      encoding: randomEncoding
    });
  };

  const handleStackingChange = (stacked: boolean) => {
    setIsStacked(stacked);
    const updatedSpec = {
      ...spec,
      encoding: {
        ...spec.encoding,
        y: {
          ...spec.encoding?.y,
          stack: stacked ? true : null
        },
        xOffset: stacked ? undefined : { field: spec.encoding?.color?.field }
      }
    };
    onChange(updatedSpec);
  };

  const getCompatibleTypes = (channel: EncodingChannel, markType: MarkType): Array<keyof TypeIconMap> => {
    const allTypes: Array<keyof TypeIconMap> = ['quantitative', 'temporal', 'nominal', 'ordinal'];
    
    switch (channel) {
      case 'x':
      case 'y':
        return markType === 'bar' ? 
          ['quantitative', 'temporal'] : 
          allTypes;
      
      case 'color':
        return ['nominal', 'ordinal', 'quantitative'];
      
      case 'size':
        return ['quantitative'];
      
      case 'shape':
        return ['nominal', 'ordinal'];
      
      default:
        return allTypes;
    }
  };

  if (!spec) {
    return <div>Loading...</div>
  }

  return (
    <Container>
      <HeaderSection>
        <ChartTypeSection>
          <SectionTitle>Chart Type</SectionTitle>
          <ChartTypeGrid>
            <ChartTypeButton 
              $active={currentMark === 'bar'} 
              onClick={() => handleMarkTypeChange('bar')}
              title="Bar Chart"
            >
              <BarChart />
            </ChartTypeButton>
            <ChartTypeButton 
              $active={currentMark === 'line'} 
              onClick={() => handleMarkTypeChange('line')}
              title="Line Chart"
            >
              <Timeline />
            </ChartTypeButton>
            <ChartTypeButton 
              $active={currentMark === 'point'} 
              onClick={() => handleMarkTypeChange('point')}
              title="Scatter Plot"
            >
              <ScatterPlot />
            </ChartTypeButton>
            <ChartTypeButton 
              $active={currentMark === 'area'} 
              onClick={() => handleMarkTypeChange('area')}
              title="Area Chart"
            >
              <StackedLineChart />
            </ChartTypeButton>
            <ChartTypeButton 
              $active={currentMark === 'arc' || currentMark === 'pie'} 
              onClick={() => handleMarkTypeChange('pie')}
              title="Pie Chart"
            >
              <PieChart />
            </ChartTypeButton>
          </ChartTypeGrid>
          
          {MARK_TYPES[currentMark as keyof typeof MARK_TYPES] && (
            <MarkTypeSelector>
              {MARK_TYPES[currentMark as keyof typeof MARK_TYPES].marks.map(markType => (
                <MarkTypeButton
                  key={markType}
                  $active={spec.mark === markType || (typeof spec.mark === 'object' && spec.mark.type === markType)}
                  onClick={() => handleMarkTypeChange(currentMark as keyof typeof MARK_TYPES, markType)}
                >
                  {markType}
                </MarkTypeButton>
              ))}
            </MarkTypeSelector>
          )}
        </ChartTypeSection>
      </HeaderSection>

      <ScrollSection $isEncodingTab={true}>
        <Section>
          <div className="section-title">
            <SectionTitle>Data & Encoding</SectionTitle>
          </div>
          <DatasetSelector
            chartId={currentMark}
            currentDataset={currentDataset}
            onSelect={handleDatasetChange}
            customDatasets={customDatasets}
            setCustomDatasets={setCustomDatasets}
            mode="editor"
          />
        </Section>
      </ScrollSection>

      <FooterSection>
        <EncodingSection>
          <EncodingHeader>
            <h4>Encoding Mappings</h4>
            <RandomizeButton onClick={handleRandomize}>
              🎲 Randomize
            </RandomizeButton>
          </EncodingHeader>
          {(['x', 'y', 'color', 'size', 'shape'] as EncodingChannel[]).map(channel => (
            <EncodingFieldComponent
              key={channel}
              channel={channel}
              field={spec.encoding?.[channel]?.field || ''}
              type={(spec.encoding?.[channel]?.type as keyof TypeIconMap) || 'quantitative'}
              availableFields={fields}
              compatibleTypes={getCompatibleTypes(channel, spec.mark as MarkType)}
              onChange={(field, type) => {
                const newSpec: ChartSpec = {
                  ...spec,
                  encoding: {
                    ...spec.encoding,
                    [channel]: { field, type }
                  }
                };
                onChange(newSpec);
              }}
            />
          ))}
          {spec.mark === 'bar' && (
            <StackingControl>
              <label>
                <input
                  type="checkbox"
                  checked={isStacked}
                  onChange={(e) => handleStackingChange(e.target.checked)}
                />
                Stack bars
              </label>
            </StackingControl>
          )}
        </EncodingSection>
      </FooterSection>
    </Container>
  )
}

// Helper function to get user-friendly channel labels
function getChannelLabel(channel: EncodingChannel): string {
  const labels: Record<EncodingChannel, string> = {
    x: 'X Axis',
    y: 'Y Axis',
    color: 'Color',
    size: 'Size',
    shape: 'Shape',
    text: 'Text',
    tooltip: 'Tooltip',
    order: 'Order',
    strokeWidth: 'Stroke Width',
    xOffset: 'X Offset',
    yOffset: 'Y Offset'
  };
  return labels[channel] || channel;
} 