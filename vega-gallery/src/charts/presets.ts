import { TopLevelSpec } from 'vega-lite';
import { sampleDatasets } from '../utils/sampleData';

interface ChartPreset {
  title: string;
  description: string;
  defaultDataset: string;
  spec: TopLevelSpec;
  // Define how this chart type maps different data fields
  dataEncodings: {
    [datasetId: string]: {
      // For pie charts: what field should be the angle, what should be color, etc
      theta?: string;
      color?: string;
      // For other charts: what fields map to x, y, etc
      x?: string;
      y?: string;
      size?: string;
    }
  }
}

export const chartPresets: Record<string, ChartPreset> = {
  pieChart: {
    title: "Pie Chart",
    description: "Circular statistical visualization for part-to-whole relationships",
    defaultDataset: 'marketShare',
    dataEncodings: {
      marketShare: {
        theta: 'share',
        color: 'company'
      },
      productSales: {
        theta: 'revenue',
        color: 'product'
      },
      categoricalSales: {
        theta: 'value',
        color: 'category'
      }
    },
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      mark: { type: 'arc', innerRadius: 50 },
      encoding: {
        theta: { type: 'quantitative' }, // Field will be set dynamically
        color: { type: 'nominal' }       // Field will be set dynamically
      },
      view: { stroke: null }
    }
  },
  barChart: {
    title: "Bar Chart",
    description: "Simple bar chart for comparing categorical data",
    defaultDataset: 'categoricalSales',
    spec: {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      mark: 'bar',
      encoding: {
        x: { field: 'category', type: 'nominal' },
        y: { field: 'value', type: 'quantitative' }
      }
    }
  },
  scatterPlot: {
    title: "Scatter Plot",
    description: "Show correlation between two variables",
    defaultDataset: 'scatterHealth',
    spec: {
      mark: 'point',
      encoding: {
        x: { field: 'height', type: 'quantitative' },
        y: { field: 'weight', type: 'quantitative' },
        color: { field: 'group', type: 'nominal' }
      }
    }
  },
  lineChart: {
    title: "Line Chart",
    description: "Show trends over time",
    defaultDataset: 'timeSeriesTemp',
    spec: {
      mark: 'line',
      encoding: {
        x: { field: 'date', type: 'temporal' },
        y: { field: 'temperature', type: 'quantitative' },
        color: { field: 'type', type: 'nominal' }
      }
    }
  },
  // Add more presets...
}; 