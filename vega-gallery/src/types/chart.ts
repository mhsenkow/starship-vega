import { TopLevelSpec } from 'vega-lite';

export type ChartCategory = 
  | 'Statistical' 
  | 'Time Series'
  | 'Comparison' 
  | 'Correlation' 
  | 'Part-to-Whole'
  | 'Hierarchical'
  | 'Text Analysis';

export type ChartUseCase = 
  | 'Data Analysis' 
  | 'Business Reporting' 
  | 'Scientific Visualization' 
  | 'Dashboard'

export type Complexity = 'Beginner' | 'Intermediate' | 'Advanced'

export interface ChartConfig {
  id: string;
  title: string;
  description: string;
  category: ChartCategory;
  complexity: Complexity;
  spec: TopLevelSpec;
  metadata?: {
    recommended?: boolean;
    tags?: string[];
    useCase?: string[];
    dataTypes?: string[];
    keywords?: string[];
    dataRequirements?: {
      minDataPoints?: number;
      requiredFields: string[];
    };
  };
}
