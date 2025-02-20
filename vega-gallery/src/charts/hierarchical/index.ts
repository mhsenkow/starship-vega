import { TopLevelSpec, Transform } from 'vega-lite';

export const treemap: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 400,
  height: 300,
  data: { values: [] },
  mark: 'rect',
  encoding: {
    x: { field: 'x0', type: 'quantitative', axis: null },
    x2: { field: 'x1' },
    y: { field: 'y0', type: 'quantitative', axis: null },
    y2: { field: 'y1' },
    color: { field: 'name', type: 'nominal', legend: null }
  }
};

export const sunburst: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  width: 400,
  height: 400,
  data: {
    values: [
      { id: 1, parent: null, name: 'Root', value: 100 },
      { id: 2, parent: 1, name: 'Category A', value: 50 },
      { id: 3, parent: 1, name: 'Category B', value: 30 },
      { id: 4, parent: 1, name: 'Category C', value: 20 },
      { id: 5, parent: 2, name: 'A1', value: 25 },
      { id: 6, parent: 2, name: 'A2', value: 25 },
      { id: 7, parent: 3, name: 'B1', value: 15 },
      { id: 8, parent: 3, name: 'B2', value: 15 },
      { id: 9, parent: 4, name: 'C1', value: 10 },
      { id: 10, parent: 4, name: 'C2', value: 10 }
    ]
  },
  transform: [{
    aggregate: [{
      op: 'sum',
      field: 'value',
      as: 'value'
    }],
    groupby: ['id', 'parent', 'name']
  } as Transform],
  mark: {
    type: 'arc',
    innerRadius: 50
  },
  encoding: {
    theta: {
      field: 'value',
      type: 'quantitative',
      stack: true
    },
    radius: {
      field: 'id',
      type: 'ordinal',
      sort: 'ascending'
    },
    color: {
      field: 'name',
      type: 'nominal',
      scale: { scheme: 'category20' }
    },
    tooltip: [
      { field: 'name', type: 'nominal' },
      { field: 'value', type: 'quantitative' }
    ]
  }
};

export const hierarchical = {
  'treemap': treemap,
  'sunburst': sunburst
}; 