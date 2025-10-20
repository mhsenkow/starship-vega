import { useState, useMemo, lazy, Suspense } from 'react'
import { FilterBar } from './FilterBar'
import { ChartConfig, ChartCategory, Complexity } from '../../types/chart'
import { sampleCharts } from '../../charts/sampleCharts'
import { ChartFilter } from './ChartFilter'
import styles from './GalleryGrid.module.css'

interface GalleryGridProps {
  onChartSelect: (chartId: string) => void;
}

const LazyChartCard = lazy(() => import('./ChartCard').then(module => ({ 
  default: module.default 
})))

export const GalleryGrid = ({ onChartSelect }: GalleryGridProps) => {
  const [category, setCategory] = useState<ChartCategory | 'All'>('All')
  const [complexity, setComplexity] = useState<Complexity | 'All'>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'category' | 'complexity'>('category')

  const filteredCharts = useMemo(() => {
    return sampleCharts.filter(chart => {
      if (category !== 'All' && chart.category !== category) return false;
      if (complexity !== 'All' && chart.complexity !== complexity) return false;
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          chart.title.toLowerCase().includes(search) ||
          chart.description.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [category, complexity, searchTerm]);

  const sortedCharts = useMemo(() => {
    return [...filteredCharts].sort((a, b) => {
      // First check if specs are empty
      const aHasSpec = Object.keys(a.spec || {}).length > 0
      const bHasSpec = Object.keys(b.spec || {}).length > 0
      
      if (aHasSpec !== bHasSpec) {
        return aHasSpec ? -1 : 1
      }

      if (sortBy === 'category') {
        return a.category.localeCompare(b.category)
      } else {
        const complexityOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 }
        return complexityOrder[a.complexity] - complexityOrder[b.complexity]
      }
    })
  }, [filteredCharts, sortBy])

  return (
    <div className={styles.container}>
      <FilterBar
        category={category}
        complexity={complexity}
        searchTerm={searchTerm}
        sortBy={sortBy}
        filteredCharts={filteredCharts}
        onCategoryChange={setCategory}
        onComplexityChange={setComplexity}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
      />
      <div className={styles.grid}>
        <Suspense fallback={<div>Loading...</div>}>
          {sortedCharts.map(chart => (
            <LazyChartCard 
              key={chart.id} 
              chart={chart}
              onClick={() => onChartSelect(chart.id)}
            />
          ))}
        </Suspense>
      </div>
    </div>
  )
}
