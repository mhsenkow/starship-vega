import { TopLevelSpec } from 'vega-lite';

const sampleData = {
  categorical: [
    { category: 'A', value: 28 },
    { category: 'B', value: 55 },
    { category: 'C', value: 43 },
    { category: 'D', value: 91 },
    { category: 'E', value: 81 }
  ],
  temporal: Array.from({ length: 20 }, (_, i) => ({
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    value: Math.sin(i / 5) * 10 + 20
  })),
  correlation: Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
  }))
};

export const chartSpecs: Record<string, TopLevelSpec> = {
  pieChart: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: sampleData.categorical },
    mark: { type: 'arc', innerRadius: 50 },
    encoding: {
      theta: { field: 'value', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    },
    view: { stroke: null }
  },
  barChart: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: sampleData.categorical },
    mark: 'bar',
    encoding: {
      x: { field: 'category', type: 'nominal' },
      y: { field: 'value', type: 'quantitative' }
    }
  },
  lineChart: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: sampleData.temporal },
    mark: 'line',
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'value', type: 'quantitative' }
    }
  },
  scatterPlot: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 50 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        category: ['Electronics', 'Clothing', 'Books', 'Food', 'Sports'][Math.floor(Math.random() * 5)],
        size: Math.random() * 50 + 10
      }))
    },
    mark: {
      type: 'point',
      filled: true,
      opacity: 0.7,
      stroke: 'white',
      strokeWidth: 1
    },
    encoding: {
      x: {
        field: 'x',
        type: 'quantitative',
        title: 'Value X',
        scale: { zero: false }
      },
      y: {
        field: 'y',
        type: 'quantitative',
        title: 'Value Y',
        scale: { zero: false }
      },
      size: {
        field: 'size',
        type: 'quantitative',
        scale: { range: [50, 400] }
      },
      color: {
        field: 'category',
        type: 'nominal',
        scale: {
          scheme: 'tableau10'
        }
      },
      tooltip: [
        { field: 'x', type: 'quantitative', format: '.1f' },
        { field: 'y', type: 'quantitative', format: '.1f' },
        { field: 'category', type: 'nominal' },
        { field: 'size', type: 'quantitative', format: '.1f' }
      ]
    },
    config: {
      point: {
        filled: true,
        opacity: 0.7
      },
      axis: {
        grid: true,
        gridColor: '#f1f5f9',
        domain: false
      },
      view: {
        stroke: null
      }
    }
  },
  violinPlot: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 100 }, () => ({
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        value: Math.random() * 100 + Math.random() * 50
      }))
    },
    mark: {
      type: 'violin',
      orient: 'horizontal',
      size: 100
    },
    encoding: {
      y: { field: 'category', type: 'nominal' },
      x: { field: 'value', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    }
  },
  histogramKde: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    transform: [{ density: 'value' }],
    mark: { type: 'area', opacity: 0.5 },
    encoding: {
      x: { field: 'value', type: 'quantitative' },
      y: { field: 'density', type: 'quantitative' }
    }
  },
  stackedBar: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 15 }, (_, i) => 
        ['A', 'B', 'C'].map(category => ({
          x: i,
          category,
          value: Math.random() * 100
        }))
      ).flat()
    },
    mark: 'bar',
    encoding: {
      x: { field: 'x', type: 'ordinal' },
      y: { field: 'value', type: 'quantitative', stack: true },
      color: { field: 'category', type: 'nominal' }
    }
  },
  radialChart: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 12 }, (_, i) => ({
        angle: i * 30,
        radius: Math.random() * 100 + 50
      }))
    },
    mark: { type: 'arc', innerRadius: 20 },
    encoding: {
      theta: { field: 'angle', type: 'quantitative' },
      radius: { field: 'radius', type: 'quantitative' },
      color: { field: 'radius', type: 'quantitative' }
    }
  },
  heatmap: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 100 }, (_, i) => ({
        x: Math.floor(i / 10),
        y: i % 10,
        value: Math.random() * 100
      }))
    },
    mark: 'rect',
    encoding: {
      x: { field: 'x', type: 'ordinal' },
      y: { field: 'y', type: 'ordinal' },
      color: { field: 'value', type: 'quantitative' }
    }
  },
  streamGraph: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: Array.from({ length: 50 }, (_, i) => 
        ['A', 'B', 'C', 'D'].map(category => ({
          time: i,
          category,
          value: Math.sin(i / 10) * 10 + Math.random() * 20
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
  },
  barChartStacked: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: [
        { category: 'Electronics', quarter: 'Q1', value: 320 },
        { category: 'Electronics', quarter: 'Q2', value: 430 },
        { category: 'Clothing', quarter: 'Q1', value: 230 },
        { category: 'Clothing', quarter: 'Q2', value: 310 },
        { category: 'Books', quarter: 'Q1', value: 180 },
        { category: 'Books', quarter: 'Q2', value: 280 }
      ]
    },
    mark: 'bar',
    encoding: {
      x: { field: 'quarter', type: 'nominal' },
      y: { 
        field: 'value', 
        type: 'quantitative',
        stack: true  // This enables stacking
      },
      color: { field: 'category', type: 'nominal' }
    }
  },
  barChartUnstacked: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: [
        { category: 'Electronics', quarter: 'Q1', value: 320 },
        { category: 'Electronics', quarter: 'Q2', value: 430 },
        { category: 'Clothing', quarter: 'Q1', value: 230 },
        { category: 'Clothing', quarter: 'Q2', value: 310 },
        { category: 'Books', quarter: 'Q1', value: 180 },
        { category: 'Books', quarter: 'Q2', value: 280 }
      ]
    },
    mark: 'bar',
    encoding: {
      x: { field: 'quarter', type: 'nominal' },
      y: { 
        field: 'value', 
        type: 'quantitative',
        stack: null  // This disables stacking
      },
      color: { field: 'category', type: 'nominal' },
      xOffset: { field: 'category' }  // This groups bars side by side
    }
  }
}; 