import styled from 'styled-components'
import { useState, useMemo, lazy, Suspense } from 'react'
import { FilterBar } from './FilterBar'
import { ChartConfig, ChartCategory, Complexity } from '../../types/chart'
import { chartSpecs } from '../../charts'
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

// Sample charts with updated structure
const sampleCharts: ChartConfig[] = [
  {
    id: 'scatter-plot',
    title: 'Scatter Plot',
    description: 'A basic scatter plot showing the relationship between two variables',
    category: 'Statistical',
    complexity: 'Beginner',
    spec: chartSpecs['scatter-plot'],
    metadata: {
      tags: ['correlation', 'distribution', 'points'],
      dataRequirements: {
        requiredFields: ['x', 'y']
      }
    }
  },
  {
    id: 'bar-chart',
    title: 'Bar Chart',
    description: 'Simple bar chart for comparing categorical data',
    category: 'Statistical',
    complexity: 'Beginner',
    spec: chartSpecs['bar-chart']
  },
  {
    id: 'line-chart',
    title: 'Line Chart',
    description: 'Time series visualization showing trends over time',
    category: 'Time Series',
    complexity: 'Beginner',
    spec: chartSpecs['line-chart']
  },
  {
    id: 'pie-chart',
    title: 'Pie Chart',
    description: 'Circular statistical visualization for part-to-whole relationships',
    category: 'Part-to-Whole',
    complexity: 'Intermediate',
    spec: chartSpecs['pie-chart']
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
    spec: chartSpecs['treemap'],
    metadata: {
      useCase: ['Data Analysis', 'Business Reporting'],
      dataTypes: ['numerical', 'categorical'],
      keywords: ['hierarchy', 'nested', 'rectangles', 'proportion']
    }
  },
  {
    id: 'sunburst',
    title: 'Sunburst Chart',
    description: 'Radial visualization of hierarchical data',
    category: 'Hierarchical',
    complexity: 'Advanced',
    spec: chartSpecs['sunburst'],
    metadata: {
      useCase: ['Data Analysis', 'Scientific Visualization'],
      dataTypes: ['numerical', 'categorical'],
      keywords: ['hierarchy', 'radial', 'circular', 'nested']
    }
  },
  {
    id: 'force-directed',
    title: 'Force-Directed Graph',
    description: 'Network visualization with force-directed layout',
    category: 'Hierarchical',
    complexity: 'Advanced',
    spec: chartSpecs['force-directed'],
    metadata: {
      useCase: ['Scientific Visualization', 'Data Analysis'],
      dataTypes: ['categorical'],
      keywords: ['network', 'graph', 'force', 'relationships']
    }
  },
  {
    id: 'chord-diagram',
    title: 'Chord Diagram',
    description: 'Visualization of relationships between entities',
    category: 'Hierarchical',
    complexity: 'Advanced',
    spec: chartSpecs['chord-diagram'],
    metadata: {
      useCase: ['Data Analysis', 'Scientific Visualization'],
      dataTypes: ['numerical', 'categorical'],
      keywords: ['relationships', 'circular', 'flow', 'connections']
    }
  },
  {
    id: 'grouped-bar',
    title: 'Grouped Bar Chart',
    description: 'Compare values across multiple categories and groups',
    category: 'Comparison',
    complexity: 'Intermediate',
    spec: chartSpecs['grouped-bar']
  },
  {
    id: 'bullet-chart',
    title: 'Bullet Chart',
    description: 'Compare actual vs target values with context',
    category: 'Comparison',
    complexity: 'Intermediate',
    spec: chartSpecs['bullet-chart']
  },
  {
    id: 'stacked-bar',
    title: 'Stacked Bar Chart',
    description: 'Show composition of total values across categories',
    category: 'Part-to-Whole',
    complexity: 'Beginner',
    spec: chartSpecs['stacked-bar']
  },
  {
    id: 'waffle-chart',
    title: 'Waffle Chart',
    description: 'Show percentage composition using a grid of squares',
    category: 'Part-to-Whole',
    complexity: 'Intermediate',
    spec: chartSpecs['waffle-chart']
  },
  {
    id: 'bubble-plot',
    title: 'Bubble Plot',
    description: 'Show relationships between three variables',
    category: 'Correlation',
    complexity: 'Intermediate',
    spec: chartSpecs['bubble-plot']
  },
  {
    id: 'connected-scatter',
    title: 'Connected Scatter Plot',
    description: 'Show correlation with temporal progression',
    category: 'Correlation',
    complexity: 'Intermediate',
    spec: chartSpecs['connected-scatter']
  },
  {
    id: 'word-cloud',
    title: 'Word Cloud',
    description: 'Text size visualization based on word frequency',
    category: 'Text Analysis',
    complexity: 'Intermediate',
    spec: chartSpecs['word-cloud'],
    metadata: {
      useCase: ['Data Analysis', 'Text Mining'],
      dataTypes: ['categorical'],
      keywords: ['text', 'frequency', 'words', 'size']
    }
  }
]

// Lazy load ChartCard
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
        // Prioritize basic charts within each category
        const basicCharts = ['bar-chart', 'line-chart', 'scatter-plot']
        const aIsBasic = basicCharts.includes(a.id)
        const bIsBasic = basicCharts.includes(b.id)
        
        if (aIsBasic !== bIsBasic) {
          return aIsBasic ? -1 : 1
        }
        
        return a.category.localeCompare(b.category)
      } else {
        // complexity sorting
        const complexityOrder = { 'Beginner': 0, 'Intermediate': 1, 'Advanced': 2 }
        const complexityDiff = complexityOrder[a.complexity] - complexityOrder[b.complexity]
        
        if (complexityDiff === 0) {
          // Within same complexity, prioritize basic charts
          const basicCharts = ['bar-chart', 'line-chart', 'scatter-plot']
          const aIsBasic = basicCharts.includes(a.id)
          const bIsBasic = basicCharts.includes(b.id)
          return aIsBasic ? -1 : bIsBasic ? 1 : 0
        }
        
        return complexityDiff
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
        filteredCharts={filteredCharts}
        onCategoryChange={setCategory}
        onComplexityChange={setComplexity}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
      />
      <Grid>
        <Suspense fallback={<div>Loading...</div>}>
          {sortedCharts.map(chart => (
            <LazyChartCard 
              key={chart.id} 
              chart={chart}
              onClick={() => onChartSelect(chart.id)}
            />
          ))}
        </Suspense>
      </Grid>
    </Container>
  )
}
