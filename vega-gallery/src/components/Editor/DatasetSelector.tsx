import { useState } from 'react'
import styled from 'styled-components'
import { sampleDatasets } from '../../utils/sampleData'
import { MarkType } from '../../types/vega'
import { DatasetMetadata } from '../../types/dataset'

const Container = styled.div`
  margin-top: 16px;
`

const DatasetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const DatasetCard = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 12px;
  background: white;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? 'white' : '#f8f9fa'};
  }
`

const DatasetName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text.primary};
  margin-bottom: 4px;
`

const DatasetDescription = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
  margin-bottom: 8px;
`

const DatasetMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: ${props => props.theme.text.secondary};
`

const Badge = styled.span`
  padding: 2px 6px;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 0.8rem;
`

interface DatasetSelectorProps {
  currentDataset: string;
  onSelect: (datasetId: string) => void;
  customDatasets?: Record<string, DatasetMetadata>;
}

export const DatasetSelector = ({ 
  currentDataset, 
  onSelect,
  customDatasets = {}
}: DatasetSelectorProps) => {
  // Combine sample and custom datasets
  const allDatasets = {
    ...sampleDatasets,
    ...customDatasets
  };

  return (
    <Container>
      <DatasetList>
        {/* Show uploaded datasets first */}
        {Object.entries(customDatasets).map(([id, dataset]) => (
          <DatasetCard
            key={id}
            $active={currentDataset === id}
            onClick={() => onSelect(id)}
          >
            <DatasetName>{dataset.name}</DatasetName>
            <DatasetDescription>{dataset.description}</DatasetDescription>
            <DatasetMeta>
              <span>Rows: {dataset.values.length}</span>
              <span>Columns: {Object.keys(dataset.values[0] || {}).length}</span>
              <Badge>Uploaded</Badge>
            </DatasetMeta>
          </DatasetCard>
        ))}

        {/* Then show sample datasets */}
        {Object.entries(sampleDatasets).map(([id, dataset]) => (
          <DatasetCard
            key={id}
            $active={currentDataset === id}
            onClick={() => onSelect(id)}
          >
            <DatasetName>{dataset.name}</DatasetName>
            <DatasetDescription>{dataset.description}</DatasetDescription>
            <DatasetMeta>
              <span>Rows: {dataset.values.length}</span>
              <span>Columns: {Object.keys(dataset.values[0] || {}).length}</span>
              <Badge>Sample</Badge>
            </DatasetMeta>
          </DatasetCard>
        ))}
      </DatasetList>
    </Container>
  );
} 