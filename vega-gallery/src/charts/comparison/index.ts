import { TopLevelSpec } from 'vega-lite';

export const groupedBar: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 6 }, (_, i) => ({
      category: ['A', 'B', 'C'][i % 3],
      group: `Group ${Math.floor(i / 3) + 1}`,
      value: Math.random() * 100
    }))
  },
  mark: 'bar',
  encoding: {
    x: { 
      field: 'category', 
      type: 'nominal' 
    },
    y: { 
      field: 'value', 
      type: 'quantitative' 
    },
    xOffset: { 
      field: 'group',  // This creates the grouping
      type: 'nominal'
    },
    color: { 
      field: 'group', 
      type: 'nominal' 
    }
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

export const newChartType: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: [
      { x: 10, y: 20, category: 'A' },
      { x: 15, y: 25, category: 'B' },
      { x: 20, y: 30, category: 'C' }
    ]
  },
  mark: 'point', // or whatever mark type you're using
  encoding: {
    x: { field: 'x', type: 'quantitative' },
    y: { field: 'y', type: 'quantitative' },
    color: { field: 'category', type: 'nominal' }
  }
};

export const violinPlot: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 100 }, () => ({
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      value: Math.random() * 100
    }))
  },
  transform: [{
    density: 'value',
    groupby: ['category'],
    extent: [0, 100],
    steps: 100
  }],
  mark: {
    type: 'area',
    orient: 'horizontal'
  },
  encoding: {
    x: {
      field: 'value',
      type: 'quantitative',
      title: 'Distribution'
    },
    y: {
      field: 'density',
      type: 'quantitative',
      stack: 'center',
      axis: null
    },
    color: { field: 'category', type: 'nominal' }
  }
};

export const heatmap: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 25 }, (_, i) => ({
      x: `Var ${Math.floor(i / 5) + 1}`,
      y: `Var ${(i % 5) + 1}`,
      value: Math.random()
    }))
  },
  mark: 'rect',
  encoding: {
    x: { 
      field: 'x', 
      type: 'ordinal',
      title: 'Variables',
      axis: { labelAngle: 0 }
    },
    y: { 
      field: 'y', 
      type: 'ordinal',
      title: 'Variables'
    },
    color: {
      field: 'value',
      type: 'quantitative',
      scale: {
        scheme: 'viridis',
        domain: [0, 1]
      },
      title: 'Correlation'
    },
    tooltip: [
      { field: 'x', title: 'Variable 1' },
      { field: 'y', title: 'Variable 2' },
      { field: 'value', title: 'Correlation', format: '.2f' }
    ]
  }
};

export const parallelCoordinates: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 20 }, () => ({
      dim1: Math.random() * 100,
      dim2: Math.random() * 100,
      dim3: Math.random() * 100,
      dim4: Math.random() * 100,
      category: ['A', 'B'][Math.floor(Math.random() * 2)]
    }))
  },
  transform: [
    { fold: ['dim1', 'dim2', 'dim3', 'dim4'] }
  ],
  mark: { 
    type: 'line',
    opacity: 0.5
  },
  encoding: {
    x: { 
      field: 'key',  // This will show dimension names
      type: 'nominal',
      title: 'Dimensions'
    },
    y: {
      field: 'value',
      type: 'quantitative',
      scale: { zero: false }
    },
    color: { field: 'category', type: 'nominal' },
    detail: { field: 'category' }  // This creates separate lines per category
  }
};

export const streamGraph: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 60 }, (_, i) => 
      ['A', 'B', 'C'].map(category => ({
        time: i,
        value: Math.sin(i / 10 + ['A', 'B', 'C'].indexOf(category)) * 10 + 20,
        category: category
      }))
    ).flat()
  },
  mark: {
    type: 'area',
    interpolate: 'monotone'
  },
  encoding: {
    x: {
      field: 'time',
      type: 'quantitative',
      title: 'Time'
    },
    y: {
      field: 'value',
      type: 'quantitative',
      stack: 'center',  // Use center for stream graph
      title: 'Value'
    },
    color: {
      field: 'category',
      type: 'nominal'
    },
    order: {
      field: 'value'
    }
  }
};

export const stackedBar: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 20 }, (_, i) => 
      ['A', 'B', 'C'].map(category => ({
        x: `Day ${i}`,
        value: Math.random() * 30 + 10,
        category: category
      }))
    ).flat()
  },
  mark: 'bar',  // Simple mark type
  encoding: {
    x: {
      field: 'x',
      type: 'ordinal',
      title: 'Day'
    },
    y: {
      field: 'value',
      type: 'quantitative',
      stack: 'zero',  // Use zero for regular stacking
      title: 'Value'
    },
    color: {
      field: 'category',
      type: 'nominal'
    },
    tooltip: [
      { field: 'x', title: 'Day' },
      { field: 'value', title: 'Value', format: '.1f' },
      { field: 'category', title: 'Category' }
    ]
  }
};

export const stackedArea: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 60 }, (_, i) => 
      ['A', 'B', 'C'].map(category => ({
        time: i,
        value: Math.sin(i / 10 + ['A', 'B', 'C'].indexOf(category)) * 10 + 20,
        category: category
      }))
    ).flat()
  },
  mark: {
    type: 'area',
    interpolate: 'monotone'
  },
  encoding: {
    x: {
      field: 'time',
      type: 'quantitative',
      title: 'Time'
    },
    y: {
      field: 'value',
      type: 'quantitative',
      stack: 'zero',  // Use zero for regular stacking
      title: 'Value'
    },
    color: {
      field: 'category',
      type: 'nominal'
    },
    order: {
      field: 'value'  // Important for stacking order
    }
  }
};

export const normalizedBar: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 20 }, (_, i) => 
      ['A', 'B', 'C'].map(category => ({
        x: `Category ${i}`,
        value: Math.random() * 30 + 10,
        category: category
      }))
    ).flat()
  },
  mark: 'bar',
  encoding: {
    x: {
      field: 'x',
      type: 'ordinal',
      title: 'Category'
    },
    y: {
      field: 'value',
      type: 'quantitative',
      stack: 'normalize',  // Use normalize for percentage stacking
      axis: { format: '%' },
      title: 'Percentage'
    },
    color: {
      field: 'category',
      type: 'nominal'
    }
  }
};

export const lineChart: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: Array.from({ length: 20 }, (_, i) => ({
      x: i,
      y: Math.sin(i / 3) * 50 + 50
    }))
  },
  mark: {
    type: 'line',
    interpolate: 'monotone'
  },
  encoding: {
    x: {
      field: 'x',
      type: 'quantitative'
    },
    y: {
      field: 'y',
      type: 'quantitative'
    }
  }
};

export const comparison = {
  'grouped-bar': groupedBar,
  'bullet-chart': bulletChart,
  'new-chart-type': newChartType,
  'violin-plot': violinPlot,
  'heatmap': heatmap,
  'parallel-coordinates': parallelCoordinates,
  'stream-graph': streamGraph,
  'stacked-bar': stackedBar,
  'stacked-area': stackedArea,
  'normalized-bar': normalizedBar,
  'line-chart': lineChart
}; 