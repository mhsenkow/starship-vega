import { TopLevelSpec } from 'vega-lite';
import { sampleDatasets } from '../../utils/sampleData';
import { ChartDefinition, ChartCategory } from '../../types/chart';

export const lineChart: TopLevelSpec = {
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
};

export const areaGrowth: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  data: {
    values: sampleDatasets.areaTimeSeries.values
  },
  mark: 'area',
  encoding: {
    x: { field: 'date', type: 'temporal' },
    y: { field: 'value', type: 'quantitative' },
    color: { field: 'category', type: 'nominal' }
  }
};

export const streamGraph: TopLevelSpec = {
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
    }
  }
};

export const radialPlot: TopLevelSpec = {
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
  layer: [{
    mark: { type: 'arc', innerRadius: 20, stroke: '#fff' },
    encoding: {
      theta: { 
        field: 'hour', 
        type: 'quantitative',
        scale: { domain: [0, 24] }
      },
      radius: { 
        field: 'value', 
        type: 'quantitative',
        scale: { type: 'sqrt', zero: true }
      },
      color: { field: 'category', type: 'nominal' }
    }
  }]
};

export const interactiveMultiline: TopLevelSpec = {
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
    }
  },
  params: [{
    name: 'hover',
    select: {
      type: 'point',
      fields: ['series'],
      on: 'mouseover'
    }
  }]
};

// Export all time series charts
export const timeSeries = {
  'line-chart': lineChart,
  'area-growth': areaGrowth,
  'stream-graph': streamGraph,
  'radial-plot': radialPlot,
  'interactive-multiline': interactiveMultiline
};

export const timeSeriesCharts: ChartDefinition[] = [
  {
    id: 'line-chart',
    title: 'Line Chart',
    category: ChartCategory.TimeSeries,
    description: 'Basic line chart for temporal data',
    tags: ['line', 'temporal', 'trend'],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 500,
      height: 300,
      data: {
        values: Array.from({ length: 50 }, (_, i) => ({
          time: new Date(2024, 0, i + 1).toISOString().split('T')[0],
          value: Math.sin(i / 8) * 20 + 50 + Math.random() * 5
        }))
      },
      mark: {
        type: 'line',
        point: true,
        strokeWidth: 2
      },
      encoding: {
        x: { 
          field: 'time', 
          type: 'temporal',
          axis: { grid: false }
        },
        y: { 
          field: 'value', 
          type: 'quantitative',
          axis: { grid: true }
        },
        color: { value: '#4C78A8' }
      }
    }
  },
  {
    id: 'area-chart',
    title: 'Area Chart',
    category: ChartCategory.TimeSeries,
    description: 'Area chart showing temporal trends',
    tags: ['area', 'temporal', 'trend'],
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 500,
      height: 300,
      data: {
        values: Array.from({ length: 50 }, (_, i) => ({
          time: new Date(2024, 0, i + 1).toISOString().split('T')[0],
          value: Math.sin(i / 8) * 20 + 50 + Math.random() * 5
        }))
      },
      mark: {
        type: 'area',
        opacity: 0.6,
        line: true,
        point: true
      },
      encoding: {
        x: { 
          field: 'time', 
          type: 'temporal',
          axis: { grid: false }
        },
        y: { 
          field: 'value', 
          type: 'quantitative',
          axis: { grid: true }
        },
        color: { value: '#72B7B2' }
      }
    }
  }
]; 