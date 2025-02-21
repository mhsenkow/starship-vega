/**
 * Smart data analysis and visualization suggestions
 * - Analyzes data structure and relationships
 * - Suggests appropriate visualizations
 * - Provides automatic encodings
 */

import { MarkType, EncodingChannel, EncodingField } from '../types/vega';

interface DataField {
  name: string;
  type: 'quantitative' | 'temporal' | 'nominal' | 'ordinal';
  uniqueValues: number;
  min?: number;
  max?: number;
  distribution?: 'normal' | 'uniform' | 'skewed';
}

interface VisualizationSuggestion {
  markType: MarkType;
  encodings: Record<EncodingChannel, EncodingField>;
  score: number; // How well this visualization fits the data
  reason: string; // Why this visualization was suggested
}

// Add missing utility functions
function detectFieldType(values: any[]): { 
  type: 'quantitative' | 'temporal' | 'nominal' | 'ordinal';
  min?: number;
  max?: number;
} {
  const sampleValue = values.find(v => v !== null && v !== undefined);
  
  if (typeof sampleValue === 'number') {
    const numbers = values.filter(v => typeof v === 'number');
    return {
      type: 'quantitative',
      min: Math.min(...numbers),
      max: Math.max(...numbers)
    };
  }
  
  if (sampleValue instanceof Date || !isNaN(Date.parse(sampleValue))) {
    return { type: 'temporal' };
  }
  
  const uniqueValues = new Set(values).size;
  if (typeof sampleValue === 'string' && uniqueValues < values.length * 0.2) {
    return { type: 'ordinal' };
  }
  
  return { type: 'nominal' };
}

function analyzeDistribution(values: any[]): { distribution?: 'normal' | 'uniform' | 'skewed' } {
  if (typeof values[0] !== 'number') return {};
  
  const numbers = values.filter(v => typeof v === 'number');
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  const skewness = numbers.reduce((a, b) => a + Math.pow(b - mean, 3), 0) / (numbers.length * Math.pow(variance, 1.5));
  
  if (Math.abs(skewness) < 0.5) return { distribution: 'normal' };
  if (Math.abs(skewness) < 1) return { distribution: 'uniform' };
  return { distribution: 'skewed' };
}

function findRelationships(fields: DataField[], data: any[]): {
  correlations: Array<{ field1: string; field2: string; strength: number }>;
  dependencies: Array<{ independent: string; dependent: string }>;
} {
  const correlations = [];
  const dependencies = [];
  
  // Find correlations between quantitative fields
  const quantFields = fields.filter(f => f.type === 'quantitative');
  for (let i = 0; i < quantFields.length; i++) {
    for (let j = i + 1; j < quantFields.length; j++) {
      const field1 = quantFields[i].name;
      const field2 = quantFields[j].name;
      const correlation = calculateCorrelation(data, field1, field2);
      if (Math.abs(correlation) > 0.5) {
        correlations.push({ field1, field2, strength: correlation });
      }
    }
  }
  
  return { correlations, dependencies };
}

function calculateCorrelation(data: any[], field1: string, field2: string): number {
  const values1 = data.map(d => d[field1]);
  const values2 = data.map(d => d[field2]);
  
  const mean1 = values1.reduce((a, b) => a + b, 0) / values1.length;
  const mean2 = values2.reduce((a, b) => a + b, 0) / values2.length;
  
  const variance1 = values1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
  const variance2 = values2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);
  
  const covariance = values1.reduce((a, b, i) => a + (b - mean1) * (values2[i] - mean2), 0);
  
  return covariance / Math.sqrt(variance1 * variance2);
}

// Add missing check functions
function hasTimeSeries(fields: DataField[]): boolean {
  return fields.some(f => f.type === 'temporal') &&
         fields.some(f => f.type === 'quantitative');
}

function hasCategoricalComparison(fields: DataField[]): boolean {
  return fields.some(f => f.type === 'nominal' || f.type === 'ordinal') &&
         fields.some(f => f.type === 'quantitative');
}

function hasCorrelation(fields: DataField[]): boolean {
  return fields.filter(f => f.type === 'quantitative').length >= 2;
}

function hasPartToWhole(fields: DataField[]): boolean {
  const hasCategories = fields.some(f => f.type === 'nominal' || f.type === 'ordinal');
  const hasValues = fields.some(f => f.type === 'quantitative');
  return hasCategories && hasValues;
}

// Add missing visualization creation functions
function createComparisonViz(fields: DataField[]): VisualizationSuggestion {
  const categoryField = fields.find(f => f.type === 'nominal' || f.type === 'ordinal');
  const valueField = fields.find(f => f.type === 'quantitative');
  
  return {
    markType: 'bar',
    encodings: {
      x: { field: categoryField.name, type: 'nominal' },
      y: { field: valueField.name, type: 'quantitative' }
    },
    score: 0.8,
    reason: 'Comparing values across categories'
  };
}

function createCorrelationViz(fields: DataField[]): VisualizationSuggestion {
  const quantFields = fields.filter(f => f.type === 'quantitative');
  
  return {
    markType: 'point',
    encodings: {
      x: { field: quantFields[0].name, type: 'quantitative' },
      y: { field: quantFields[1].name, type: 'quantitative' }
    },
    score: 0.7,
    reason: 'Exploring relationship between numeric variables'
  };
}

function createPartToWholeViz(fields: DataField[]): VisualizationSuggestion {
  const categoryField = fields.find(f => f.type === 'nominal' || f.type === 'ordinal');
  const valueField = fields.find(f => f.type === 'quantitative');
  
  return {
    markType: 'arc',
    encodings: {
      theta: { field: valueField.name, type: 'quantitative' },
      color: { field: categoryField.name, type: 'nominal' }
    },
    score: 0.6,
    reason: 'Showing parts of a whole'
  };
}

// Export the main analysis function
export function analyzeDataset(data: any[]): {
  fields: DataField[];
  suggestions: VisualizationSuggestion[];
} {
  if (!data.length) return { fields: [], suggestions: [] };

  // Analyze each field
  const fields = analyzeFields(data);
  
  // Generate visualization suggestions
  const suggestions = suggestVisualizations(fields, data);

  return { fields, suggestions };
}

function analyzeFields(data: any[]): DataField[] {
  const sampleRow = data[0];
  return Object.keys(sampleRow).map(fieldName => {
    const values = data.map(row => row[fieldName]);
    const uniqueValues = new Set(values).size;
    
    // Determine field type and characteristics
    const fieldInfo = {
      name: fieldName,
      uniqueValues,
      ...detectFieldType(values),
      ...analyzeDistribution(values)
    };

    return fieldInfo;
  });
}

function suggestVisualizations(fields: DataField[], data: any[]): VisualizationSuggestion[] {
  const suggestions: VisualizationSuggestion[] = [];

  // Find relationships between fields
  const relationships = findRelationships(fields, data);

  // Suggest based on data characteristics
  if (hasTimeSeries(fields)) {
    suggestions.push(createTimeSeriesViz(fields));
  }

  if (hasCategoricalComparison(fields)) {
    suggestions.push(createComparisonViz(fields));
  }

  if (hasCorrelation(fields)) {
    suggestions.push(createCorrelationViz(fields));
  }

  if (hasPartToWhole(fields)) {
    suggestions.push(createPartToWholeViz(fields));
  }

  // Sort by score
  return suggestions.sort((a, b) => b.score - a.score);
}

function createTimeSeriesViz(fields: DataField[]): VisualizationSuggestion {
  const timeField = fields.find(f => f.type === 'temporal');
  const valueField = fields.find(f => f.type === 'quantitative');
  const categoryField = fields.find(f => f.type === 'nominal' && f.uniqueValues < 10);

  return {
    markType: 'line',
    encodings: {
      x: { field: timeField.name, type: 'temporal' },
      y: { field: valueField.name, type: 'quantitative' },
      ...(categoryField && { color: { field: categoryField.name, type: 'nominal' } })
    },
    score: 0.9,
    reason: 'Time-based data with continuous values'
  };
}

// Similar functions for other visualization types... 