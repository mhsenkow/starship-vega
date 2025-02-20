import { TopLevelSpec } from 'vega-lite'

export const scatterPlotSpec: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }))
  },
  mark: 'point',
  encoding: {
    x: { field: 'x', type: 'quantitative' },
    y: { field: 'y', type: 'quantitative' }
  }
}