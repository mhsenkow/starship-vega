import { ChartSpec } from '../types'
import { barChartSpec } from './specs/bar-chart.spec'

export const barChart: ChartSpec = {
  id: 'bar-chart',
  title: 'Bar Chart',
  description: 'Simple bar chart for comparing categorical data',
  category: 'Statistical',
  complexity: 'Beginner',
  metadata: {
    tags: ['comparison', 'categorical'],
    dataRequirements: {
      minDataPoints: 2,
      requiredFields: ['category', 'value']
    }
  },
  spec: barChartSpec
}
