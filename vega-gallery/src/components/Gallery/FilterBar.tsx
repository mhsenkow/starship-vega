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
  searchTerm: string
  onCategoryChange: (category: ChartCategory | 'All') => void
  onComplexityChange: (complexity: ComplexityLevel | 'All') => void
  onSearchChange: (term: string) => void
  sortBy: 'category' | 'complexity'
  onSortChange: (sort: 'category' | 'complexity') => void
}

export const FilterBar = ({
  category,
  complexity,
  searchTerm,
  onCategoryChange,
  onComplexityChange,
  onSearchChange,
  sortBy,
  onSortChange
}: FilterBarProps) => {
  return (
    <FilterContainer>
      <SearchGroup>
        <SearchInput
          type="search"
          placeholder="Search charts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchGroup>

      <FilterGroup>
        <Label>Category:</Label>
        <Select 
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as ChartCategory | 'All')}
        >
          <option value="All">All Categories</option>
          <option value="Statistical">Statistical</option>
          <option value="Time Series">Time Series</option>
          <option value="Distribution">Distribution</option>
          <option value="Correlation">Correlation</option>
          <option value="Part-to-Whole">Part-to-Whole</option>
          <option value="Hierarchical">Hierarchical</option>
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>Complexity:</Label>
        <ComplexityButtons>
          {['Beginner', 'Intermediate', 'Advanced'].map(level => (
            <ComplexityButton
              key={level}
              $active={complexity === level}
              onClick={() => onComplexityChange(complexity === level ? 'All' : level as ComplexityLevel)}
            >
              {level}
            </ComplexityButton>
          ))}
        </ComplexityButtons>
      </FilterGroup>

      <FilterGroup>
        <Label>Sort by:</Label>
        <Select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'category' | 'complexity')}
        >
          <option value="category">Category</option>
          <option value="complexity">Complexity</option>
        </Select>
      </FilterGroup>
    </FilterContainer>
  )
}

const SearchGroup = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
`

const ComplexityButtons = styled.div`
  display: flex;
  gap: 8px;
`

const ComplexityButton = styled.button<{ $active: boolean }>`
  padding: 4px 12px;
  border-radius: 16px;
  border: none;
  background: ${props => props.$active ? '#4C78A8' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : 'black'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#4C78A8' : '#e0e0e0'};
  }
`
