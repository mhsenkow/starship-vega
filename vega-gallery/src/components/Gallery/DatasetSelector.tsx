import React from 'react';
import styled from 'styled-components';
import { DatasetMetadata } from '../../types/dataset';
import { DataUploader } from '../Editor/DataUploader';
import { detectDataTypes, inferChartType } from '../../utils/dataUtils';

const SelectorContainer = styled.div`
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DatasetCard = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$active ? `${props.theme.colors.primary}10` : props.theme.colors.surface};
  text-align: left;
  cursor: pointer;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DatasetName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text.primary};
  margin-bottom: 4px;
`;

const DatasetDescription = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
`;

const DatasetMeta = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary};
  margin-top: 4px;
`;

interface DatasetSelectorProps {
  chartId: string;
  currentDataset: string;
  onSelect: (datasetId: string) => void;
  customDatasets?: Record<string, DatasetMetadata>;
  setCustomDatasets?: (datasets: Record<string, DatasetMetadata>) => void;
  allowUpload?: boolean;
}

const determineCompatibleCharts = (dataTypes: Record<string, string>): string[] => {
  return inferChartType(dataTypes);
};

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
    const compatibleCharts = determineCompatibleCharts(dataset.dataTypes || {});
    return compatibleCharts.includes(chartId);
  });

  return (
    <SelectorContainer>
      {allowUpload && setCustomDatasets && (
        <DataUploader 
          onDatasetAdd={handleNewDataset}
          detectDataTypes={detectDataTypes}
          determineCompatibleCharts={determineCompatibleCharts}
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