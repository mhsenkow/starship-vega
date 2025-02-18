export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  type: 'categorical' | 'temporal' | 'numerical' | 'hierarchical';
  compatibleCharts: Array<'bar' | 'line' | 'point' | 'arc' | 'area' | 'boxplot' | 'rect' | 'rule' | 'text' | 'tick' | 'trail' | 'square'>;
  values: any[];
}

export const generateBoxPlotData = () => {
  const categories = ['A', 'B', 'C']
  const groups = ['Group 1', 'Group 2']
  const data = []

  for (let i = 0; i < 100; i++) {
    data.push({
      category: categories[Math.floor(Math.random() * categories.length)],
      value: Math.random() * 100,
      group: groups[Math.floor(Math.random() * groups.length)]
    })
  }
  return data
}

export const generateTickData = () => {
  const data = []
  for (let i = 0; i < 50; i++) {
    data.push({
      value: Math.random() * 100,
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
    })
  }
  return data
}

export const sampleDatasets: Record<string, DatasetMetadata> = {
  categoricalSales: {
    id: 'categorical-sales',
    name: 'Product Sales',
    description: 'Sales data across product categories',
    type: 'categorical',
    compatibleCharts: ['bar', 'arc'],
    values: [
      { category: 'Electronics', value: 420, quarter: 'Q1' },
      { category: 'Clothing', value: 330, quarter: 'Q1' },
      { category: 'Books', value: 230, quarter: 'Q1' },
      { category: 'Food', value: 180, quarter: 'Q1' },
      { category: 'Sports', value: 280, quarter: 'Q1' }
    ]
  },
  timeSeriesTemp: {
    id: 'timeseries-temp',
    name: 'Temperature Readings',
    description: 'Daily temperature readings over a month',
    type: 'temporal',
    compatibleCharts: ['line', 'point', 'bar'],
    values: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      temperature: Math.round(20 + Math.sin(i / 3) * 5),
      humidity: Math.round(60 + Math.cos(i / 3) * 10)
    }))
  },
  scatterHealth: {
    id: 'scatter-health',
    name: 'Health Metrics',
    description: 'Height vs. Weight correlation',
    type: 'numerical',
    compatibleCharts: ['point', 'bar'],
    values: Array.from({ length: 50 }, () => ({
      height: Math.round(160 + Math.random() * 40),
      weight: Math.round(60 + Math.random() * 40),
      bmi: Math.round((20 + Math.random() * 10) * 10) / 10,
      group: ['Male', 'Female'][Math.floor(Math.random() * 2)]
    }))
  },
  marketShare: {
    id: 'market-share',
    name: 'Market Share',
    description: 'Company market share distribution',
    type: 'categorical',
    compatibleCharts: ['arc', 'bar'],
    values: [
      { company: 'Company A', share: 35 },
      { company: 'Company B', share: 25 },
      { company: 'Company C', share: 20 },
      { company: 'Company D', share: 15 },
      { company: 'Others', share: 5 }
    ]
  },
  boxplotExample: {
    id: 'boxplot-example',
    name: 'Box Plot Distribution',
    description: 'Distribution of values across categories',
    type: 'categorical',
    compatibleCharts: ['boxplot'],
    values: generateBoxPlotData()
  },
  textAnnotations: {
    id: 'text-annotations',
    name: 'Data Labels',
    description: 'Text annotations with data points',
    type: 'numerical',
    compatibleCharts: ['text', 'point'],
    values: Array.from({ length: 10 }, (_, i) => ({
      x: i * 10,
      y: Math.random() * 100,
      label: `Point ${String.fromCharCode(65 + i)}`,
      value: Math.round(Math.random() * 100)
    }))
  },
  ruleGuides: {
    id: 'rule-guides',
    name: 'Reference Lines',
    description: 'Reference lines and thresholds',
    type: 'categorical',
    compatibleCharts: ['rule'],
    values: [
      { start: 0, end: 100, category: 'Threshold 1' },
      { start: 20, end: 80, category: 'Threshold 2' },
      { start: 40, end: 60, category: 'Threshold 3' }
    ]
  },
  tickDistribution: {
    id: 'tick-distribution',
    name: 'Value Distribution',
    description: 'Distribution of values using tick marks',
    type: 'numerical',
    compatibleCharts: ['tick', 'point'],
    values: generateTickData()
  },
  boxplotStats: {
    id: 'boxplot-stats',
    name: 'Distribution Statistics',
    description: 'Statistical distribution across categories',
    type: 'numerical',
    compatibleCharts: ['boxplot', 'point'],
    values: generateBoxPlotData()
  },
  areaTimeSeries: {
    id: 'area-timeseries',
    name: 'Cumulative Growth',
    description: 'Area chart showing growth over time',
    type: 'temporal',
    compatibleCharts: ['area', 'line'],
    values: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      value: Math.floor(100 + i * 10 + Math.random() * 50),
      category: ['Revenue', 'Costs'][Math.floor(Math.random() * 2)]
    }))
  },
  trailProgress: {
    id: 'trail-progress',
    name: 'Progress Trail',
    description: 'Trail showing progress over time',
    type: 'temporal',
    compatibleCharts: ['trail', 'line'],
    values: Array.from({ length: 20 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      progress: Math.floor(i * 5 + Math.random() * 10),
      velocity: Math.random() * 5
    }))
  }
} 