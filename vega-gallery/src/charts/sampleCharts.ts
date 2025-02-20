import { ChartConfig } from '../types/chart';
import { TopLevelSpec } from 'vega-lite';
import { Spec as VegaSpec } from 'vega';

// Statistical Charts
export const statistical = {
  'scatter-plot': {
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
  } as TopLevelSpec,
  'bar-chart': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: [
        { category: 'A', value: 28 },
        { category: 'B', value: 55 },
        { category: 'C', value: 43 }
      ]
    },
    mark: 'bar',
    encoding: {
      x: { field: 'category', type: 'nominal' },
      y: { field: 'value', type: 'quantitative' }
    }
  } as TopLevelSpec,
  'boxplot-distribution': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 100 }, () => ({
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        value: Math.random() * 100
      }))
    },
    mark: 'boxplot',
    encoding: {
      x: { field: 'category', type: 'nominal' },
      y: { field: 'value', type: 'quantitative' }
    }
  } as TopLevelSpec,
  'heatmap-correlation': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 9 }, (_, i) => 
        Array.from({ length: 9 }, (_, j) => ({
          x: i,
          y: j,
          value: Math.random()
        }))
      ).flat()
    },
    mark: 'rect',
    encoding: {
      x: { field: 'x', type: 'ordinal' },
      y: { field: 'y', type: 'ordinal' },
      color: { field: 'value', type: 'quantitative' }
    }
  } as TopLevelSpec
};

// Time Series Charts
export const timeSeries = {
  'line-chart': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: Math.sin(i / 3) * 50 + 50
      }))
    },
    mark: 'line',
    encoding: {
      x: { field: 'time', type: 'quantitative' },
      y: { field: 'value', type: 'quantitative' }
    }
  } as TopLevelSpec,
  'area-growth': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: Math.pow(1.1, i) * 10
      }))
    },
    mark: 'area',
    encoding: {
      x: { field: 'time', type: 'quantitative' },
      y: { field: 'value', type: 'quantitative' }
    }
  } as TopLevelSpec,
  'stream-graph': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 60 }, (_, i) => 
        ['A', 'B', 'C'].map(category => ({
          time: i,
          category,
          value: Math.sin(i / 10 + ['A', 'B', 'C'].indexOf(category)) * 10 + 20
        }))
      ).flat()
    },
    mark: 'area',
    encoding: {
      x: { field: 'time', type: 'quantitative' },
      y: { 
        field: 'value',
        type: 'quantitative',
        stack: 'center'
      },
      color: { field: 'category', type: 'nominal' }
    }
  } as TopLevelSpec,
  'radial-plot': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 400,
    height: 400,
    data: {
      values: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        value: Math.sin(i / 4) * 10 + Math.random() * 5 + 15
      }))
    },
    mark: 'line',
    encoding: {
      theta: { field: 'hour', type: 'quantitative', scale: { domain: [0, 24] } },
      radius: { field: 'value', type: 'quantitative' },
      color: { value: '#675193' }
    }
  } as TopLevelSpec,
  'interactive-multiline': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 100 }, (_, i) => 
        ['A', 'B', 'C'].map(series => ({
          time: i,
          series,
          value: Math.sin(i / 10 + ['A', 'B', 'C'].indexOf(series)) * 10 + Math.random() * 5 + 20
        }))
      ).flat()
    },
    mark: 'line',
    encoding: {
      x: { field: 'time', type: 'quantitative' },
      y: { field: 'value', type: 'quantitative' },
      color: { field: 'series', type: 'nominal' }
    },
    params: [{
      name: 'hover',
      select: {
        type: 'point',
        fields: ['series'],
        on: 'mouseover'
      }
    }],
    transform: [
      {
        filter: {
          param: 'hover',
          empty: true
        }
      }
    ]
  } as TopLevelSpec
};

// Comparison Charts
export const comparison = {
  'grouped-bar': {
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
  } as TopLevelSpec
};

// Correlation Charts
export const correlation = {
  'bubble-plot': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 50 + 10,
        category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]
      }))
    },
    mark: {
      type: 'circle',
      opacity: 0.7
    },
    encoding: {
      x: { field: 'x', type: 'quantitative' },
      y: { field: 'y', type: 'quantitative' },
      size: { field: 'size', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    }
  } as TopLevelSpec
};

// Part to Whole Charts
export const partToWhole = {
  'pie-chart': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: [
        { category: 'A', value: 30 },
        { category: 'B', value: 20 },
        { category: 'C', value: 25 },
        { category: 'D', value: 25 }
      ]
    },
    mark: 'arc',
    encoding: {
      theta: { field: 'value', type: 'quantitative', stack: true },
      color: { field: 'category', type: 'nominal' }
    }
  } as TopLevelSpec
};

// Hierarchical Charts
export const hierarchical = {
  'treemap': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 400,
    height: 300,
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
    mark: 'rect',
    encoding: {
      x: { field: 'name', type: 'nominal' },
      y: { field: 'value', type: 'quantitative' },
      color: { field: 'name', type: 'nominal' }
    },
    transform: [
      {
        aggregate: [{ op: 'sum', field: 'value', as: 'value' }],
        groupby: ['name']
      }
    ]
  } as TopLevelSpec,
  'sunburst': {
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
    mark: 'arc',
    encoding: {
      theta: { field: 'value', type: 'quantitative', stack: true },
      radius: { field: 'id', type: 'ordinal', sort: 'ascending' },
      color: { field: 'name', type: 'nominal' }
    }
  } as TopLevelSpec
};

// Text Analysis Charts
export const textAnalysis = {
  'word-cloud': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 600,
    height: 400,
    data: {
      values: [
        { text: 'data', value: 50 },
        { text: 'visualization', value: 45 },
        { text: 'analysis', value: 40 },
        { text: 'chart', value: 35 },
        { text: 'graph', value: 30 },
        { text: 'interactive', value: 25 },
        { text: 'statistics', value: 20 }
      ]
    },
    mark: 'text',
    encoding: {
      text: { field: 'text' },
      size: { 
        field: 'value',
        type: 'quantitative',
        scale: { range: [12, 48] }
      },
      color: {
        field: 'value',
        type: 'quantitative',
        scale: { scheme: 'blues' }
      }
    }
  } as TopLevelSpec
};

// Export all chart specifications
export const chartSpecs = {
  ...statistical,
  ...timeSeries,
  ...comparison,
  ...correlation,
  ...partToWhole,
  ...hierarchical,
  ...textAnalysis
};

// Sample charts configuration
export const sampleCharts: ChartConfig[] = [
  {
    id: 'scatter-plot',
    title: 'Scatter Plot',
    description: 'A basic scatter plot showing the relationship between two variables',
    category: 'Statistical',
    complexity: 'Beginner',
    spec: statistical['scatter-plot'],
    metadata: {
      tags: ['correlation', 'distribution', 'points'],
      dataRequirements: {
        requiredFields: ['x', 'y']
      }
    }
  },
  {
    id: 'bar-chart',
    title: 'Bar Chart',
    description: 'Simple bar chart for comparing categorical data',
    category: 'Statistical',
    complexity: 'Beginner',
    spec: statistical['bar-chart']
  },
  {
    id: 'line-chart',
    title: 'Line Chart',
    description: 'Time series visualization showing trends over time',
    category: 'Time Series',
    complexity: 'Beginner',
    spec: timeSeries['line-chart']
  },
  {
    id: 'area-growth',
    title: 'Area Chart',
    description: 'Area chart showing cumulative growth',
    category: 'Time Series',
    complexity: 'Intermediate',
    spec: timeSeries['area-growth']
  },
  {
    id: 'pie-chart',
    title: 'Pie Chart',
    description: 'Circular statistical visualization for part-to-whole relationships',
    category: 'Part-to-Whole',
    complexity: 'Intermediate',
    spec: partToWhole['pie-chart']
  },
  {
    id: 'treemap',
    title: 'Treemap',
    description: 'Hierarchical data visualization using nested rectangles',
    category: 'Hierarchical',
    complexity: 'Intermediate',
    spec: hierarchical['treemap'],
    metadata: {
      useCase: ['Data Analysis', 'Business Reporting'],
      dataTypes: ['numerical', 'categorical'],
      keywords: ['hierarchy', 'nesting', 'proportions']
    }
  },
  {
    id: 'sunburst',
    title: 'Sunburst Chart',
    description: 'Radial visualization of hierarchical data',
    category: 'Hierarchical',
    complexity: 'Advanced',
    spec: hierarchical['sunburst']
  },
  {
    id: 'bubble-plot',
    title: 'Bubble Plot',
    description: 'Scatter plot with sized circles for multivariate data',
    category: 'Correlation',
    complexity: 'Intermediate',
    spec: correlation['bubble-plot']
  },
  {
    id: 'word-cloud',
    title: 'Word Cloud',
    description: 'Text visualization with size encoding for frequency',
    category: 'Text Analysis',
    complexity: 'Intermediate',
    spec: textAnalysis['word-cloud']
  },
  {
    id: 'boxplot-distribution',
    title: 'Box Plot',
    description: 'Statistical distribution across categories',
    category: 'Statistical',
    complexity: 'Intermediate',
    spec: statistical['boxplot-distribution']
  },
  {
    id: 'heatmap-correlation',
    title: 'Correlation Heatmap',
    description: 'Interactive heatmap showing correlation between variables',
    category: 'Statistical',
    complexity: 'Intermediate',
    spec: statistical['heatmap-correlation']
  },
  {
    id: 'stream-graph',
    title: 'Stream Graph',
    description: 'Flowing visualization of temporal patterns',
    category: 'Time Series',
    complexity: 'Advanced',
    spec: timeSeries['stream-graph']
  },
  {
    id: 'radial-plot',
    title: 'Radial Plot',
    description: 'Circular visualization of periodic patterns',
    category: 'Time Series',
    complexity: 'Advanced',
    spec: timeSeries['radial-plot']
  },
  {
    id: 'interactive-multiline',
    title: 'Interactive Multi-Line',
    description: 'Interactive time series with multiple series',
    category: 'Time Series',
    complexity: 'Advanced',
    spec: timeSeries['interactive-multiline']
  }
]; 