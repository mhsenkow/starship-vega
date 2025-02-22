import { useState, useRef } from 'react';
import styled from 'styled-components';
import { LoadingState } from '../common/LoadingState';
import Papa from 'papaparse';

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

const ChooseFileButton = styled.button`
  background: #212529;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #343a40;
  }
`;

const FileName = styled.span`
  color: #495057;
  font-size: 0.9rem;
`;

const UploadButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background: #ced4da;
    cursor: not-allowed;
  }
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

interface Dataset {
  id: string;
  name: string;
  rows: number;
  columns: number;
  uploadDate: Date;
  data: any[];
}

interface DatasetSectionProps {
  onDatasetLoad: (data: any[]) => void;
}

export const DatasetSection = ({ onDatasetLoad }: DatasetSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsLoading(true);

    Papa.parse(selectedFile, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        onDatasetLoad(results.data);
        setIsLoading(false);
        setSelectedFile(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setIsLoading(false);
      }
    });
  };

  return (
    <Section>
      <Title>Dataset</Title>
      <UploadArea>
        <FileInput>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <ChooseFileButton onClick={() => fileInputRef.current?.click()}>
            Choose File
          </ChooseFileButton>
          <FileName>
            {selectedFile?.name || 'No file chosen'}
          </FileName>
        </FileInput>
        <UploadButton 
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? (
            <>
              <LoadingState size="small" />
              Uploading...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 5l3-3 3 3M3 13h10" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
              Upload Dataset
            </>
          )}
        </UploadButton>
      </UploadArea>
    </Section>
  );
}; 