/**
 * Hierarchical chart specifications and configurations.
 * Includes treemap and sunburst visualizations.
 */

import { TopLevelSpec } from 'vega-lite';
import { Spec as VegaSpec } from 'vega';
import { ChartDefinition, ChartCategory } from '../../types/chart';

export const treemap: VegaSpec = {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  description: "A treemap layout for hierarchical data.",
  padding: 2.5,
  autosize: "fit",
  // ... rest of treemap spec
};

export const sunburst: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 400,
  height: 400,
  // ... rest of sunburst spec
};

export const hierarchical = {
  treemap,
  sunburst
};

export const hierarchicalCharts: ChartDefinition[] = [
  {
    id: 'treemap',
    title: 'Treemap',
    category: ChartCategory.Hierarchical,
    description: 'Nested rectangles showing hierarchical data',
    tags: ['hierarchy', 'area', 'nested'],
    spec: treemap
  },
  {
    id: 'sunburst',
    title: 'Sunburst Chart',
    category: ChartCategory.Hierarchical,
    description: 'Radial visualization of hierarchical data',
    tags: ['hierarchy', 'radial', 'nested'],
    spec: sunburst
  }
]; 