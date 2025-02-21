import React from 'react';
import styled from 'styled-components';
import { DatasetMetadata, DatasetSelectorBaseProps } from '../../types/dataset';
import { MarkType } from '../../types/vega';
import { DataUploader } from '../Editor/DataUploader';
import { detectDataTypes, inferChartType, determineDatasetType } from '../../utils/dataUtils';

const SelectorContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
  max-height: 400px;
  overflow-y: auto;
  border: ${props => props.theme.borders.width.thin} solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borders.radius.lg};
  padding: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const DatasetCard = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid ${props => props.$active ? '#4dabf7' : '#e9ecef'};
  border-radius: 6px;
  background: ${props => props.$active ? 'rgba(77, 171, 247, 0.1)' : '#ffffff'};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4dabf7;
    background: ${props => props.$active ? 
      'rgba(77, 171, 247, 0.1)' : 
      '#f8f9fa'};
  }
`;

const DatasetName = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const DatasetDescription = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const DatasetMeta = styled.div`
  font-size: 0.75rem;
  color: #868e96;
  margin-top: 4px;
`;

const determineCompatibleCharts = (dataTypes: Record<string, string>): MarkType[] => {
  return inferChartType(dataTypes);
};

interface DatasetSelectorProps extends DatasetSelectorBaseProps {
  allowUpload?: boolean;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  chartId,
  currentDataset,
  onSelect,
  customDatasets = {},
  setCustomDatasets,
  allowUpload = false
}) => {
  const handleNewDataset = (dataset: DatasetMetadata) => {
    if (setCustomDatasets) {
      setCustomDatasets({
        ...customDatasets,
        [dataset.id]: dataset
      });
    }
  };

  // Filter datasets based on chart type
  const compatibleDatasets = Object.entries(customDatasets).filter(([_, dataset]) => {
    switch (chartId) {
      case 'sunburst':
        return dataset.type === 'hierarchical' && 
               dataset.values.some((v: any) => 'parent' in v) &&
               dataset.values.some((v: any) => 'value' in v);
      case 'force-directed':
      case 'chord-diagram':
        return dataset.type === 'hierarchical' && 
               dataset.values.some((v: any) => 'source' in v);
      default:
        return dataset.compatibleCharts.includes(chartId as MarkType);
    }
  });

  return (
    <SelectorContainer>
      {allowUpload && setCustomDatasets && (
        <DataUploader 
          onDatasetAdd={handleNewDataset}
          detectDataTypes={detectDataTypes}
          determineCompatibleCharts={determineCompatibleCharts}
          determineDatasetType={determineDatasetType}
        />
      )}
      {compatibleDatasets.map(([id, dataset]) => (
        <DatasetCard
          key={id}
          $active={currentDataset === id}
          onClick={() => onSelect(id)}
        >
          <DatasetName>
            {dataset.name}
            {dataset.source === 'custom' && ' (Custom)'}
          </DatasetName>
          <DatasetDescription>{dataset.description}</DatasetDescription>
          {dataset.source === 'custom' && dataset.uploadDate && (
            <DatasetMeta>
              Uploaded: {new Date(dataset.uploadDate).toLocaleDateString()}
            </DatasetMeta>
          )}
        </DatasetCard>
      ))}
    </SelectorContainer>
  );
}; 