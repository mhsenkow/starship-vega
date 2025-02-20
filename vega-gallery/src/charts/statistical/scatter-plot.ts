import { ChartSpec } from '../types'
import { scatterPlotSpec } from './specs/scatter-plot.spec'

export const scatterPlot: ChartSpec = {
  id: 'scatter-plot',
  title: 'Scatter Plot',
  description: 'A basic scatter plot showing the relationship between two variables',
  category: 'Statistical',
  complexity: 'Beginner',
  metadata: {
    tags: ['correlation', 'distribution'],
    dataRequirements: {
      minDataPoints: 10,
      requiredFields: ['x', 'y']
    }
  },
  spec: scatterPlotSpec
}
