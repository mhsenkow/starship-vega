// src/charts/index.ts
import { statistical } from './statistical'
import { timeSeries } from './timeSeries'
import { comparison } from './comparison'
import { correlation } from './correlation'
import { partToWhole } from './partToWhole'
import { hierarchical } from './hierarchical'
import { textAnalysis } from './textAnalysis'

// Combine all chart specifications
export const chartSpecs = {
  ...statistical,
  ...timeSeries,
  ...comparison,
  ...correlation,
  ...partToWhole,
  ...hierarchical,
  ...textAnalysis
}

// Group charts by category
export const chartsByCategory = {
  Statistical: Object.values(statistical),
  'Time Series': Object.values(timeSeries),
  Comparison: Object.values(comparison),
  Correlation: Object.values(correlation),
  'Part-to-Whole': Object.values(partToWhole),
  Hierarchical: Object.values(hierarchical),
  'Text Analysis': Object.values(textAnalysis)
}