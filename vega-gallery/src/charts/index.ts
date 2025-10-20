// src/charts/index.ts
import {
  chartSpecs,
  sampleCharts,
  statistical,
  timeSeries,
  comparison,
  correlation,
  partToWhole,
  hierarchical,
  textAnalysis
} from './sampleCharts';
import { correlationCharts } from './correlation';
import { hierarchicalCharts } from './hierarchical';
import { timeSeriesCharts } from './timeSeries';
import { ChartDefinition } from '../types/chart';

export {
  chartSpecs,
  sampleCharts,
  statistical,
  timeSeries,
  comparison,
  correlation,
  partToWhole,
  hierarchical,
  textAnalysis
};

// Group charts by category
export const chartsByCategory = {
  Statistical: Object.values(statistical),
  'Time Series': Object.values(timeSeries),
  Comparison: Object.values(comparison),
  Correlation: Object.values(correlation),
  'Part-to-Whole': Object.values(partToWhole),
  Hierarchical: Object.values(hierarchical),
  'Text Analysis': Object.values(textAnalysis)
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