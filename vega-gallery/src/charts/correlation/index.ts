import { TopLevelSpec } from 'vega-lite';
import { ChartDefinition, ChartCategory } from '../../types/chart';
import { applyChartStyle } from '../../utils/chartStyles';

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

export const correlationCharts: ChartDefinition[] = [
  {
    id: 'scatter-plot',
    title: 'Scatter Plot',
    category: ChartCategory.Correlation,
    description: 'Basic scatter plot showing relationship between two variables',
    tags: ['scatter', 'correlation', 'continuous'],
    spec: applyChartStyle({
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 400,
      height: 300,
      data: {
        values: Array.from({ length: 50 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100
        }))
      },
      mark: { type: 'circle' },
      encoding: {
        x: { field: 'x', type: 'quantitative', axis: { grid: false } },
        y: { field: 'y', type: 'quantitative', axis: { grid: false } },
        tooltip: [
          { field: 'x', type: 'quantitative' },
          { field: 'y', type: 'quantitative' }
        ]
      }
    })
  },
  {
    id: 'bubble-chart',
    title: 'Bubble Chart',
    category: ChartCategory.Correlation,
    description: 'Scatter plot with size encoding for third variable',
    tags: ['scatter', 'bubble', 'multivariate'],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 400,
      height: 300,
      data: {
        values: Array.from({ length: 30 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 50 + 10
        }))
      },
      mark: {
        type: 'circle',
        filled: true,
        opacity: 0.6,
        stroke: 'white',
        strokeWidth: 1,
        blend: 'multiply'
      },
      encoding: {
        x: { 
          field: 'x', 
          type: 'quantitative',
          axis: { grid: false }
        },
        y: { 
          field: 'y', 
          type: 'quantitative',
          axis: { grid: false }
        },
        size: {
          field: 'size',
          type: 'quantitative',
          scale: { range: [100, 2000] }
        },
        color: { value: '#72B7B2' },
        tooltip: [
          { field: 'x', type: 'quantitative' },
          { field: 'y', type: 'quantitative' },
          { field: 'size', type: 'quantitative' }
        ]
      },
      config: {
        view: { stroke: null }
      }
    }
  }
];

export const correlation = {
  'bubble-plot': bubblePlot,
  'connected-scatter': connectedScatter
}; 