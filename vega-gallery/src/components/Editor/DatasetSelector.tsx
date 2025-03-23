/**
 * Handles dataset selection and management.
 * Supports both sample and custom uploaded datasets.
 */

import { useState, useMemo, useCallback, memo } from 'react'
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
  // Memoize dataset stats calculation
  const datasetStats = useMemo(() => ({
    custom: Object.entries(customDatasets).map(([id, dataset]) => ({
      id,
      dataset,
      columnCount: Object.keys(dataset.values[0] || {}).length,
      rowCount: dataset.values.length
    })),
    sample: Object.entries(sampleDatasets).map(([id, dataset]) => ({
      id,
      dataset,
      columnCount: Object.keys(dataset.values[0] || {}).length,
      rowCount: dataset.values.length
    }))
  }), [customDatasets]);

  const DatasetCardMemo = memo(({ 
    id, 
    dataset, 
    columnCount, 
    rowCount, 
    isCustom 
  }: {
    id: string;
    dataset: DatasetMetadata;
    columnCount: number;
    rowCount: number;
    isCustom: boolean;
  }) => (
    <DatasetCard
      $active={currentDataset === id}
      onClick={() => onSelect(id)}
    >
      <DatasetName>{dataset.name}</DatasetName>
      <DatasetDescription>{dataset.description}</DatasetDescription>
      <DatasetMeta>
        <span>Rows: {rowCount}</span>
        <span>Columns: {columnCount}</span>
        <Badge>{isCustom ? 'Uploaded' : 'Sample'}</Badge>
      </DatasetMeta>
    </DatasetCard>
  ));

  return (
    <Container>
      <DatasetList>
        {datasetStats.custom.map(({ id, dataset, columnCount, rowCount }) => (
          <DatasetCardMemo
            key={id}
            id={id}
            dataset={dataset}
            columnCount={columnCount}
            rowCount={rowCount}
            isCustom={true}
          />
        ))}
        {datasetStats.sample.map(({ id, dataset, columnCount, rowCount }) => (
          <DatasetCardMemo
            key={id}
            id={id}
            dataset={dataset}
            columnCount={columnCount}
            rowCount={rowCount}
            isCustom={false}
          />
        ))}
      </DatasetList>
    </Container>
  );
} 