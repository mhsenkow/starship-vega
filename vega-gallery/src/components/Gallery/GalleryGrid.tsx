import styled from 'styled-components'
import { ChartCard } from './ChartCard'
import { useState, useMemo } from 'react'
import { FilterBar } from './FilterBar'
import { ChartConfig, ChartCategory, ComplexityLevel } from '../../types/chart'
import { chartSpecs } from '../../utils/vegaHelper'
import { ChartFilter } from './ChartFilter'

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
  },
  {
    id: 'heatmap-correlation',
    title: 'Correlation Heatmap',
    description: 'Interactive heatmap showing correlation between variables',
    category: 'Statistical',
    complexity: 'Intermediate',
    spec: chartSpecs['heatmap-correlation']
  },
  {
    id: 'stream-graph',
    title: 'Stream Graph',
    description: 'Flowing visualization of temporal patterns',
    category: 'Time Series',
    complexity: 'Advanced',
    spec: chartSpecs['stream-graph']
  },
  {
    id: 'radial-plot',
    title: 'Radial Plot',
    description: 'Circular visualization of periodic patterns',
    category: 'Time Series',
    complexity: 'Advanced',
    spec: chartSpecs['radial-plot']
  },
  {
    id: 'interactive-multiline',
    title: 'Interactive Multi-Line',
    description: 'Multi-series line chart with interactive highlighting',
    category: 'Time Series',
    complexity: 'Intermediate',
    spec: chartSpecs['interactive-multiline']
  },
  {
    id: 'violin-plot',
    title: 'Violin Plot',
    description: 'Density-based distribution visualization',
    category: 'Statistical',
    complexity: 'Advanced',
    spec: chartSpecs['violin-plot']
  },
  {
    id: 'histogram-kde',
    title: 'Histogram with KDE',
    description: 'Distribution with kernel density estimation',
    category: 'Statistical',
    complexity: 'Advanced',
    spec: chartSpecs['histogram-kde']
  },
  {
    id: 'qq-plot',
    title: 'Q-Q Plot',
    description: 'Quantile comparison for distributions',
    category: 'Statistical',
    complexity: 'Advanced',
    spec: chartSpecs['qq-plot']
  },
  {
    id: 'error-bars',
    title: 'Error Bars',
    description: 'Visualization with confidence intervals',
    category: 'Statistical',
    complexity: 'Intermediate',
    spec: chartSpecs['error-bars']
  },
  {
    id: 'treemap',
    title: 'Treemap',
    description: 'Hierarchical data visualization using nested rectangles',
    category: 'Hierarchical',
    complexity: 'Intermediate',
    useCase: ['Data Analysis', 'Business Reporting'],
    dataTypes: ['numerical', 'categorical'],
    keywords: ['hierarchy', 'nested', 'rectangles', 'proportion'],
    spec: chartSpecs['treemap']
  },
  {
    id: 'sunburst',
    title: 'Sunburst Chart',
    description: 'Radial visualization of hierarchical data',
    category: 'Hierarchical',
    complexity: 'Advanced',
    useCase: ['Data Analysis', 'Scientific Visualization'],
    dataTypes: ['numerical', 'categorical'],
    keywords: ['hierarchy', 'radial', 'circular', 'nested'],
    spec: chartSpecs['sunburst']
  },
  {
    id: 'force-directed',
    title: 'Force-Directed Graph',
    description: 'Network visualization with force-directed layout',
    category: 'Hierarchical',
    complexity: 'Advanced',
    useCase: ['Scientific Visualization', 'Data Analysis'],
    dataTypes: ['categorical'],
    keywords: ['network', 'graph', 'force', 'relationships'],
    spec: chartSpecs['force-directed']
  },
  {
    id: 'chord-diagram',
    title: 'Chord Diagram',
    description: 'Visualization of relationships between entities',
    category: 'Hierarchical',
    complexity: 'Advanced',
    useCase: ['Data Analysis', 'Scientific Visualization'],
    dataTypes: ['numerical', 'categorical'],
    keywords: ['relationships', 'circular', 'flow', 'connections'],
    spec: chartSpecs['chord-diagram']
  }
]

export const GalleryGrid = ({ onChartSelect }: GalleryGridProps) => {
  const [category, setCategory] = useState<ChartCategory | 'All'>('All')
  const [complexity, setComplexity] = useState<ComplexityLevel | 'All'>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'category' | 'complexity'>('category')

  const filteredCharts = useMemo(() => {
    return sampleCharts.filter(chart => {
      if (category !== 'All' && chart.category !== category) return false
      if (complexity !== 'All' && chart.complexity !== complexity) return false
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        return (
          chart.title.toLowerCase().includes(search) ||
          chart.description.toLowerCase().includes(search)
        )
      }
      return true
    })
  }, [category, complexity, searchTerm])

  const sortedCharts = useMemo(() => {
    return [...filteredCharts].sort((a, b) => {
      switch (sortBy) {
        case 'category':
          return a.category.localeCompare(b.category)
        case 'complexity':
          const order = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 }
          return order[a.complexity] - order[b.complexity]
        default:
          return 0
      }
    })
  }, [filteredCharts, sortBy])

  return (
    <Container>
      <FilterBar
        category={category}
        complexity={complexity}
        searchTerm={searchTerm}
        sortBy={sortBy}
        onCategoryChange={setCategory}
        onComplexityChange={setComplexity}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
      />
      <Grid>
        {sortedCharts.map(chart => (
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
