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
  marks?: {
    opacity?: number;
    strokeWidth?: number;
    stroke?: string;
    fill?: string;
    filled?: boolean;
    [key: string]: any;
  };
  axis?: {
    tickOpacity?: number;
    gridOpacity?: number;
    labelFontSize?: number;
    titleFontSize?: number;
    [key: string]: any;
  };
  legend?: {
    titleFontSize?: number;
    labelFontSize?: number;
    [key: string]: any;
  };
  view?: {
    stroke?: string | null;
    fill?: string;
    padding?: number;
    [key: string]: any;
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
