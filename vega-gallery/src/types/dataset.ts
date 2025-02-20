export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  values: any[];
  dataTypes?: Record<string, string>;
  source?: 'custom' | 'sample';
  uploadDate?: Date;
} 