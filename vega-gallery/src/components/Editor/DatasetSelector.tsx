import styled from 'styled-components'
import { sampleDatasets } from '../../utils/sampleData'
import { MarkType } from '../../types/vega'
import { useState } from 'react'
import { DataUploader } from './DataUploader'
import { DatasetMetadata } from '../types/vega'

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
`

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
`

const DatasetName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text.primary};
  margin-bottom: 4px;
`

const DatasetDescription = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
`

const DatasetMeta = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.text.secondary};
  margin-top: 4px;
`

interface DatasetSelectorProps {
  chartId: string;
  currentDataset: string;
  onSelect: (datasetId: string) => void;
  detectDataTypes: (values: any[]) => Record<string, string>;
  customDatasets: Record<string, DatasetMetadata>;
  setCustomDatasets: (datasets: Record<string, DatasetMetadata>) => void;
}

const determineDatasetType = (dataTypes: Record<string, string>): DatasetMetadata['type'] => {
  const types = new Set(Object.values(dataTypes));
  
  if (types.has('temporal')) return 'temporal';
  if (Object.keys(dataTypes).some(k => k.includes('parent') || k.includes('source'))) {
    return 'hierarchical';
  }
  if (types.has('quantitative')) return 'numerical';
  return 'categorical';
};

const determineCompatibleCharts = (dataTypes: Record<string, string>): MarkType[] => {
  const types = new Set(Object.values(dataTypes));
  const charts: MarkType[] = [];
  
  if (types.has('quantitative')) {
    charts.push('bar', 'line', 'point', 'area');
  }
  if (types.has('temporal')) {
    charts.push('line', 'area', 'point');
  }
  if (types.has('nominal') || types.has('ordinal')) {
    charts.push('bar', 'point');
  }
  
  return charts;
};

export const DatasetSelector = ({ chartId, currentDataset, onSelect, detectDataTypes, customDatasets, setCustomDatasets }: DatasetSelectorProps) => {
  const handleNewDataset = (dataset: DatasetMetadata) => {
    setCustomDatasets(prev => ({
      ...prev,
      [dataset.id]: dataset
    }));
  };

  // Filter datasets based on chart type
  const compatibleDatasets = Object.entries({
    ...sampleDatasets,
    ...customDatasets
  }).filter(([_, dataset]) => {
    switch (chartId) {
      case 'sunburst':
        return dataset.type === 'hierarchical' && 
               dataset.values.some(v => 'parent' in v) &&
               dataset.values.some(v => 'value' in v);
      case 'force-directed':
      case 'chord-diagram':
        return dataset.type === 'hierarchical' && 
               dataset.values.some(v => 'source' in v);
      default:
        return dataset.compatibleCharts.includes(chartId as MarkType);
    }
  });

  return (
    <SelectorContainer>
      <DataUploader 
        onDatasetAdd={handleNewDataset}
        detectDataTypes={detectDataTypes}
        determineCompatibleCharts={determineCompatibleCharts}
        determineDatasetType={determineDatasetType}
      />
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
          {dataset.source === 'custom' && (
            <DatasetMeta>
              Uploaded: {new Date(dataset.uploadDate).toLocaleDateString()}
            </DatasetMeta>
          )}
        </DatasetCard>
      ))}
    </SelectorContainer>
  );
} 