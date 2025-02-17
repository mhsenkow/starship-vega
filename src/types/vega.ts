import { TopLevelSpec } from 'vega-lite'

export type EncodingChannel = 'x' | 'y' | 'color' | 'size' | 'theta' | 'tooltip'
export type MarkType = 'bar' | 'line' | 'point' | 'area' | 'circle' | 'arc'

export interface EncodingUpdate {
  field?: string
  type?: 'quantitative' | 'nominal' | 'ordinal' | 'temporal'
}

export interface VisualEditorUpdate {
  mark?: MarkType
  encoding?: Partial<Record<EncodingChannel, EncodingUpdate>>
} 