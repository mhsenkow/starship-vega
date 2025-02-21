/**
 * Core Vega-Lite type definitions
 * - Defines chart mark types and their encodings
 * - Handles type compatibility with Vega-Lite
 * Used by: VisualEditor, chartAdapters
 */

import { TopLevelSpec, Mark } from 'vega-lite'
import { DatasetMetadata } from './dataset'

export type EncodingChannel = 
  | 'x' 
  | 'y' 
  | 'color' 
  | 'size' 
  | 'shape' 
  | 'text' 
  | 'tooltip' 
  | 'order'
  | 'strokeWidth'
  | 'xOffset'
  | 'yOffset';

export type MarkType = 
  | 'bar' 
  | 'line' 
  | 'area' 
  | 'point' 
  | 'circle' 
  | 'square'
  | 'rect' 
  | 'rule' 
  | 'text' 
  | 'tick'
  | 'arc'
  | 'boxplot'
  | 'trail';

export interface EncodingUpdate {
  field?: string
  type?: 'quantitative' | 'nominal' | 'ordinal' | 'temporal'
}

export interface VisualEditorUpdate {
  mark?: MarkType
  encoding?: Partial<Record<EncodingChannel, EncodingUpdate>>
}

export interface DatasetSelectorBaseProps {
  chartId: string;
  currentDataset: string;
  onSelect: (datasetId: string) => void;
  customDatasets?: Record<string, DatasetMetadata>;
  setCustomDatasets?: (datasets: Record<string, DatasetMetadata>) => void;
}

export interface EncodingField {
  field: string;
  type: 'quantitative' | 'nominal' | 'ordinal' | 'temporal';
  scale?: {
    domain?: any[];
    range?: any[];
    scheme?: string;
  };
  sort?: 'ascending' | 'descending' | null;
  aggregate?: 'count' | 'sum' | 'mean' | 'median';
}

export type ChartEncoding = Partial<Record<EncodingChannel, EncodingField>>;

export interface MarkConfig {
  type: MarkType;
  point?: boolean;
  tooltip?: boolean;
  interpolate?: 'linear' | 'step' | 'monotone';
  clip?: boolean;
  filled?: boolean;
}

export interface ChartSpec extends TopLevelSpec {
  mark: MarkType | MarkConfig;
  encoding?: Partial<Record<EncodingChannel, EncodingField>>;
  data?: {
    values: any[];
  };
  width?: 'container' | number;
  height?: 'container' | number;
  autosize?: {
    type: 'fit' | 'fill' | 'fit-x' | 'fit-y' | 'none';
    contains?: 'padding' | 'content';
    resize?: boolean;
  };
}

export interface ChartPresetConfig {
  chartType: 'bar' | 'line' | 'scatter' | 'pie' | 'area';
  dataType: 'categorical' | 'numeric' | 'temporal';
  aggregation: 'count' | 'sum' | 'average' | 'percentage' | 'none';
}

export type { TopLevelSpec }; 