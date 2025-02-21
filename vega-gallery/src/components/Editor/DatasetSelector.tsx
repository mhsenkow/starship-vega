import styled from 'styled-components'
import { DatasetSelectorBaseProps } from '../../types/dataset'
import { detectDataTypes, inferChartType, determineDatasetType } from '../../utils/dataUtils'
import { sampleDatasets } from '../../utils/sampleData'
import { DatasetMetadata } from '../../types/dataset'
import { useMemo } from 'react'
import { ErrorBoundary } from '../ErrorBoundary'

const SelectorContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const DatasetGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`

const DatasetCard = styled.button<{ $active: boolean; $compatible: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px;
  background: ${props => props.$active ? 
    props.theme.colors?.primary?.[50] || '#ebf8ff' : 
    'white'
  };
  border: 1px solid ${props => props.$active ? 
    props.theme.colors?.primary?.[200] || '#90cdf4' : 
    props.theme.colors?.border || '#e2e8f0'
  };
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${props => props.$compatible ? 1 : 0.7};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const DatasetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`

const DatasetTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.neutral[900]};
`

const DatasetBadge = styled.span<{ $type: 'compatible' | 'type' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.$type === 'compatible' 
    ? props.theme.colors?.primary?.[100] || '#bee3f8'
    : props.theme.colors?.neutral?.[100] || '#f1f5f9'};
  color: ${props => props.$type === 'compatible' 
    ? props.theme.colors?.primary?.[700] || '#2c5282'
    : props.theme.colors?.neutral?.[700] || '#334155'};
`

const DatasetDescription = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.neutral[600]};
  margin: 0 0 12px 0;
`

const DatasetFields = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`

const FieldTag = styled.span<{ $type: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${props => {
    const colors = props.theme.colors;
    switch(props.$type) {
      case 'quantitative': return colors?.blue?.[50] || '#ebf8ff';
      case 'temporal': return colors?.green?.[50] || '#f0fff4';
      case 'nominal': return colors?.purple?.[50] || '#faf5ff';
      case 'ordinal': return colors?.orange?.[50] || '#fff8f1';
      default: return colors?.neutral?.[50] || '#f8fafc';
    }
  }};
  color: ${props => {
    const colors = props.theme.colors;
    switch(props.$type) {
      case 'quantitative': return colors?.blue?.[700] || '#2b6cb0';
      case 'temporal': return colors?.green?.[700] || '#2f855a';
      case 'nominal': return colors?.purple?.[700] || '#553c9a';
      case 'ordinal': return colors?.orange?.[700] || '#c05621';
      default: return colors?.neutral?.[700] || '#334155';
    }
  }};
`

const DataPreview = styled.div`
  margin-top: 12px;
  padding: 8px;
  background: ${props => props.theme.colors.neutral[50]};
  border-radius: 4px;
  font-family: ${props => props.theme.typography.fontFamily.mono};
  font-size: 0.8rem;
  max-height: 80px;
  overflow-y: auto;
`

const BadgeContainer = styled.div`
  display: flex;
  gap: 8px;
`

/**
 * Dataset selection component
 * - Handles dataset browsing and selection
 * - Shows dataset compatibility with current chart
 * - Manages custom dataset uploads
 * Dependencies: sampleData, dataUtils
 */

interface DatasetSelectorProps {
  chartId: string;
  currentDataset: string;
  onSelect: (datasetId: string) => void;
  mode?: 'editor' | 'gallery';
  customDatasets?: Record<string, DatasetMetadata>;
  setCustomDatasets?: (datasets: Record<string, DatasetMetadata>) => void;
}

export const DatasetSelector = (props: DatasetSelectorProps) => {
  return (
    <ErrorBoundary fallback={<div>Error loading dataset selector. Please try again.</div>}>
      <DatasetSelectorInner {...props} />
    </ErrorBoundary>
  );
};

const DatasetSelectorInner = ({
  chartId,
  currentDataset,
  onSelect,
  customDatasets,
  setCustomDatasets,
  mode
}: DatasetSelectorProps) => {
  // Sort datasets by compatibility with current chart type
  const sortedDatasets = useMemo(() => {
    console.log('Available datasets:', Object.keys(sampleDatasets));
    return Object.entries(sampleDatasets)
      .map(([id, dataset]) => ({
        id,
        ...dataset,
        compatible: dataset.compatibleCharts.includes(chartId as MarkType),
        fieldTypes: detectDataTypes(dataset.values)
      }))
      .sort((a, b) => {
        if (a.compatible && !b.compatible) return -1;
        if (!a.compatible && b.compatible) return 1;
        return 0;
      });
  }, [chartId]);

  return (
    <SelectorContainer>
      <DatasetGrid>
        {sortedDatasets.map(dataset => (
          <DatasetCard
            key={dataset.id}
            $active={currentDataset === dataset.id}
            $compatible={dataset.compatible}
            onClick={() => {
              console.log('Dataset card clicked:', dataset.id);
              console.log('Dataset values:', dataset.values);
              onSelect(dataset.id);
            }}
          >
            <DatasetHeader>
              <DatasetTitle>{dataset.name}</DatasetTitle>
              <BadgeContainer>
                {dataset.compatible && (
                  <DatasetBadge $type="compatible">Compatible</DatasetBadge>
                )}
                <DatasetBadge $type="type">{dataset.type}</DatasetBadge>
              </BadgeContainer>
            </DatasetHeader>
            
            <DatasetDescription>{dataset.description}</DatasetDescription>
            
            <DatasetFields>
              {Object.entries(dataset.fieldTypes).map(([field, type]) => (
                <FieldTag key={field} $type={type}>
                  {field}: {type}
                </FieldTag>
              ))}
            </DatasetFields>

            <DataPreview>
              {JSON.stringify(dataset.values[0], null, 2)}
            </DataPreview>
          </DatasetCard>
        ))}
      </DatasetGrid>
    </SelectorContainer>
  );
};

// Add a helper function for safe theme color access
const getThemeColor = (theme: any, path: string[], fallback: string): string => {
  return path.reduce((obj, key) => obj?.[key], theme.colors) || fallback;
}; 