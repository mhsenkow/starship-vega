import { MarkType, ChartEncoding } from '../types/vega';
import { DatasetMetadata } from '../types/dataset';
import { detectDataTypes } from './dataUtils';
import type { ChartEncoding as VegaChartEncoding, EncodingField } from '../types/vega';

interface EncodingConfig {
  x?: { field: string; type: string };
  y?: { field: string; type: string };
  color?: { field: string; type: string };
  size?: { field: string; type: string };
  theta?: { field: string; type: string };
  radius?: { field: string; type: string };
  text?: { field: string; type: string };
}

interface EncodingOption {
  field: string;
  type: string;
  description?: string;
}

interface EncodingOptions {
  x: EncodingOption[];
  y: EncodingOption[];
  color: EncodingOption[];
  size: EncodingOption[];
  theta: EncodingOption[];
  radius: EncodingOption[];
  text: EncodingOption[];
}

export const determineChartEncodings = (
  chartType: MarkType,
  dataset: DatasetMetadata
): EncodingConfig => {
  const dataTypes = detectDataTypes(dataset.values);
  const fields = Object.entries(dataTypes);
  
  // Find fields by type
  const quantitativeFields = fields.filter(([_, type]) => type === 'quantitative').map(([field]) => field);
  const temporalFields = fields.filter(([_, type]) => type === 'temporal').map(([field]) => field);
  const categoricalFields = fields.filter(([_, type]) => ['nominal', 'ordinal'].includes(type)).map(([field]) => field);
  
  switch (chartType) {
    case 'bar':
      return {
        x: categoricalFields.length ? 
          { field: categoricalFields[0], type: 'nominal' } :
          { field: temporalFields[0], type: 'temporal' },
        y: { field: quantitativeFields[0], type: 'quantitative' },
        color: categoricalFields.length > 1 ? 
          { field: categoricalFields[1], type: 'nominal' } : undefined
      };

    case 'line':
      return {
        x: temporalFields.length ? 
          { field: temporalFields[0], type: 'temporal' } :
          { field: quantitativeFields[0], type: 'quantitative' },
        y: { field: quantitativeFields[temporalFields.length ? 0 : 1], type: 'quantitative' },
        color: categoricalFields.length ? 
          { field: categoricalFields[0], type: 'nominal' } : undefined
      };

    case 'point':
      return {
        x: quantitativeFields[0] ? 
          { field: quantitativeFields[0], type: 'quantitative' } :
          { field: categoricalFields[0], type: 'nominal' },
        y: quantitativeFields[1] ? 
          { field: quantitativeFields[1], type: 'quantitative' } :
          { field: quantitativeFields[0], type: 'quantitative' },
        size: quantitativeFields[2] ? 
          { field: quantitativeFields[2], type: 'quantitative' } : undefined,
        color: categoricalFields.length ? 
          { field: categoricalFields[0], type: 'nominal' } : undefined
      };

    case 'arc':
      return {
        theta: { field: quantitativeFields[0], type: 'quantitative' },
        color: { field: categoricalFields[0], type: 'nominal' }
      };

    case 'boxplot':
      return {
        x: { field: categoricalFields[0], type: 'nominal' },
        y: { field: quantitativeFields[0], type: 'quantitative' },
        color: categoricalFields.length > 1 ? 
          { field: categoricalFields[1], type: 'nominal' } : undefined
      };

    case 'area':
      return {
        x: temporalFields.length ? 
          { field: temporalFields[0], type: 'temporal' } :
          { field: quantitativeFields[0], type: 'quantitative' },
        y: { field: quantitativeFields[temporalFields.length ? 0 : 1], type: 'quantitative' },
        color: categoricalFields.length ? 
          { field: categoricalFields[0], type: 'nominal' } : undefined
      };

    case 'text':
      return {
        x: quantitativeFields[0] ? 
          { field: quantitativeFields[0], type: 'quantitative' } :
          { field: categoricalFields[0], type: 'nominal' },
        y: quantitativeFields[1] ? 
          { field: quantitativeFields[1], type: 'quantitative' } :
          { field: categoricalFields[1] || categoricalFields[0], type: 'nominal' },
        text: { field: fields.find(([key]) => key.includes('text') || key.includes('label'))?.[0] || categoricalFields[0], type: 'nominal' }
      };

    case 'wordcloud':
      return {
        text: { field: fields.find(([key]) => key.includes('text') || key.includes('word'))?.[0] || categoricalFields[0], type: 'nominal' },
        size: { field: fields.find(([key]) => key.includes('size') || key.includes('value'))?.[0] || quantitativeFields[0], type: 'quantitative' }
      };

    // Add more chart types as needed...

    default:
      return {};
  }
};

export const getCompatibleEncodings = (
  chartType: MarkType,
  dataset: DatasetMetadata
): EncodingOptions => {
  const dataTypes = detectDataTypes(dataset.values);
  const fields = Object.entries(dataTypes);
  
  // Group fields by type with descriptions
  const quantitativeFields = fields
    .filter(([_, type]) => type === 'quantitative')
    .map(([field]) => ({
      field,
      type: 'quantitative',
      description: `Numeric values for ${field}`
    }));

  const temporalFields = fields
    .filter(([_, type]) => type === 'temporal')
    .map(([field]) => ({
      field,
      type: 'temporal',
      description: `Time series data for ${field}`
    }));

  const categoricalFields = fields
    .filter(([_, type]) => ['nominal', 'ordinal'].includes(type))
    .map(([field]) => ({
      field,
      type: 'nominal',
      description: `Categories in ${field}`
    }));

  // Define compatible encodings for each channel based on chart type
  switch (chartType) {
    case 'bar':
      return {
        x: [...categoricalFields, ...temporalFields],
        y: quantitativeFields,
        color: categoricalFields,
        size: [],
        theta: [],
        radius: [],
        text: quantitativeFields
      };

    case 'point':
      return {
        x: [...quantitativeFields, ...temporalFields],
        y: quantitativeFields,
        color: [...categoricalFields, ...quantitativeFields],
        size: quantitativeFields,
        theta: [],
        radius: [],
        text: []
      };

    // Add more chart types...
    
    default:
      return {
        x: [],
        y: [],
        color: [],
        size: [],
        theta: [],
        radius: [],
        text: []
      };
  }
};

const aggregateMethods = ['sum', 'mean', 'median', 'min', 'max'] as const;
const timeUnits = ['year', 'month', 'day', 'hour', 'minute'] as const;
const scaleTypes = ['linear', 'log', 'sqrt', 'pow'] as const;
const stackTypes = ['zero', 'normalize', 'center', null] as const;

// Add these helper functions at the top
const analyzeField = (field: string, values: any[]) => {
  const uniqueValues = new Set(values.map(v => v[field])).size;
  const isNumeric = values.every(v => !isNaN(Number(v[field])));
  const isTemporal = values.some(v => !isNaN(Date.parse(v[field])));
  const uniqueRatio = uniqueValues / values.length;

  return {
    uniqueValues,
    uniqueRatio,
    isNumeric,
    isTemporal,
    cardinality: uniqueValues
  };
};

const getBestEncodingForField = (
  field: string, 
  values: any[], 
  usedEncodings: Set<string>
): { channel: string; encoding: EncodingField } | null => {
  const analysis = analyzeField(field, values);
  
  // Prioritize encodings based on data characteristics
  const possibilities: Array<{
    channel: string;
    score: number;
    encoding: EncodingField;
  }> = [];

  // X-axis possibilities
  if (!usedEncodings.has('x')) {
    if (analysis.isTemporal) {
      possibilities.push({
        channel: 'x',
        score: 0.9,
        encoding: {
          field,
          type: 'temporal',
          scale: { type: 'time' }
        }
      });
    } else if (analysis.isNumeric) {
      possibilities.push({
        channel: 'x',
        score: 0.8,
        encoding: {
          field,
          type: 'quantitative',
          scale: { zero: true }
        }
      });
    }
  }

  // Y-axis possibilities
  if (!usedEncodings.has('y')) {
    if (analysis.isNumeric) {
      possibilities.push({
        channel: 'y',
        score: 0.9,
        encoding: {
          field,
          type: 'quantitative',
          scale: { zero: true }
        }
      });
    }
  }

  // Color encoding for categorical data
  if (!usedEncodings.has('color') && analysis.uniqueRatio < 0.3) {
    possibilities.push({
      channel: 'color',
      score: 0.7,
      encoding: {
        field,
        type: 'nominal'
      }
    });
  }

  // Size encoding for numeric data
  if (!usedEncodings.has('size') && analysis.isNumeric) {
    possibilities.push({
      channel: 'size',
      score: 0.6,
      encoding: {
        field,
        type: 'quantitative',
        scale: { range: [50, 300] }
      }
    });
  }

  // Shape encoding for low-cardinality categorical data
  if (!usedEncodings.has('shape') && analysis.uniqueValues <= 6) {
    possibilities.push({
      channel: 'shape',
      score: 0.5,
      encoding: {
        field,
        type: 'nominal'
      }
    });
  }

  // Sort by score and add some randomness
  possibilities.sort((a, b) => b.score - a.score);
  const randomIndex = Math.floor(Math.random() * Math.min(3, possibilities.length));
  const selected = possibilities[randomIndex];

  return selected ? { channel: selected.channel, encoding: selected.encoding } : null;
};

export const generateRandomEncoding = (fields: string[], values: any[]): ChartEncoding => {
  const encoding: ChartEncoding = {};
  const usedFields = new Set<string>();

  // Shuffle fields for randomness
  const shuffledFields = [...fields].sort(() => Math.random() - 0.5);

  // Always try to assign x and y first
  const xField = shuffledFields.find(field => !usedFields.has(field));
  if (xField) {
    encoding.x = {
      field: xField,
      type: getAppropriateType('x', xField, values)
    };
    usedFields.add(xField);
  }

  const yField = shuffledFields.find(field => !usedFields.has(field));
  if (yField) {
    encoding.y = {
      field: yField,
      type: getAppropriateType('y', yField, values)
    };
    usedFields.add(yField);
  }

  // Try to add color encoding if we have more fields
  const colorField = shuffledFields.find(field => !usedFields.has(field));
  if (colorField) {
    encoding.color = {
      field: colorField,
      type: getAppropriateType('color', colorField, values)
    };
    usedFields.add(colorField);
  }

  // Add tooltip with remaining fields
  encoding.tooltip = shuffledFields
    .slice(0, Math.min(4, shuffledFields.length))
    .map(field => ({
      field,
      type: getAppropriateType('tooltip', field, values)
    }));

  return encoding;
};

// Helper function to determine appropriate encoding type
const getAppropriateType = (channel: string, field: string, values: any[]): string => {
  const isNumeric = values.every(v => !isNaN(Number(v[field])));
  const isDate = values.some(v => !isNaN(Date.parse(v[field])));
  const uniqueValues = new Set(values.map(v => v[field])).size;
  const uniqueRatio = uniqueValues / values.length;

  if (channel === 'y' && isNumeric) return 'quantitative';
  if (channel === 'x' && isDate) return 'temporal';
  if (channel === 'x' && isNumeric && uniqueRatio > 0.7) return 'quantitative';
  if (channel === 'color' && uniqueRatio < 0.3) return 'nominal';
  if (isNumeric && uniqueRatio > 0.7) return 'quantitative';
  if (isDate) return 'temporal';
  return 'nominal';
};

// Helper function for random choice
const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Add TypeScript interface for better type safety
export interface ChartEncoding {
  [key: string]: {
    field: string;
    type: string;
    scale?: {
      zero?: boolean;
      range?: number[];
    };
    format?: string;
  } | Array<{
    field: string;
    type: string;
    format?: string;
  }>;
} 