/**
 * Core chart type definitions and configurations
 * - Defines chart categories, complexity levels
 * - Defines chart configuration interfaces
 * - Defines chart styling interfaces
 * Used by: GalleryGrid, ChartCard, StyleEditor
 */

import { TopLevelSpec } from 'vega-lite';

export enum ChartCategory {
  Statistical = 'Statistical',
  TimeSeries = 'Time Series',
  Hierarchical = 'Hierarchical',
  Correlation = 'Correlation',
  PartToWhole = 'Part to Whole'
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
  spec: any;
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
