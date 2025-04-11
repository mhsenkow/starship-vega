import { useState, useRef } from 'react';
import styled from 'styled-components';
import Papa from 'papaparse';
import { LoadingState } from '../common/LoadingState';
import { detectDataTypes } from '../../utils/dataUtils';
import { storeDataset } from '../../utils/indexedDB';

const Section = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  color: ${props => props.theme.text.primary};
  margin-bottom: 16px;
`;

const UploadArea = styled.div`
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: #f8f9fa;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: #f1f3f5;
  }
`;

const FileInput = styled.div`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UploadButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  padding: 10px;
  background: ${props => props.$disabled ? '#e9ecef' : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.7 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const DatasetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DatasetCard = styled.button<{ $active: boolean }>`
  padding: 12px;
  background: white;
  border: 2px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.$active ? 'white' : '#f8f9fa'};
  }
`;

const DatasetName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text.primary};
  margin-bottom: 8px;
`;

const DatasetInfo = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
`;

const EditableDatasetName = styled.input`
  font-weight: 500;
  color: ${props => props.theme.text.primary};
  border: 1px solid transparent;
  background: transparent;
  padding: 4px 8px;
  border-radius: 4px;
  width: 100%;

  &:hover {
    border-color: ${props => props.theme.colors.border};
  }

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    background: white;
  }
`;

interface Dataset {
  id: string;
  name: string;
  rows: number;
  columns: number;
  uploadDate: Date;
  data: any[];
  fullData?: any[]; // Store full dataset if needed
  sampleRate?: number;
  totalRows?: number;
  totalColumns?: number;
}

interface DatasetSectionProps {
  onDatasetLoad: (data: any) => void;
}

export const DatasetSection = ({ onDatasetLoad }: DatasetSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedDatasets, setUploadedDatasets] = useState<DatasetMetadata[]>([]);

  const handleDelete = (id: string) => {
    setUploadedDatasets(prev => prev.filter(dataset => dataset.id !== id));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const results = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          preview: 1000,
          complete: resolve,
          error: reject
        });
      });

      let values = results.data.filter(row => Object.keys(row).length > 0);
      
      const displaySample = values.slice(0, 100);
      
      const dataset = {
        id: `dataset-${Date.now()}`,
        name: file.name.split('.')[0],
        description: `Uploaded on ${new Date().toLocaleDateString()} (sampled preview)`,
        values: displaySample,
        fullPath: file.name,
        columns: Object.keys(displaySample[0] || {}),
        rowCount: values.length,
        columnCount: Object.keys(displaySample[0] || {}).length,
        source: 'upload',
        uploadDate: new Date().toISOString(),
        dataTypes: detectDataTypes(displaySample)
      };

      await storeDataset(dataset);
      onDatasetLoad(dataset);
      
    } catch (error) {
      console.error('Error uploading dataset:', error);
    }
  };

  // Helper function to detect column type
  const detectColumnType = (values: any[]): string => {
    // Remove null/undefined values
    const cleanValues = values.filter(v => v != null);
    if (cleanValues.length === 0) return 'nominal';

    // Check if all values are numbers
    if (cleanValues.every(v => typeof v === 'number')) {
      return 'quantitative';
    }

    // Check if all values are valid dates
    if (cleanValues.every(v => !isNaN(Date.parse(String(v))))) {
      return 'temporal';
    }

    // Check if it's ordinal (small set of unique values)
    const uniqueValues = new Set(cleanValues);
    if (uniqueValues.size <= 20) {
      return 'ordinal';
    }

    // Default to nominal
    return 'nominal';
  };

  return (
    <Section>
      {uploadedDatasets.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rows</th>
              <th>Columns</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedDatasets.map(dataset => (
              <tr key={dataset.id}>
                <td>{dataset.name}</td>
                <td>{dataset.rowCount}</td>
                <td>{dataset.columnCount}</td>
                <td>{new Date(dataset.uploadDate).toLocaleDateString()}</td>
                <td>
                  <DeleteButton onClick={() => handleDelete(dataset.id)}>
                    Delete
                  </DeleteButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <UploadArea>
        <FileInput>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '8px 16px',
              background: '#212529',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Choose File
          </button>
          <span style={{ color: '#495057' }}>
            {selectedFile?.name || 'No file chosen'}
          </span>
        </FileInput>
        <UploadButton 
          onClick={() => selectedFile && handleUpload(selectedFile)}
          $disabled={!selectedFile || isLoading}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <LoadingState size="small" />
          ) : (
            'Upload Dataset'
          )}
        </UploadButton>
      </UploadArea>
    </Section>
  );
};

// Add these styled components
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }

  th {
    font-weight: 500;
    color: ${props => props.theme.text.secondary};
    background: #f8f9fa;
  }
`;

const DeleteButton = styled.button`
  padding: 4px 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #c82333;
  }
`; 