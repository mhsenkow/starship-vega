// src/charts/index.ts
import { correlationCharts } from './correlation';
import { hierarchicalCharts } from './hierarchical';
import { timeSeriesCharts } from './timeSeries';
import { ChartDefinition } from '../types/chart';
import { TopLevelSpec } from 'vega-lite';

// Remove these imports since we're defining chartSpecs here
import {
  statistical,
  timeSeries,
  comparison,
  correlation,
  partToWhole,
  hierarchical,
  textAnalysis
} from './sampleCharts';

// Define base chart specs
const baseChartSpecs: Record<string, TopLevelSpec> = {
  pieChart: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: [
        { category: 'A', value: 30 },
        { category: 'B', value: 25 },
        { category: 'C', value: 20 },
        { category: 'D', value: 15 },
        { category: 'E', value: 10 }
      ]
    },
    mark: { type: 'arc', innerRadius: 50 },
    encoding: {
      theta: { field: 'value', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    },
    view: { stroke: null }
  },
  barChart: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: [
        { category: 'A', value: 28 },
        { category: 'B', value: 55 },
        { category: 'C', value: 43 },
        { category: 'D', value: 91 },
        { category: 'E', value: 81 }
      ]
    },
    mark: 'bar',
    encoding: {
      x: { field: 'category', type: 'nominal' },
      y: { field: 'value', type: 'quantitative' }
    }
  },
  lineChart: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 20 }, (_, i) => ({
        x: i,
        y: Math.sin(i / 5) * 10 + 20
      }))
    },
    mark: 'line',
    encoding: {
      x: { field: 'x', type: 'quantitative' },
      y: { field: 'y', type: 'quantitative' }
    }
  },
  scatterPlot: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
      }))
    },
    mark: 'point',
    encoding: {
      x: { field: 'x', type: 'quantitative' },
      y: { field: 'y', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    }
  }
};

// Group charts by category
export const chartsByCategory = {
  Statistical: Object.values(correlationCharts),
  'Time Series': Object.values(timeSeriesCharts),
  Hierarchical: Object.values(hierarchicalCharts)
};

export const allCharts: ChartDefinition[] = [
  ...correlationCharts,
  ...hierarchicalCharts,
  ...timeSeriesCharts
];

// Helper to get charts by category
export const getChartsByCategory = (category: string): ChartDefinition[] => {
  return allCharts.filter(chart => chart.category === category);
};

// Single export of chart specs
export const chartSpecs = {
  ...baseChartSpecs,
  // Add any dynamic or computed specs here
};

// Re-export other chart categories
export {
  statistical,
  timeSeries,
  comparison,
  correlation,
  partToWhole,
  hierarchical,
  textAnalysis
};