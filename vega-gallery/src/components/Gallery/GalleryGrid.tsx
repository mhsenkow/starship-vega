import styled from 'styled-components'
import { ChartCard } from './ChartCard'
import { useState } from 'react'
import { FilterBar } from './FilterBar'
import { ChartConfig, ChartCategory, ComplexityLevel } from '../../types/chart'
import { chartSpecs } from '../../utils/vegaHelper'

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

// We'll move this to a separate file later
const sampleCharts: ChartConfig[] = [
  {
    id: 'scatter-plot',
    title: 'Scatter Plot',
    description: 'A basic scatter plot showing the relationship between two variables',
    category: 'Statistical',
    complexity: 'Beginner',
    spec: {}
  },
  {
    id: 'bar-chart',
    title: 'Bar Chart',
    description: 'Simple bar chart for comparing categorical data',
    category: 'Statistical',
    complexity: 'Beginner',
    spec: {}
  },
  {
    id: 'line-chart',
    title: 'Line Chart',
    description: 'Time series visualization showing trends over time',
    category: 'Time Series',
    complexity: 'Beginner',
    spec: {}
  },
  {
    id: 'pie-chart',
    title: 'Pie Chart',
    description: 'Circular statistical visualization for part-to-whole relationships',
    category: 'Statistical',
    complexity: 'Intermediate',
    spec: {}
  },
  {
    id: 'boxplot-distribution',
    title: 'Box Plot',
    description: 'Statistical distribution across categories',
    category: 'Statistical',
    complexity: 'Intermediate',
    spec: chartSpecs['boxplot-distribution']
  },
  {
    id: 'area-growth',
    title: 'Area Chart',
    description: 'Area chart showing cumulative growth',
    category: 'Time Series',
    complexity: 'Intermediate',
    spec: chartSpecs['area-growth']
  }
]

export const GalleryGrid = ({ onChartSelect }: GalleryGridProps) => {
  const [category, setCategory] = useState<ChartCategory | 'All'>('All')
  const [complexity, setComplexity] = useState<ComplexityLevel | 'All'>('All')

  const filteredCharts = sampleCharts.filter(chart => {
    const categoryMatch = category === 'All' || chart.category === category
    const complexityMatch = complexity === 'All' || chart.complexity === complexity
    return categoryMatch && complexityMatch
  })

  return (
    <Container>
      <FilterBar 
        category={category}
        complexity={complexity}
        onCategoryChange={setCategory}
        onComplexityChange={setComplexity}
      />
      <Grid>
        {filteredCharts.map(chart => (
          <ChartCard 
            key={chart.id}
            chart={chart}
            onClick={onChartSelect}
          />
        ))}
      </Grid>
    </Container>
  )
}
