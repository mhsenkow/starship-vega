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
        view: {
          stroke: null
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
  }
}
