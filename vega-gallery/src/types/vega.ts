import { TopLevelSpec } from 'vega-lite'
import { DatasetMetadata } from './dataset'

export type EncodingChannel = 'x' | 'y' | 'color' | 'size' | 'theta' | 'radius' | 'tooltip' | 'order' | 'text' | 'shape' | 'strokeWidth'
export type MarkType = 
  | 'bar' | 'line' | 'point' | 'arc' | 'area' | 'boxplot' 
  | 'rect' | 'rule' | 'text' | 'tick' | 'trail' | 'square'
  | 'circle' | 'sunburst' | 'treemap' | 'force-directed' 
  | 'chord-diagram' | 'violin' | 'wordcloud'

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
  type?: string;
  aggregate?: 'count' | 'sum' | 'mean' | 'median' | 'min' | 'max';
  scale?: {
    zero?: boolean;
    range?: number[];
    type?: 'linear' | 'log' | 'pow' | 'sqrt';
  };
  sort?: 'ascending' | 'descending' | null;
  stack?: 'zero' | 'normalize' | 'center' | null;
  bin?: boolean | {maxbins?: number};
  timeUnit?: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
  format?: string;
}

export interface ChartEncoding {
  x?: EncodingField;
  y?: EncodingField;
  color?: EncodingField;
  size?: EncodingField;
  shape?: EncodingField;
  strokeWidth?: EncodingField;
  tooltip?: EncodingField | EncodingField[];
  order?: EncodingField;
  [key: string]: EncodingField | EncodingField[] | undefined;
} 