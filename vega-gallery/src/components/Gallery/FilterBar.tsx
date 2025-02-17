import styled from 'styled-components'
import { ChartCategory, ComplexityLevel } from '../../types/chart'

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
`

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  color: #495057;
  min-width: 150px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #adb5bd;
  }

  &:focus {
    border-color: #4dabf7;
    outline: none;
    box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.2);
  }
`

interface FilterBarProps {
  category: ChartCategory | 'All'
  complexity: ComplexityLevel | 'All'
  onCategoryChange: (category: ChartCategory | 'All') => void
  onComplexityChange: (complexity: ComplexityLevel | 'All') => void
}

export const FilterBar = ({
  category,
  complexity,
  onCategoryChange,
  onComplexityChange
}: FilterBarProps) => {
  return (
    <FilterContainer>
      <FilterGroup>
        <Label>Category:</Label>
        <Select 
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as ChartCategory | 'All')}
        >
          <option value="All">All Categories</option>
          <option value="Statistical">Statistical</option>
          <option value="Time Series">Time Series</option>
          <option value="Hierarchical">Hierarchical</option>
          <option value="Geographic">Geographic</option>
          <option value="Other">Other</option>
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>Complexity:</Label>
        <Select
          value={complexity}
          onChange={(e) => onComplexityChange(e.target.value as ComplexityLevel | 'All')}
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </Select>
      </FilterGroup>
    </FilterContainer>
  )
}
