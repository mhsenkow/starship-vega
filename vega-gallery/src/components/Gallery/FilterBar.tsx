import React from 'react';
import { ChartCategory, Complexity, ChartConfig } from '../../types/chart'
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem';
import styles from './FilterBar.module.css'

interface FilterBarProps {
  category: ChartCategory | 'All';
  complexity: Complexity | 'All';
  searchTerm: string;
  sortBy: 'category' | 'complexity';
  filteredCharts: ChartConfig[];
  onCategoryChange: (category: ChartCategory | 'All') => void;
  onComplexityChange: (complexity: Complexity | 'All') => void;
  onSearchChange: (term: string) => void;
  onSortChange: (sort: 'category' | 'complexity') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  category,
  complexity,
  searchTerm,
  sortBy,
  filteredCharts,
  onCategoryChange,
  onComplexityChange,
  onSearchChange,
  onSortChange
}) => {
  const categories = Object.values(ChartCategory);

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search charts..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchInput}
      />
      <div className={styles.filterGroup}>
        <label className={styles.label}>Category:</label>
        <select 
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as ChartCategory | 'All')}
          className={styles.select}
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat} ({filteredCharts.filter(c => c.category === cat).length})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Complexity:</label>
        <select
          value={complexity}
          onChange={(e) => onComplexityChange(e.target.value as Complexity | 'All')}
          className={styles.select}
        >
          <option value="All">All Levels</option>
          {Object.values(Complexity).map(level => (
            <option key={level} value={level}>
              {level} ({filteredCharts.filter(c => c.complexity === level).length})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Sort by:</label>
        <ButtonGroup buttonStyle="embedded">
          <Button
            variant={sortBy === 'category' ? 'primary' : 'ghost'}
            size="small"
            buttonStyle="embedded"
            onClick={() => onSortChange('category')}
          >
            Category
          </Button>
          <Button
            variant={sortBy === 'complexity' ? 'primary' : 'ghost'}
            size="small"
            buttonStyle="embedded"
            onClick={() => onSortChange('complexity')}
          >
            Complexity
          </Button>
        </ButtonGroup>
      </div>

      <span className={styles.chartCount}>{filteredCharts.length} charts</span>
    </div>
  )
}
