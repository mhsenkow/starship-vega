import styled from 'styled-components'
import { ChartCategory, ComplexityLevel } from '../../types/chart'

const FilterContainer = styled.div`
  padding: 16px 24px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  gap: 16px;
`

const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background: white;
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

      <Select
        value={complexity}
        onChange={(e) => onComplexityChange(e.target.value as ComplexityLevel | 'All')}
      >
        <option value="All">All Levels</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </Select>
    </FilterContainer>
  )
}
