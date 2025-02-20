import styled from 'styled-components'
import { sampleDatasets } from '../../utils/sampleData'
import { MarkType } from '../../types/vega'

const SelectorContainer = styled.div`
  margin-bottom: 24px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 8px;
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

interface DatasetSelectorProps {
  chartId: string;
  currentDataset: string;
  onSelect: (datasetId: string) => void;
}

export const DatasetSelector = ({ chartId, currentDataset, onSelect }: DatasetSelectorProps) => {
  // Filter datasets based on chart type
  const compatibleDatasets = Object.entries(sampleDatasets).filter(([_, dataset]) => {
    switch (chartId) {
      case 'sunburst':
        return dataset.type === 'hierarchical' && 
               dataset.values.some(v => 'parent' in v) &&
               dataset.values.some(v => 'value' in v)
      case 'force-directed':
      case 'chord-diagram':
        return dataset.type === 'hierarchical' && 
               dataset.values.some(v => 'source' in v)
      default:
        return dataset.compatibleCharts.includes(chartId as MarkType)
    }
  })

  return (
    <SelectorContainer>
      {compatibleDatasets.map(([id, dataset]) => (
        <DatasetCard
          key={id}
          $active={currentDataset === id}
          onClick={() => onSelect(id)}
        >
          <DatasetName>{dataset.name}</DatasetName>
          <DatasetDescription>{dataset.description}</DatasetDescription>
        </DatasetCard>
      ))}
    </SelectorContainer>
  )
} 