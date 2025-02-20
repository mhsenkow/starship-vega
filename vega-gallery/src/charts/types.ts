import { TopLevelSpec } from 'vega-lite'
import { ChartCategory, ComplexityLevel } from '../types/chart'

export interface ChartSpec {
  id: string;
  title: string;
  description: string;
  category: ChartCategory;
  complexity: ComplexityLevel;
  spec: TopLevelSpec;
  metadata?: {
    tags: string[];
    dataRequirements: {
      minDataPoints?: number;
      requiredFields: string[];
    };
  };
}
