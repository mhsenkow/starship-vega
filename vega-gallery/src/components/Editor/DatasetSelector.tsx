import styled from 'styled-components'
import { sampleDatasets } from '../../utils/sampleData'
import { MarkType } from '../../types/vega'

const SelectorContainer = styled.div`
  margin-bottom: 24px;
`

const DatasetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 12px;
`

const DatasetCard = styled.button<{ $active: boolean }>`
  padding: 12px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$active ? `${props.theme.colors.primary}10` : props.theme.colors.surface};
  text-align: left;
  cursor: pointer;
  
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
  currentDataset: string;
  currentMark: MarkType;
  onSelect: (datasetId: string) => void;
}

export const DatasetSelector = ({ currentDataset, currentMark, onSelect }: DatasetSelectorProps) => {
  return (
    <SelectorContainer>
      <DatasetGrid>
        {Object.entries(sampleDatasets).map(([id, dataset]) => (
          <DatasetCard
            key={id}
            $active={currentDataset === id}
            onClick={() => onSelect(id)}
            disabled={!dataset.compatibleCharts.includes(currentMark)}
          >
            <DatasetName>{dataset.name}</DatasetName>
            <DatasetDescription>{dataset.description}</DatasetDescription>
          </DatasetCard>
        ))}
      </DatasetGrid>
    </SelectorContainer>
  )
} 