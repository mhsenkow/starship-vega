/**
 * Chart specification transformation utilities
 * - Converts between different chart formats
 * - Generates random encodings for exploration
 * - Handles chart type compatibility
 * Used by: VisualEditor, GalleryGrid
 */

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

function generateRandomEncoding(availableFields: string[]): VegaChartEncoding {
  const channels = ['x', 'y', 'color', 'size', 'shape', 'strokeWidth'];
  const newEncoding: VegaChartEncoding = {};
  let remainingFields = [...availableFields];

  // Helper function to get random array element
  const randomChoice = <T>(arr: readonly T[]): T => 
    arr[Math.floor(Math.random() * arr.length)];

  // Helper function to generate random encoding field
  const generateEncodingField = (channel: string, field: string): EncodingField => {
    const baseEncoding: EncodingField = {
      field,
      type: getRandomType(channel)
    };

    // Random chance to add various encoding properties
    if (Math.random() > 0.5) {
      baseEncoding.aggregate = randomChoice(aggregateMethods);
    }

    if (Math.random() > 0.6) {
      baseEncoding.scale = {
        zero: Math.random() > 0.5,
        type: randomChoice(scaleTypes)
      };

      // Add range for size and strokeWidth
      if (channel === 'size') {
        baseEncoding.scale.range = [50, 1000];
      } else if (channel === 'strokeWidth') {
        baseEncoding.scale.range = [0.5, 4];
      }
    }

    if (Math.random() > 0.7) {
      baseEncoding.sort = Math.random() > 0.5 ? 'ascending' : 'descending';
    }

    if (channel === 'x' || channel === 'y') {
      if (Math.random() > 0.8) {
        baseEncoding.stack = randomChoice(stackTypes);
      }
      
      if (Math.random() > 0.8) {
        baseEncoding.bin = Math.random() > 0.5 ? true : {
          maxbins: Math.floor(Math.random() * 20) + 10
        };
      }
    }

    if (Math.random() > 0.7) {
      baseEncoding.timeUnit = randomChoice(timeUnits);
    }

    return baseEncoding;
  };

  // Helper function to determine type based on channel
  const getRandomType = (channel: string): string => {
    switch (channel) {
      case 'color':
      case 'shape':
        return Math.random() > 0.5 ? 'nominal' : 'ordinal';
      case 'size':
      case 'strokeWidth':
        return 'quantitative';
      default:
        return Math.random() > 0.7 ? 'nominal' : 'quantitative';
    }
  };

  // Assign channels
  channels.forEach(channel => {
    if (Math.random() > 0.3 && remainingFields.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingFields.length);
      const field = remainingFields[randomIndex];
      newEncoding[channel] = generateEncodingField(channel, field);
      remainingFields = remainingFields.filter(f => f !== field);
    }
  });

  // Ensure at least x or y is assigned
  if (!newEncoding.x && !newEncoding.y && remainingFields.length > 0) {
    const channel = Math.random() > 0.5 ? 'x' : 'y';
    const randomIndex = Math.floor(Math.random() * remainingFields.length);
    newEncoding[channel] = generateEncodingField(channel, remainingFields[randomIndex]);
  }

  // Add tooltips
  const tooltipFields = availableFields
    .slice(0, Math.min(4, availableFields.length))
    .map(field => ({
      field,
      type: Math.random() > 0.5 ? 'quantitative' : 'nominal',
      format: '.2f'
    }));

  if (tooltipFields.length > 0) {
    newEncoding.tooltip = tooltipFields;
  }

  // Add order for temporal data
  if (Math.random() > 0.7 && remainingFields.length > 0) {
    newEncoding.order = generateEncodingField('order', remainingFields[0]);
  }

  return newEncoding;
}

export { generateRandomEncoding };

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