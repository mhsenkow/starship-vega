export type ChartCategory = 
  | 'Statistical' 
  | 'Time Series' 
  | 'Comparison' 
  | 'Distribution' 
  | 'Correlation' 
  | 'Part-to-Whole'
  | 'Hierarchical'

export type ChartUseCase = 
  | 'Data Analysis' 
  | 'Business Reporting' 
  | 'Scientific Visualization' 
  | 'Dashboard'

export type Complexity = 'Beginner' | 'Intermediate' | 'Advanced'

export interface ChartConfig {
  id: string
  title: string
  description: string
  category: ChartCategory
  useCase: ChartUseCase[]
  complexity: Complexity
  dataTypes: ('numerical' | 'categorical' | 'temporal')[]
  spec: TopLevelSpec
  keywords: string[]
  thumbnail?: string;
}
