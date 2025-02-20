import { TopLevelSpec } from 'vega-lite';

export enum ChartCategory {
  Correlation = 'correlation',
  Hierarchical = 'hierarchical',
  TimeSeries = 'timeSeries'
}

export enum Complexity {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}

export type ChartUseCase = 
  | 'Data Analysis' 
  | 'Business Reporting' 
  | 'Scientific Visualization' 
  | 'Dashboard'

export interface ChartStyle {
  axis?: {
    tickOpacity?: number;
    baselineColor?: string;
    baselineWidth?: number;
    baselineOpacity?: number;
  };
  view?: {
    backgroundColor?: string;
    backgroundOpacity?: number;
    padding?: number;
  };
  legend?: {
    titleFontSize?: number;
    labelFontSize?: number;
  };
}

export interface ChartConfig {
  id: string;
  title: string;
  description: string;
  category: ChartCategory;
  complexity: Complexity;
  spec: any; // Could be more specific with Vega types
  metadata?: {
    tags?: string[];
    dataRequirements?: {
      requiredFields: string[];
    };
    useCase?: string[];
    dataTypes?: string[];
    keywords?: string[];
  };
  style?: Partial<ChartStyle>;
}

export interface ChartMetadata {
  id: string;
  title: string;
  category: ChartCategory;
  description: string;
  tags: string[];
  thumbnail?: string;
}

export interface ChartDefinition extends ChartMetadata {
  spec: any; // Vega-Lite specification
  data?: any; // Optional data if not embedded in spec
}
