import { TopLevelSpec } from 'vega-lite'
import vegaEmbed from 'vega-embed'
import { sampleDatasets, generateBoxPlotData, generateTickData } from './sampleData'

interface RenderOptions {
  mode?: 'gallery' | 'editor'
}

export const renderVegaLite = async (
  element: HTMLElement, 
  spec: TopLevelSpec,
  options: RenderOptions = {}
) => {
  try {
    const responsiveSpec = {
      ...spec,
      ...(options.mode === 'gallery' ? {
        width: 300,
        height: 180,
        autosize: {
          type: "fit",
          contains: "padding"
        }
      } : {
        width: "container",
        height: "container",
        autosize: {
          type: "fit",
          contains: "padding"
        }
      }),
      config: {
        ...spec.config,
        view: {
          ...spec.config?.view,
          stroke: null
        },
        boxplot: {
          ...spec.config?.boxplot
        }
      }
    }

    await vegaEmbed(element, responsiveSpec, {
      actions: false,
      renderer: 'svg',
      downloadFileName: 'chart'
    })
  } catch (error) {
    console.error('Error rendering Vega-Lite chart:', error)
  }
}

// Update chart specifications to be container-responsive
export const chartSpecs: Record<string, TopLevelSpec> = {
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
  },
  'bar-chart': {
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
  },
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
      theta: { field: 'value', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    }
  },
  'boxplot-distribution': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Box Plot Distribution',
    description: 'Statistical distribution across categories',
    mark: 'boxplot',
    data: {
      values: generateBoxPlotData()
    },
    encoding: {
      x: { field: 'category', type: 'nominal' },
      y: { field: 'value', type: 'quantitative' },
      color: { field: 'group', type: 'nominal' }
    }
  },
  'area-growth': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Area Growth',
    description: 'Area chart showing cumulative growth',
    mark: 'area',
    data: {
      values: sampleDatasets.areaTimeSeries.values
    },
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'value', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    }
  },
  'tick-distribution': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Tick Distribution',
    description: 'Distribution of values using tick marks',
    mark: 'tick',
    data: {
      values: generateTickData()
    },
    encoding: {
      x: { field: 'value', type: 'quantitative' },
      y: { field: 'category', type: 'nominal' },
      color: { field: 'category', type: 'nominal' }
    }
  },
  'trail-progress': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Progress Trail',
    description: 'Trail showing progress over time',
    mark: 'trail',
    data: {
      values: sampleDatasets.trailProgress.values
    },
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'progress', type: 'quantitative' },
      size: { field: 'velocity', type: 'quantitative' }
    }
  },
  'text-labels': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    mark: 'text',
    encoding: {
      x: { field: 'x', type: 'quantitative' },
      y: { field: 'y', type: 'quantitative' },
      text: { field: 'label', type: 'nominal' },
      size: { field: 'value', type: 'quantitative' }
    }
  },
  'trail-visualization': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    mark: 'trail',
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'progress', type: 'quantitative' },
      size: { field: 'velocity', type: 'quantitative' }
    }
  },
  'heatmap-correlation': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Correlation Heatmap',
    description: 'Matrix showing correlation between variables',
    data: {
      values: Array.from({ length: 25 }, (_, i) => ({
        x: `Var${Math.floor(i / 5) + 1}`,
        y: `Var${(i % 5) + 1}`,
        correlation: Math.round((Math.random() * 2 - 1) * 100) / 100
      }))
    },
    mark: 'rect',
    encoding: {
      x: { field: 'x', type: 'nominal', axis: { labelAngle: -45 } },
      y: { field: 'y', type: 'nominal' },
      color: {
        field: 'correlation',
        type: 'quantitative',
        scale: {
          domain: [-1, 1],
          scheme: 'blueorange'
        }
      },
      tooltip: [
        { field: 'x', type: 'nominal' },
        { field: 'y', type: 'nominal' },
        { field: 'correlation', type: 'quantitative', format: '.2f' }
      ]
    }
  },
  'stream-graph': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Stream Graph',
    description: 'Streamgraph showing category evolution over time',
    data: {
      values: Array.from({ length: 200 }, (_, i) => {
        const date = new Date(2024, 0, Math.floor(i / 5) + 1);
        return {
          date: date.toISOString().split('T')[0],
          category: `Category ${(i % 5) + 1}`,
          value: Math.max(0, 50 + Math.sin(i / 10) * 30 + Math.random() * 20)
        };
      })
    },
    mark: 'area',
    encoding: {
      x: { 
        field: 'date', 
        type: 'temporal',
        axis: { grid: false }
      },
      y: {
        field: 'value',
        type: 'quantitative',
        stack: 'center',
        axis: { grid: false }
      },
      color: { 
        field: 'category', 
        type: 'nominal',
        scale: { scheme: 'category10' }
      },
      tooltip: [
        { field: 'date', type: 'temporal', format: '%Y-%m-%d' },
        { field: 'category', type: 'nominal' },
        { field: 'value', type: 'quantitative', format: '.1f' }
      ]
    }
  },
  'radial-plot': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Radial Plot',
    description: 'Radial visualization of periodic patterns',
    data: {
      values: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        value: 20 + Math.sin(i / 24 * Math.PI * 2) * 10 + Math.random() * 5,
        category: `Metric ${Math.floor(i / 8) + 1}`
      }))
    },
    encoding: {
      theta: { field: 'hour', type: 'quantitative', scale: { domain: [0, 24] } },
      radius: { field: 'value', type: 'quantitative', scale: { type: 'sqrt' } },
      color: { field: 'category', type: 'nominal' }
    },
    layer: [{
      mark: { type: 'arc', innerRadius: 20, stroke: '#fff' }
    }, {
      mark: { type: 'text', radiusOffset: 10 },
      encoding: {
        text: { field: 'hour', type: 'quantitative' }
      }
    }]
  },
  'interactive-multiline': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Interactive Multi-Line Chart',
    description: 'Multi-line chart with interactive highlighting',
    data: {
      values: Array.from({ length: 300 }, (_, i) => ({
        date: new Date(2024, 0, Math.floor(i / 5) + 1).toISOString().split('T')[0],
        series: `Series ${(i % 5) + 1}`,
        value: 100 + Math.sin(i / 20) * 30 + Math.cos(i / 10) * 20 + Math.random() * 10
      }))
    },
    mark: {
      type: 'line',
      point: true
    },
    encoding: {
      x: { 
        field: 'date', 
        type: 'temporal',
        axis: { grid: false }
      },
      y: { 
        field: 'value', 
        type: 'quantitative',
        axis: { grid: true }
      },
      color: { field: 'series', type: 'nominal' },
      opacity: {
        condition: { param: 'hover', value: 1 },
        value: 0.2
      },
      tooltip: [
        { field: 'date', type: 'temporal', format: '%Y-%m-%d' },
        { field: 'series', type: 'nominal' },
        { field: 'value', type: 'quantitative', format: '.1f' }
      ]
    },
    params: [{
      name: 'hover',
      select: {
        type: 'point',
        fields: ['series'],
        on: 'mouseover'
      }
    }]
  },
  'violin-plot': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Violin Plot',
    description: 'Distribution density visualization',
    transform: [{
      density: 'value',
      groupby: ['category'],
      extent: [0, 100],
      steps: 100,
      as: ['value', 'density']
    }],
    mark: {
      type: 'area',
      orient: 'horizontal'
    },
    data: {
      values: Array.from({ length: 200 }, () => ({
        category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        value: Math.random() * 100
      }))
    },
    encoding: {
      x: {
        field: 'density',
        type: 'quantitative',
        title: 'Density'
      },
      y: { field: 'value', type: 'quantitative' },
      color: { field: 'category', type: 'nominal' }
    }
  },
  'histogram-kde': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Histogram with KDE',
    description: 'Histogram with kernel density estimation',
    layer: [
      {
        mark: { type: 'bar', opacity: 0.7 },
        data: {
          values: Array.from({ length: 200 }, () => ({
            value: Math.random() * 100 + Math.random() * 50
          }))
        },
        encoding: {
          x: {
            field: 'value',
            type: 'quantitative',
            bin: { maxbins: 30 }
          },
          y: {
            aggregate: 'count',
            type: 'quantitative',
            stack: null,
            title: 'Count'
          }
        }
      },
      {
        transform: [{
          density: 'value',
          bandwidth: 5,
          extent: [0, 150],
          as: ['value', 'density']
        }],
        mark: { 
          type: 'line',
          color: '#FF7F0E',
          strokeWidth: 2
        },
        encoding: {
          x: { field: 'value', type: 'quantitative' },
          y: { 
            field: 'density',
            type: 'quantitative',
            scale: { zero: false }
          }
        }
      }
    ]
  },
  'qq-plot': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Q-Q Plot',
    description: 'Quantile-Quantile plot for distribution comparison',
    data: {
      values: Array.from({ length: 100 }, (_, i) => ({
        observed: Math.random() * 100,
        theoretical: ((i + 0.5) / 100) * 100
      }))
    },
    transform: [
      {
        quantile: 'observed',
        step: 0.01,
        as: ['p', 'observed_q']
      }
    ],
    mark: { 
      type: 'point',
      filled: true,
      opacity: 0.5
    },
    encoding: {
      x: {
        field: 'theoretical',
        type: 'quantitative',
        title: 'Theoretical Quantiles'
      },
      y: {
        field: 'observed',
        type: 'quantitative',
        title: 'Observed Quantiles'
      }
    }
  },
  'error-bars': {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    name: 'Error Bars',
    description: 'Bar chart with confidence intervals',
    layer: [
      {
        mark: 'bar',
        data: {
          values: Array.from({ length: 5 }, (_, i) => ({
            category: `Category ${String.fromCharCode(65 + i)}`,
            mean: 50 + Math.random() * 30,
            stderr: 5 + Math.random() * 5
          }))
        },
        encoding: {
          x: { field: 'category', type: 'nominal' },
          y: { 
            field: 'mean',
            type: 'quantitative',
            scale: { zero: false }
          },
          color: { value: '#4C78A8' }
        }
      },
      {
        mark: 'errorbar',
        encoding: {
          x: { field: 'category', type: 'nominal' },
          y: {
            field: 'mean',
            type: 'quantitative',
            title: 'Value'
          },
          yError: { field: 'stderr' },
          color: { value: 'black' }
        }
      }
    ]
  }
}
