export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  type: 'categorical' | 'temporal' | 'numerical' | 'hierarchical';
  compatibleCharts: Array<
    | 'bar' | 'line' | 'point' | 'arc' | 'area' | 'boxplot' 
    | 'rect' | 'rule' | 'text' | 'tick' | 'trail' | 'square'
    | 'circle' | 'sunburst' | 'treemap' | 'force-directed' 
    | 'chord-diagram' | 'violin' | 'wordcloud'
  >;
  values: any[];
  columns: string[];
  dataTypes: Record<string, string>;
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

export const generateStatisticalData = () => {
  // Box-Muller transform for better normal distribution
  const normalRandom = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  return Array.from({ length: 200 }, () => {
    const baseValue = normalRandom();
    return {
      group: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      value: 50 + (baseValue * 15), // mean = 50, sd = 15
      category: ['Control', 'Treatment'][Math.floor(Math.random() * 2)],
      outlier: Math.random() < 0.05 // 5% chance of being an outlier
    };
  });
}

export const generateTimeSeriesData = () => {
  return Array.from({ length: 365 }, (_, i) => {
    const trend = i * 0.1;
    const seasonal = 15 * Math.sin(i * 2 * Math.PI / 365); // Yearly seasonality
    const weekly = 5 * Math.sin(i * 2 * Math.PI / 7); // Weekly pattern
    const noise = Math.random() * 8 - 4;
    
    return {
      date: new Date(2023, 0, i + 1).toISOString().split('T')[0],
      value: Math.max(0, 50 + trend + seasonal + weekly + noise),
      category: ['Revenue', 'Costs', 'Profit'][Math.floor(Math.random() * 3)]
    };
  });
}

export const generateHierarchicalData = () => {
  return {
    name: "Organization",
    children: [
      {
        name: "Engineering",
        children: [
          { name: "Frontend", value: 20 },
          { name: "Backend", value: 25 },
          { name: "DevOps", value: 15 },
          { name: "QA", value: 10 }
        ]
      },
      {
        name: "Sales",
        children: [
          { name: "Direct", value: 30 },
          { name: "Channel", value: 25 },
          { name: "Support", value: 15 }
        ]
      },
      {
        name: "Marketing",
        children: [
          { name: "Digital", value: 20 },
          { name: "Events", value: 15 },
          { name: "Content", value: 10 }
        ]
      }
    ]
  };
}

export const generateMultiMetricData = () => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: i,
    category: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    metric1: Math.random() * 100,
    metric2: Math.random() * 50,
    metric3: Math.random() * 200,
    date: new Date(2024, 0, Math.floor(i/3)).toISOString().split('T')[0],
    group: ['Group 1', 'Group 2', 'Group 3'][Math.floor(Math.random() * 3)]
  }));
};

export const generateCategoricalBreakdown = () => {
  const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports'];
  const subcategories = {
    Electronics: ['Phones', 'Laptops', 'Tablets', 'Accessories'],
    Clothing: ['Shirts', 'Pants', 'Dresses', 'Shoes'],
    Food: ['Fruits', 'Vegetables', 'Meat', 'Dairy'],
    Books: ['Fiction', 'Non-fiction', 'Education', 'Comics'],
    Sports: ['Equipment', 'Clothing', 'Accessories', 'Nutrition']
  };
  
  return categories.flatMap(category => 
    subcategories[category].map(subcategory => ({
      category,
      subcategory,
      value: Math.round(Math.random() * 1000),
      growth: Math.round((Math.random() - 0.5) * 100),
      units: Math.round(Math.random() * 500),
      satisfaction: Math.round(Math.random() * 5 * 10) / 10
    }))
  );
};

export const sampleDatasets: Record<string, DatasetMetadata> = {
  categoricalSales: {
    id: 'categorical-sales',
    name: 'Categorical Sales',
    description: 'Sample sales data by category',
    type: 'categorical',
    compatibleCharts: ['bar', 'arc'],
    values: [
      { category: 'Electronics', value: 420, quarter: 'Q1' },
      { category: 'Clothing', value: 330, quarter: 'Q1' },
      { category: 'Books', value: 230, quarter: 'Q1' },
      { category: 'Food', value: 180, quarter: 'Q1' },
      { category: 'Sports', value: 280, quarter: 'Q1' }
    ],
    columns: ['category', 'sales', 'profit'],
    dataTypes: {
      category: 'nominal',
      sales: 'quantitative',
      profit: 'quantitative'
    }
  },
  timeSeriesTemp: {
    id: 'timeseries-temp',
    name: 'Temperature Readings',
    description: 'Daily temperature readings over a month',
    type: 'temporal',
    compatibleCharts: ['line', 'point', 'bar', 'arc'],
    values: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
      temperature: Math.round(20 + Math.sin(i / 3) * 5),
      humidity: Math.round(60 + Math.cos(i / 3) * 10)
    })),
    columns: ['date', 'temperature', 'humidity'],
    dataTypes: {
      date: 'temporal',
      temperature: 'quantitative',
      humidity: 'quantitative'
    }
  },
  scatterHealth: {
    id: 'scatter-health',
    name: 'Health Metrics',
    description: 'Height vs. Weight correlation',
    type: 'numerical',
    compatibleCharts: ['point', 'circle', 'square', 'text', 'trail', 'rule'],
    values: Array.from({ length: 50 }, () => ({
      height: Math.round(160 + Math.random() * 40),
      weight: Math.round(60 + Math.random() * 40),
      bmi: Math.round((20 + Math.random() * 10) * 10) / 10,
      group: ['Male', 'Female'][Math.floor(Math.random() * 2)]
    })),
    columns: ['height', 'weight', 'bmi', 'group'],
    dataTypes: {
      height: 'quantitative',
      weight: 'quantitative',
      bmi: 'quantitative',
      group: 'nominal'
    }
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
    ],
    columns: ['company', 'share'],
    dataTypes: {
      company: 'nominal',
      share: 'quantitative'
    }
  },
  boxplotExample: {
    id: 'boxplot-example',
    name: 'Box Plot Distribution',
    description: 'Distribution of values across categories',
    type: 'categorical',
    compatibleCharts: ['boxplot'],
    values: generateBoxPlotData(),
    columns: ['category', 'value', 'group'],
    dataTypes: {
      category: 'nominal',
      value: 'quantitative',
      group: 'nominal'
    }
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
    })),
    columns: ['x', 'y', 'label', 'value'],
    dataTypes: {
      x: 'quantitative',
      y: 'quantitative',
      label: 'nominal',
      value: 'quantitative'
    }
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
    ],
    columns: ['start', 'end', 'category'],
    dataTypes: {
      start: 'quantitative',
      end: 'quantitative',
      category: 'nominal'
    }
  },
  tickDistribution: {
    id: 'tick-distribution',
    name: 'Value Distribution',
    description: 'Distribution of values using tick marks',
    type: 'numerical',
    compatibleCharts: ['tick', 'point'],
    values: generateTickData(),
    columns: ['value', 'category'],
    dataTypes: {
      value: 'quantitative',
      category: 'nominal'
    }
  },
  boxplotStats: {
    id: 'boxplot-stats',
    name: 'Distribution Statistics',
    description: 'Statistical distribution across categories',
    type: 'numerical',
    compatibleCharts: ['boxplot', 'point'],
    values: generateBoxPlotData(),
    columns: ['category', 'value'],
    dataTypes: {
      category: 'nominal',
      value: 'quantitative'
    }
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
    })),
    columns: ['date', 'value', 'category'],
    dataTypes: {
      date: 'temporal',
      value: 'quantitative',
      category: 'nominal'
    }
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
    })),
    columns: ['date', 'progress', 'velocity'],
    dataTypes: {
      date: 'temporal',
      progress: 'quantitative',
      velocity: 'quantitative'
    }
  },
  organizationHierarchy: {
    id: 'organization-hierarchy',
    name: 'Organization Structure',
    description: 'Company organizational hierarchy',
    type: 'hierarchical',
    compatibleCharts: ['sunburst'],
    values: [
      { name: "Root", parent: null, value: 100 },
      { name: "A", parent: "Root", value: 50 },
      { name: "B", parent: "Root", value: 30 },
      { name: "C", parent: "Root", value: 20 },
      { name: "A1", parent: "A", value: 25 },
      { name: "A2", parent: "A", value: 25 },
      { name: "B1", parent: "B", value: 15 },
      { name: "B2", parent: "B", value: 15 },
      { name: "C1", parent: "C", value: 10 },
      { name: "C2", parent: "C", value: 10 }
    ],
    columns: ['name', 'parent', 'value'],
    dataTypes: {
      name: 'nominal',
      parent: 'nominal',
      value: 'quantitative'
    }
  },
  fileSystem: {
    id: 'file-system',
    name: 'File System',
    description: 'Computer file system structure',
    type: 'hierarchical',
    compatibleCharts: ['rect', 'arc'],
    values: [
      { name: 'Root', parent: null, value: 100 },
      { name: 'Documents', parent: 'Root', value: 35 },
      { name: 'Pictures', parent: 'Root', value: 35 },
      { name: 'System', parent: 'Root', value: 30 },
      { name: 'Work', parent: 'Documents', value: 20 },
      { name: 'Personal', parent: 'Documents', value: 15 },
      { name: 'Vacation', parent: 'Pictures', value: 20 },
      { name: 'Family', parent: 'Pictures', value: 15 },
      { name: 'OS', parent: 'System', value: 20 },
      { name: 'Apps', parent: 'System', value: 10 }
    ],
    columns: ['name', 'parent', 'value'],
    dataTypes: {
      name: 'nominal',
      parent: 'nominal',
      value: 'quantitative'
    }
  },
  dependencies: {
    id: 'dependencies',
    name: 'Package Dependencies',
    description: 'Software package dependency graph',
    type: 'hierarchical',
    compatibleCharts: ['line', 'arc'],
    values: [
      { source: 'App', target: 'React', value: 8 },
      { source: 'App', target: 'Redux', value: 6 },
      { source: 'React', target: 'DOM', value: 5 },
      { source: 'Redux', target: 'React', value: 3 },
      { source: 'Router', target: 'React', value: 4 },
      { source: 'App', target: 'Router', value: 5 },
      { source: 'Redux', target: 'Store', value: 7 },
      { source: 'Store', target: 'State', value: 4 }
    ],
    columns: ['source', 'target', 'value'],
    dataTypes: {
      source: 'nominal',
      target: 'nominal',
      value: 'quantitative'
    }
  },
  socialNetwork: {
    id: 'social-network',
    name: 'Social Connections',
    description: 'Social network interaction graph',
    type: 'hierarchical',
    compatibleCharts: ['line', 'arc'],
    values: [
      { source: 'Alice', target: 'Bob', value: 5 },
      { source: 'Bob', target: 'Carol', value: 3 },
      { source: 'Carol', target: 'David', value: 4 },
      { source: 'David', target: 'Alice', value: 2 },
      { source: 'Eve', target: 'Bob', value: 6 },
      { source: 'Alice', target: 'Eve', value: 4 },
      { source: 'Frank', target: 'Carol', value: 5 },
      { source: 'Eve', target: 'Frank', value: 3 }
    ],
    columns: ['source', 'target', 'value'],
    dataTypes: {
      source: 'nominal',
      target: 'nominal',
      value: 'quantitative'
    }
  },
  teamCollaboration: {
    id: 'team-collaboration',
    name: 'Team Collaboration',
    description: 'Cross-team collaboration frequency',
    type: 'hierarchical',
    compatibleCharts: ['line', 'arc'],
    values: [
      { source: 'Design', target: 'Frontend', value: 10 },
      { source: 'Frontend', target: 'Backend', value: 8 },
      { source: 'Backend', target: 'DevOps', value: 6 },
      { source: 'DevOps', target: 'QA', value: 4 },
      { source: 'QA', target: 'Design', value: 3 },
      { source: 'Frontend', target: 'QA', value: 5 },
      { source: 'Design', target: 'Backend', value: 2 },
      { source: 'DevOps', target: 'Frontend', value: 7 }
    ],
    columns: ['source', 'target', 'value'],
    dataTypes: {
      source: 'nominal',
      target: 'nominal',
      value: 'quantitative'
    }
  },
  statisticalDistribution: {
    id: 'statistical-distribution',
    name: 'Statistical Distributions',
    description: 'Various statistical distributions for advanced analysis',
    type: 'numerical',
    compatibleCharts: ['violin', 'boxplot', 'point'],
    values: generateStatisticalData(),
    columns: ['group', 'value', 'category', 'outlier'],
    dataTypes: {
      group: 'nominal',
      value: 'quantitative',
      category: 'nominal',
      outlier: 'boolean'
    }
  },
  detailedTimeSeries: {
    id: 'detailed-timeseries',
    name: 'Complex Time Series',
    description: 'Time series with seasonal patterns and trends',
    type: 'temporal',
    compatibleCharts: ['line', 'area', 'point'],
    values: generateTimeSeriesData(),
    columns: ['date', 'value', 'category'],
    dataTypes: {
      date: 'temporal',
      value: 'quantitative',
      category: 'nominal'
    }
  },
  complexHierarchy: {
    id: 'complex-hierarchy',
    name: 'Complex Organization',
    description: 'Multi-level organizational structure',
    type: 'hierarchical',
    compatibleCharts: ['treemap', 'sunburst'],
    values: [
      { id: "CEO", parentId: null, value: 100 },
      { id: "Engineering", parentId: "CEO", value: 50 },
      { id: "Sales", parentId: "CEO", value: 30 },
      { id: "Marketing", parentId: "CEO", value: 20 },
      { id: "Frontend", parentId: "Engineering", value: 20 },
      { id: "Backend", parentId: "Engineering", value: 15 },
      { id: "DevOps", parentId: "Engineering", value: 15 },
      { id: "Enterprise", parentId: "Sales", value: 15 },
      { id: "SMB", parentId: "Sales", value: 15 },
      { id: "Digital", parentId: "Marketing", value: 10 },
      { id: "Events", parentId: "Marketing", value: 10 },
      { id: "React", parentId: "Frontend", value: 10 },
      { id: "Vue", parentId: "Frontend", value: 10 },
      { id: "Node", parentId: "Backend", value: 7 },
      { id: "Python", parentId: "Backend", value: 8 },
      { id: "AWS", parentId: "DevOps", value: 8 },
      { id: "K8s", parentId: "DevOps", value: 7 }
    ],
    columns: ['id', 'parentId', 'value'],
    dataTypes: {
      id: 'nominal',
      parentId: 'nominal',
      value: 'quantitative'
    }
  },
  hierarchicalOrg: {
    id: 'hierarchical-org',
    name: 'Organizational Structure',
    description: 'Complex organizational hierarchy',
    type: 'hierarchical',
    compatibleCharts: ['treemap', 'sunburst'],
    values: [generateHierarchicalData()].flat(),
    columns: ['name', 'value'],
    dataTypes: {
      name: 'nominal',
      value: 'quantitative'
    }
  },
  networkConnections: {
    id: 'network-connections',
    name: 'Network Connections',
    description: 'Complex network relationships',
    type: 'hierarchical',
    compatibleCharts: ['force-directed', 'chord-diagram'],
    values: [
      { source: 'Frontend', target: 'API', value: 10 },
      { source: 'API', target: 'Database', value: 8 },
      { source: 'Frontend', target: 'Auth', value: 6 },
      { source: 'API', target: 'Cache', value: 5 },
      { source: 'Cache', target: 'Database', value: 7 },
      { source: 'Auth', target: 'Database', value: 4 },
      { source: 'Frontend', target: 'Analytics', value: 3 },
      { source: 'Analytics', target: 'Database', value: 5 }
    ],
    columns: ['source', 'target', 'value'],
    dataTypes: {
      source: 'nominal',
      target: 'nominal',
      value: 'quantitative'
    }
  },
  textAnalysis: {
    id: 'text-analysis',
    name: 'Word Frequencies',
    description: 'Sample text data for word cloud visualization',
    type: 'categorical',
    compatibleCharts: ['text'],
    values: [
      { text: 'Data', value: 100 },
      { text: 'Visualization', value: 85 },
      { text: 'Analytics', value: 80 },
      { text: 'Chart', value: 75 },
      { text: 'Graph', value: 70 },
      { text: 'Dashboard', value: 65 },
      { text: 'Statistics', value: 60 },
      { text: 'Analysis', value: 55 },
      { text: 'Insights', value: 50 },
      { text: 'Trends', value: 45 },
      { text: 'Metrics', value: 40 },
      { text: 'Report', value: 35 },
      { text: 'Performance', value: 30 },
      { text: 'Growth', value: 25 },
      { text: 'Strategy', value: 20 }
    ],
    columns: ['text', 'value'],
    dataTypes: {
      text: 'nominal',
      value: 'quantitative'
    }
  },
  wordFrequencies: {
    id: 'word-frequencies',
    name: 'Word Frequencies',
    description: 'Common words and their frequencies for word cloud visualization',
    type: 'categorical',
    compatibleCharts: ['wordcloud'],
    values: [
      {text: "Data", size: 100},
      {text: "Analytics", size: 85},
      {text: "Visualization", size: 80},
      {text: "Machine", size: 75},
      {text: "Learning", size: 75},
      {text: "Algorithm", size: 70},
      {text: "Statistics", size: 65},
      {text: "Programming", size: 60},
      {text: "Python", size: 55},
      {text: "JavaScript", size: 50},
      {text: "Database", size: 45},
      {text: "Cloud", size: 40},
      {text: "Network", size: 35},
      {text: "Security", size: 30},
      {text: "API", size: 25}
    ],
    columns: ['text', 'size'],
    dataTypes: {
      text: 'nominal',
      size: 'quantitative'
    }
  },
  multiMetricAnalysis: {
    id: 'multi-metric-analysis',
    name: 'Multi-Metric Analysis',
    description: 'Multiple metrics across categories and time',
    type: 'numerical',
    compatibleCharts: ['bar', 'line', 'point', 'area', 'boxplot', 'violin'],
    values: generateMultiMetricData(),
    columns: ['id', 'category', 'metric1', 'metric2', 'metric3', 'date', 'group'],
    dataTypes: {
      id: 'quantitative',
      category: 'nominal',
      metric1: 'quantitative',
      metric2: 'quantitative',
      metric3: 'quantitative',
      date: 'temporal',
      group: 'nominal'
    }
  },
  retailBreakdown: {
    id: 'retail-breakdown',
    name: 'Retail Category Analysis',
    description: 'Detailed breakdown of retail categories with multiple metrics',
    type: 'categorical',
    compatibleCharts: ['bar', 'point', 'treemap', 'sunburst', 'heatmap'],
    values: generateCategoricalBreakdown(),
    columns: ['category', 'subcategory', 'value', 'growth', 'units', 'satisfaction'],
    dataTypes: {
      category: 'nominal',
      subcategory: 'nominal',
      value: 'quantitative',
      growth: 'quantitative',
      units: 'quantitative',
      satisfaction: 'quantitative'
    }
  },
  combinedMetrics: {
    id: 'combined-metrics',
    name: 'Combined Metrics View',
    description: 'Multiple metrics that work well with various chart types',
    type: 'numerical',
    compatibleCharts: ['bar', 'line', 'point', 'area', 'boxplot', 'violin'],
    values: Array.from({ length: 50 }, (_, i) => ({
      date: new Date(2024, 0, i).toISOString().split('T')[0],
      category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
      value: Math.random() * 100,
      trend: Math.sin(i / 10) * 50 + 50,
      volume: Math.round(Math.random() * 1000),
      sentiment: Math.round(Math.random() * 5 * 10) / 10
    })),
    columns: ['date', 'category', 'value', 'trend', 'volume', 'sentiment'],
    dataTypes: {
      date: 'temporal',
      category: 'nominal',
      value: 'quantitative',
      trend: 'quantitative',
      volume: 'quantitative',
      sentiment: 'quantitative'
    }
  },
  newDatasetType: {
    id: 'new-dataset-id',
    name: 'New Dataset Name',
    description: 'Description of the dataset',
    type: 'categorical',
    compatibleCharts: ['bar', 'line', 'your-new-chart-type'],
    values: [
      { x: 10, y: 20, category: 'A' },
      { x: 15, y: 25, category: 'B' },
      { x: 20, y: 30, category: 'C' }
    ],
    columns: ['x', 'y', 'category'],
    dataTypes: {
      x: 'quantitative',
      y: 'quantitative',
      category: 'nominal'
    }
  }
} 