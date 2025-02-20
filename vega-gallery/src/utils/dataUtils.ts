import { MarkType } from '../types/vega';
import { DatasetMetadata } from '../types/dataset';

export const detectDataTypes = (values: any[]): Record<string, string> => {
  if (!values.length) return {};

  const sample = values[0];
  const types: Record<string, string> = {};

  Object.entries(sample).forEach(([key, value]) => {
    if (typeof value === 'number') {
      types[key] = 'quantitative';
    } else if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
      types[key] = 'temporal';
    } else if (typeof value === 'string') {
      // Check if it's a hierarchical relationship field
      if (key.includes('parent') || key.includes('source') || key.includes('target')) {
        types[key] = 'hierarchical';
      } else {
        // Attempt to determine if it's ordinal or nominal
        const uniqueValues = new Set(values.map(v => v[key]));
        types[key] = uniqueValues.size < values.length * 0.3 ? 'ordinal' : 'nominal';
      }
    } else if (typeof value === 'boolean') {
      types[key] = 'nominal';
    }
  });

  return types;
};

export const inferChartType = (dataTypes: Record<string, string>): string[] => {
  const types = new Set(Object.values(dataTypes));
  const charts: string[] = [];

  // Basic chart type inference
  if (types.has('quantitative')) {
    if (types.has('temporal')) {
      charts.push('line-chart', 'area-chart');
    } else {
      charts.push('scatter-plot', 'bubble-chart');
    }
  }

  if (types.has('ordinal') || types.has('nominal')) {
    charts.push('bar-chart');
    if (types.has('quantitative')) {
      charts.push('grouped-bar', 'stacked-bar');
    }
  }

  if (types.has('hierarchical')) {
    charts.push('treemap', 'sunburst');
  }

  return charts;
};

export const validateDataset = (values: any[]): boolean => {
  if (!Array.isArray(values) || !values.length) {
    return false;
  }

  // Check that all items have the same structure
  const firstItem = values[0];
  const firstItemKeys = Object.keys(firstItem).sort();

  return values.every(item => {
    const itemKeys = Object.keys(item).sort();
    return JSON.stringify(itemKeys) === JSON.stringify(firstItemKeys);
  });
};

export const determineCompatibleCharts = (dataTypes: Record<string, string>): MarkType[] => {
  const types = new Set(Object.values(dataTypes));
  const charts: MarkType[] = [];
  
  // Quantitative data enables many chart types
  if (types.has('quantitative')) {
    charts.push('bar', 'line', 'point', 'area', 'boxplot', 'violin');
    
    // If we have multiple quantitative fields, enable more charts
    if (Object.values(dataTypes).filter(t => t === 'quantitative').length > 1) {
      charts.push('circle', 'square');
    }
  }

  // Temporal data works well with trend-showing charts
  if (types.has('temporal')) {
    charts.push('line', 'area', 'point', 'bar', 'trail');
  }

  // Categorical/Nominal data works with discrete charts
  if (types.has('nominal') || types.has('ordinal')) {
    charts.push('bar', 'point', 'text', 'tick');
    
    // If we have quantitative data too, enable more charts
    if (types.has('quantitative')) {
      charts.push('boxplot', 'violin');
    }
  }

  // Hierarchical relationships enable specific chart types
  if (Object.keys(dataTypes).some(k => 
    k.includes('parent') || k.includes('source') || k.includes('target'))) {
    charts.push('treemap', 'sunburst');
    
    if (Object.keys(dataTypes).some(k => k.includes('source') || k.includes('target'))) {
      charts.push('force-directed', 'chord-diagram');
    }
  }

  // Text data enables word-related visualizations
  if (Object.keys(dataTypes).some(k => k.includes('text') || k.includes('label'))) {
    charts.push('text', 'wordcloud');
  }

  return [...new Set(charts)];
};

export const isDatasetCompatibleWithChart = (
  dataset: DatasetMetadata, 
  chartId: string
): boolean => {
  const dataTypes = detectDataTypes(dataset.values);
  const compatibleCharts = determineCompatibleCharts(dataTypes);
  
  // Special compatibility rules
  switch (chartId) {
    case 'boxplot':
    case 'violin':
      // Need both categorical and numerical data
      return dataset.values.some(v => 
        typeof v.category === 'string' && 
        typeof v.value === 'number'
      );
      
    case 'wordcloud':
      // Need text and size/value fields
      return dataset.values.some(v => 
        (typeof v.text === 'string' || typeof v.word === 'string') && 
        (typeof v.size === 'number' || typeof v.value === 'number')
      );
      
    case 'force-directed':
    case 'chord-diagram':
      // Need source-target relationships
      return dataset.values.some(v => 
        typeof v.source !== 'undefined' && 
        typeof v.target !== 'undefined'
      );
      
    case 'sunburst':
    case 'treemap':
      // Need hierarchical structure
      return dataset.values.some(v => 
        (typeof v.parent !== 'undefined' || typeof v.parentId !== 'undefined') &&
        typeof v.value === 'number'
      );
      
    default:
      return compatibleCharts.includes(chartId as MarkType);
  }
}; 