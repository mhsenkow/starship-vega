import { TopLevelSpec } from 'vega-lite';
import { MarkType } from '../../types/vega';

export interface EditorState {
  spec: TopLevelSpec;
  currentType: MarkType;
  currentDataset: string;
}

export interface EditorProps {
  initialSpec: TopLevelSpec;
  onSpecChange: (spec: TopLevelSpec) => void;
  mode?: 'visual' | 'style' | 'code';
}

export interface PreviewProps {
  spec: TopLevelSpec;
  width?: number;
  height?: number;
  mode?: 'gallery' | 'editor';
  showDataTable?: boolean;
} 