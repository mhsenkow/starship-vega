import { MarkType } from '../types/vega';
import { DatasetMetadata } from '../types/dataset';

/**
 * Data analysis and type inference utilities
 * - detectDataTypes: Analyzes data to determine field types
 * - inferChartType: Suggests chart types based on data
 * - determineDatasetType: Categorizes datasets
 * Used by: DatasetSelector, VisualEditor
 */

export function detectDataTypes(values: any[]): Record<string, string> {
  if (!values.length) return {};
  
  const sampleRow = values[0];
  const types: Record<string, string> = {};
  
  Object.entries(sampleRow).forEach(([field, value]) => {
    if (typeof value === 'number') {
      types[field] = 'quantitative';
    } else if (value instanceof Date || !isNaN(Date.parse(value as string))) {
      types[field] = 'temporal';
    } else if (typeof value === 'string') {
      const isNumeric = !isNaN(Number(value));
      types[field] = isNumeric ? 'ordinal' : 'nominal';
    }
  });
  
  return types;
}

export function inferChartType(dataTypes: Record<string, string>): MarkType[] {
  const types = new Set(Object.values(dataTypes));
  const charts: MarkType[] = [];
  
  if (types.has('quantitative')) {
    charts.push('bar', 'line', 'point', 'area', 'heatmap');
  }
  if (types.has('temporal')) {
    charts.push('line', 'area', 'point');
  }
  if (types.has('nominal') || types.has('ordinal')) {
    charts.push('bar', 'point');
  }
  
  return charts;
}

export function determineDatasetType(dataTypes: Record<string, string>): DatasetMetadata['type'] {
  const types = new Set(Object.values(dataTypes));
  
  if (types.has('temporal')) return 'temporal';
  if (types.has('quantitative')) return 'numerical';
  return 'categorical';
}

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