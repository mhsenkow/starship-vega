import React from 'react';
import styled from 'styled-components'
import { ChartCategory, Complexity, ChartConfig } from '../../types/chart'

const Container = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Label = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`

const Select = styled.select`
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: white;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  cursor: pointer;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`

const SearchInput = styled.input`
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

interface FilterBarProps {
  category: ChartCategory | 'All';
  complexity: Complexity | 'All';
  searchTerm: string;
  onCategoryChange: (category: ChartCategory | 'All') => void;
  onComplexityChange: (complexity: Complexity | 'All') => void;
  onSearchChange: (term: string) => void;
}

export const FilterBar = ({
  category,
  complexity,
  searchTerm,
  onCategoryChange,
  onComplexityChange,
  onSearchChange
}: FilterBarProps) => {
  return (
    <Container>
      <SearchInput
        type="text"
        placeholder="Search charts..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <FilterGroup>
        <Label>Category:</Label>
        <Select 
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as ChartCategory | 'All')}
        >
          <option value="All">All Categories</option>
          {Object.values(ChartCategory).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
      </FilterGroup>

      <FilterGroup>
        <Label>Complexity:</Label>
        <Select
          value={complexity}
          onChange={(e) => onComplexityChange(e.target.value as Complexity | 'All')}
        >
          <option value="All">All Levels</option>
          {Object.values(Complexity).map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </Select>
      </FilterGroup>
    </Container>
  );
};
