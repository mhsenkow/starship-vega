export interface ChartConfig {
  id: string;
  title: string;
  description: string;
  category: ChartCategory;
  complexity: ComplexityLevel;
  spec: any; // Vega-Lite specification
  thumbnail?: string;
}

export type ChartCategory = 
  | 'Statistical'
  | 'Time Series'
  | 'Hierarchical'
  | 'Geographic'
  | 'Other';

export type ComplexityLevel = 
  | 'Beginner'
  | 'Intermediate'
  | 'Advanced';
