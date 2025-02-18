export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  type: 'categorical' | 'temporal' | 'numerical' | 'hierarchical';
  compatibleCharts: Array<'bar' | 'line' | 'point' | 'arc'>;
  values: any[];
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
  }
} 