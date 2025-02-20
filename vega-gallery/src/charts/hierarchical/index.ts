import { TopLevelSpec } from 'vega-lite';
import { Spec as VegaSpec } from 'vega';
import { ChartDefinition, ChartCategory } from '../../types/chart';

export const treemap: VegaSpec = {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  description: "A treemap layout for hierarchical data.",
  padding: 2.5,
  autosize: "fit",
  signals: [
    { name: "width", value: 400 },
    { name: "height", value: 300 }
  ],
  data: [
    {
      name: "tree",
      values: [
        { id: 1, parent: null, name: "Root", value: 100 },
        { id: 2, parent: 1, name: "Category A", value: 50 },
        { id: 3, parent: 1, name: "Category B", value: 30 },
        { id: 4, parent: 1, name: "Category C", value: 20 },
        { id: 5, parent: 2, name: "A1", value: 25 },
        { id: 6, parent: 2, name: "A2", value: 25 },
        { id: 7, parent: 3, name: "B1", value: 15 },
        { id: 8, parent: 3, name: "B2", value: 15 },
        { id: 9, parent: 4, name: "C1", value: 10 },
        { id: 10, parent: 4, name: "C2", value: 10 }
      ],
      transform: [
        {
          type: "stratify",
          key: "id",
          parentKey: "parent"
        },
        {
          type: "treemap",
          field: "value",
          sort: { field: "value" },
          round: true,
          method: "squarify",
          ratio: 1,
          size: [{ signal: "width" }, { signal: "height" }],
          as: ["x0", "y0", "x1", "y1", "depth", "children"]
        }
      ]
    }
  ],
  scales: [
    {
      name: "color",
      type: "ordinal",
      domain: { data: "tree", field: "name" },
      range: { scheme: "category20" }
    }
  ],
  marks: [
    {
      type: "rect",
      from: { data: "tree" },
      encode: {
        enter: {
          fill: { scale: "color", field: "name" },
          stroke: { value: "white" }
        },
        update: {
          x: { field: "x0" },
          y: { field: "y0" },
          x2: { field: "x1" },
          y2: { field: "y1" }
        }
      }
    },
    {
      type: "text",
      from: { data: "tree" },
      encode: {
        enter: {
          fill: { value: "white" },
          align: { value: "center" },
          baseline: { value: "middle" },
          fontSize: { value: 11 },
          text: { field: "name" }
        },
        update: {
          x: { signal: "(datum.x0 + datum.x1) / 2" },
          y: { signal: "(datum.y0 + datum.y1) / 2" }
        }
      }
    }
  ]
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
  }],
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