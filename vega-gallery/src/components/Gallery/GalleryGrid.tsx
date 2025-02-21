import styled from 'styled-components'
import { useState, useMemo } from 'react'
import { FilterBar } from './FilterBar'
import { ChartCard } from './ChartCard'
import { chartSpecs } from '../../charts/specs'
import { ChartCategory, Complexity } from '../../types/chart'
import { TopLevelSpec } from 'vega-lite'

const Container = styled.div`
  padding: 24px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`

interface GalleryGridProps {
  onChartSelect: (chartId: string) => void;
}

/**
 * Main gallery view component
 * - Displays grid of available chart types
 * - Handles chart selection and filtering
 * - Renders chart previews using ChartCard
 * Dependencies: ChartCard, chartSpecs
 */

interface ChartPreview {
  id: string;
  title: string;
  description: string;
  spec: TopLevelSpec;
  category: ChartCategory;
  complexity: Complexity;
}

export const GalleryGrid = ({ onChartSelect }: GalleryGridProps) => {
  const [category, setCategory] = useState<ChartCategory | 'All'>('All')
  const [complexity, setComplexity] = useState<Complexity | 'All'>('All')
  const [searchTerm, setSearchTerm] = useState('')

  const charts = useMemo<ChartPreview[]>(() => {
    return Object.entries(chartSpecs).map(([id, spec]) => ({
      id,
      title: id.replace(/([A-Z])/g, ' $1').trim(),
      description: `A ${id.toLowerCase()} visualization`,
      spec,
      category: ChartCategory.Statistical,
      complexity: Complexity.Beginner
    }));
  }, []);

  const filteredCharts = useMemo(() => {
    return charts.filter(chart => {
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
  }, [charts, category, complexity, searchTerm]);

  return (
    <Container>
      <FilterBar
        category={category}
        complexity={complexity}
        searchTerm={searchTerm}
        onCategoryChange={setCategory}
        onComplexityChange={setComplexity}
        onSearchChange={setSearchTerm}
      />
      <Grid>
        {filteredCharts.map(chart => (
          <ChartCard
            key={chart.id}
            chart={chart}
            onClick={() => onChartSelect(chart.id)}
          />
        ))}
      </Grid>
    </Container>
  )
}
