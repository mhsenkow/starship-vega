import { TopLevelSpec } from 'vega-lite';

export const groupedBar: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: [
      { category: 'A', group: 'Group 1', value: 28 },
      { category: 'B', group: 'Group 1', value: 55 },
      { category: 'C', group: 'Group 1', value: 43 },
      { category: 'A', group: 'Group 2', value: 19 },
      { category: 'B', group: 'Group 2', value: 44 },
      { category: 'C', group: 'Group 2', value: 35 }
    ]
  },
  mark: 'bar',
  encoding: {
    x: { field: 'category', type: 'nominal' },
    y: { field: 'value', type: 'quantitative' },
    xOffset: { field: 'group' },
    color: { field: 'group', type: 'nominal' }
  }
};

export const bulletChart: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: [
      { category: 'Revenue', actual: 80, target: 100, ranges: [40, 70, 100] },
      { category: 'Profit', actual: 60, target: 75, ranges: [30, 55, 80] },
      { category: 'Growth', actual: 45, target: 50, ranges: [20, 35, 60] }
    ]
  },
  layer: [
    {
      mark: { type: 'bar', color: '#ddd', size: 20 },
      encoding: {
        x: { field: 'ranges', type: 'quantitative' },
        y: { field: 'category', type: 'nominal' }
      }
    },
    {
      mark: { type: 'bar', color: '#333', size: 20 },
      encoding: {
        x: { field: 'actual', type: 'quantitative' },
        y: { field: 'category', type: 'nominal' }
      }
    },
    {
      mark: { type: 'tick', color: 'red', size: 40, thickness: 2 },
      encoding: {
        x: { field: 'target', type: 'quantitative' },
        y: { field: 'category', type: 'nominal' }
      }
    }
  ]
};

export const comparison = {
  'grouped-bar': groupedBar,
  'bullet-chart': bulletChart
}; 