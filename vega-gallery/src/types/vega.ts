import { TopLevelSpec } from 'vega-lite'

export type EncodingChannel = 'x' | 'y' | 'color' | 'size' | 'theta' | 'radius' | 'tooltip' | 'order' | 'text' | 'shape' | 'strokeWidth'
export type MarkType = 'bar' | 'line' | 'point' | 'area' | 'circle' | 'arc' | 'boxplot' | 'rect' | 'rule' | 'text' | 'tick' | 'trail' | 'square'

export interface EncodingUpdate {
  field?: string
  type?: 'quantitative' | 'nominal' | 'ordinal' | 'temporal'
}

export interface VisualEditorUpdate {
  mark?: MarkType
  encoding?: Partial<Record<EncodingChannel, EncodingUpdate>>
}

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  type: 'categorical' | 'temporal' | 'numerical' | 'hierarchical';
  compatibleCharts: Array<'bar' | 'line' | 'point' | 'arc' | 'area' | 'boxplot' | 'rect' | 'rule' | 'text' | 'tick' | 'trail' | 'square'>;
  values: any[];
} 