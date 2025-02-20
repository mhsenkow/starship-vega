import { TopLevelSpec } from 'vega-lite';

export const bubblePlot: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 50 + 10
    }))
  },
  mark: 'circle',
  encoding: {
    x: { field: 'x', type: 'quantitative' },
    y: { field: 'y', type: 'quantitative' },
    size: { field: 'size', type: 'quantitative' }
  }
};

export const connectedScatter: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      time: i
    }))
  },
  layer: [
    {
      mark: { type: 'line', color: '#aaa' },
      encoding: {
        x: { field: 'x', type: 'quantitative' },
        y: { field: 'y', type: 'quantitative' },
        order: { field: 'time', type: 'quantitative' }
      }
    },
    {
      mark: { type: 'point', filled: true },
      encoding: {
        x: { field: 'x', type: 'quantitative' },
        y: { field: 'y', type: 'quantitative' },
        order: { field: 'time', type: 'quantitative' }
      }
    }
  ]
};

export const correlation = {
  'bubble-plot': bubblePlot,
  'connected-scatter': connectedScatter
}; 