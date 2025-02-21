import { MarkType } from './vega';

/**
 * Dataset type definitions
 * - Defines dataset metadata structure
 * - Defines dataset compatibility interfaces
 * - Handles dataset selector props
 * Used by: DatasetSelector, sampleData, dataUtils
 */

export interface DatasetSelectorBaseProps {
  chartId: string;
  currentDataset: string;
  onSelect: (datasetId: string) => void;
  customDatasets?: Record<string, DatasetMetadata>;
  setCustomDatasets?: (datasets: Record<string, DatasetMetadata>) => void;
}

export interface DatasetMetadata {
  id: string;
  name: string;
  description: string;
  type: 'numerical' | 'categorical' | 'temporal';
  values: any[];
  compatibleCharts: MarkType[];
  source: 'sample' | 'custom';
  uploadDate?: Date;
  originalFileName?: string;
} 