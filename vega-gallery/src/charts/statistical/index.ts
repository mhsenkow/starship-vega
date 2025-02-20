import { TopLevelSpec } from 'vega-lite';
import { generateBoxPlotData } from '../../utils/sampleData';

export const barChart: TopLevelSpec = {
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
};

export const scatterPlot: TopLevelSpec = {
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
};

export const boxPlot: TopLevelSpec = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  mark: 'boxplot',
  data: {
    values: generateBoxPlotData()
  },
  encoding: {
    x: { field: 'category', type: 'nominal' },
    y: { field: 'value', type: 'quantitative' },
    color: { field: 'group', type: 'nominal' }
  }
};

export const violinPlot: TopLevelSpec = {
  // ... copy from vegaHelper.ts violin-plot spec
};

export const histogramKde: TopLevelSpec = {
  // ... copy from vegaHelper.ts histogram-kde spec
};

export const qqPlot: TopLevelSpec = {
  // ... copy from vegaHelper.ts qq-plot spec
};

export const errorBars: TopLevelSpec = {
  // ... copy from vegaHelper.ts error-bars spec
};

// Export all statistical charts
export const statistical = {
  'bar-chart': barChart,
  'scatter-plot': scatterPlot,
  'boxplot-distribution': boxPlot,
  'violin-plot': violinPlot,
  'histogram-kde': histogramKde,
  'qq-plot': qqPlot,
  'error-bars': errorBars
};
