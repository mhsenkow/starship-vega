import { useState, useCallback } from 'react';
import Papa from 'papaparse'; // For CSV parsing
import { DatasetMetadata } from '../types/vega';
import styled from 'styled-components';

interface DataUploaderProps {
  onDatasetAdd: (dataset: DatasetMetadata) => void;
  detectDataTypes: (values: any[]) => Record<string, string>;
  determineCompatibleCharts: (dataTypes: Record<string, string>) => MarkType[];
  determineDatasetType: (dataTypes: Record<string, string>) => DatasetMetadata['type'];
}

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;

  &:hover {
    background: ${props => `${props.theme.colors.primary}dd`};
  }
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.9rem;
  margin: 8px 0;
`;

const ProcessingText = styled.span`
  color: ${props => props.theme.text.secondary};
  font-size: 0.9rem;
  margin-left: 8px;
`;

export const DataUploader = ({ 
  onDatasetAdd, 
  detectDataTypes,
  determineCompatibleCharts,
  determineDatasetType 
}: DataUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      let values: any[] = [];
      
      if (file.type === 'application/json') {
        const text = await file.text();
        values = JSON.parse(text);
      } else if (file.type === 'text/csv') {
        const result = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: resolve,
            error: reject
          });
        });
        values = (result as any).data;
      } else {
        throw new Error('Unsupported file type. Please upload JSON or CSV.');
      }

      // Detect data types and compatible charts
      const dataTypes = detectDataTypes(values);
      const compatibleCharts = determineCompatibleCharts(dataTypes);

      const newDataset: DatasetMetadata = {
        id: `custom-${Date.now()}`,
        name: file.name.split('.')[0],
        description: `Uploaded ${file.name}`,
        type: determineDatasetType(dataTypes),
        compatibleCharts,
        values,
        source: 'custom',
        originalFileName: file.name,
        uploadDate: new Date()
      };

      onDatasetAdd(newDataset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
    }
  }, [onDatasetAdd, detectDataTypes, determineCompatibleCharts, determineDatasetType]);

  return (
    <>
      <input
        type="file"
        accept=".json,.csv"
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        className="hidden"
        id="file-upload"
      />
      <UploadButton htmlFor="file-upload">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1L8 12M8 1L4 5M8 1L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M2 11V14H14V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Upload Dataset
        {isProcessing && <ProcessingText>Processing...</ProcessingText>}
      </UploadButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </>
  );
};
