import { MarkType } from '../types/vega';
import { DatasetMetadata } from '../types/dataset';

export const detectDataTypes = (data: any[]): Record<string, string> => {
  if (!data || data.length === 0) return {};
  
  const firstRow = data[0];
  const columns = Object.keys(firstRow);
  
  return columns.reduce((types, col) => {
    // Get a sample of values for this column
    const sampleValues = data
      .slice(0, 100)  // Take first 100 rows as sample
      .map(row => row[col])
      .filter(val => val != null);  // Remove null/undefined

    if (sampleValues.length === 0) {
      types[col] = 'nominal';
      return types;
    }

    // Check if all values are numbers
    const isNumeric = sampleValues.every(val => 
      typeof val === 'number' || 
      (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '')
    );
    if (isNumeric) {
      types[col] = 'quantitative';
      return types;
    }

    // Check if all values are dates
    const isDate = sampleValues.every(val => !isNaN(Date.parse(String(val))));
    if (isDate) {
      types[col] = 'temporal';
      return types;
    }

    // Check if it could be ordinal (limited unique values)
    const uniqueValues = new Set(sampleValues);
    if (uniqueValues.size <= 20) {
      types[col] = 'ordinal';
      return types;
    }

    // Default to nominal
    types[col] = 'nominal';
    return types;
  }, {} as Record<string, string>);
};

// Helper function to detect a single column type
export const detectColumnType = (values: any[]): string => {
  const cleanValues = values.filter(v => v != null);
  if (cleanValues.length === 0) return 'nominal';

  // Check if all values are numbers
  const isNumeric = cleanValues.every(val => 
    typeof val === 'number' || 
    (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '')
  );
  if (isNumeric) return 'quantitative';

  // Check if all values are dates
  const isDate = cleanValues.every(val => !isNaN(Date.parse(String(val))));
  if (isDate) return 'temporal';

  // Check if it could be ordinal
  const uniqueValues = new Set(cleanValues);
  if (uniqueValues.size <= 20) return 'ordinal';

  // Default to nominal
  return 'nominal';
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

export const cleanData = (data: any[]): any[] => {
  return data.map(row => {
    const cleaned = { ...row };
    Object.entries(cleaned).forEach(([key, value]) => {
      // Try to parse dates
      if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        cleaned[key] = new Date(value);
      }
      // Clean numbers
      if (typeof value === 'string' && !isNaN(Number(value))) {
        cleaned[key] = Number(value);
      }
      // Handle nulls
      if (value === '' || value === null || value === undefined) {
        cleaned[key] = null;
      }
    });
    return cleaned;
  });
};

export const inferDataTypes = (data: any[]): Record<string, string[]> => {
  if (!data.length) return {};
  
  const types: Record<string, Set<string>> = {};
  const fields = Object.keys(data[0]);

  fields.forEach(field => {
    types[field] = new Set();
    data.forEach(row => {
      const value = row[field];
      if (typeof value === 'number') types[field].add('quantitative');
      if (value instanceof Date) types[field].add('temporal');
      if (typeof value === 'string') {
        if (!isNaN(Date.parse(value))) types[field].add('temporal');
        else if (!isNaN(Number(value))) types[field].add('quantitative');
        else types[field].add('nominal');
      }
    });
  });

  return Object.fromEntries(
    Object.entries(types).map(([field, typeSet]) => [field, Array.from(typeSet)])
  );
}; 