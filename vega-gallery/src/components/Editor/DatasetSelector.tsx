/**
 * Handles dataset selection and management.
 * Supports both sample and custom uploaded datasets.
 */

import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { sampleDatasets } from '../../utils/sampleData'
import { MarkType } from '../../types/vega'
import { DatasetMetadata } from '../../types/dataset'
import { LoadingState } from '../common/LoadingState'
import { Tabs, Tab } from '@mui/material'
import { getAllDatasets } from '../../utils/indexedDB'

const Container = styled.div`
  margin-top: 16px;
`

const DatasetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const DatasetCard = styled.button<{ $active: boolean }>`
  width: 100%;
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
`

const DatasetName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text.primary};
  margin-bottom: 4px;
`

const DatasetDescription = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.text.secondary};
  margin-bottom: 8px;
`

const DatasetMeta = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: ${props => props.theme.text.secondary};
`

const Badge = styled.span`
  padding: 2px 6px;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 0.8rem;
`

const TabPanel = styled.div<{ $active: boolean }>`
  display: ${props => props.$active ? 'block' : 'none'};
  padding: 16px 0;
`;

interface DatasetSelectorProps {
  chartId: string;
  currentDataset: string;
  onSelect: (datasetId: string) => void;
  allowUpload?: boolean;
}

export const DatasetSelector = ({ 
  chartId,
  currentDataset, 
  onSelect,
  allowUpload = false
}: DatasetSelectorProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedDatasets, setUploadedDatasets] = useState<DatasetMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setIsLoading(true);
        const loadedDatasets = await getAllDatasets() as DatasetMetadata[];
        setUploadedDatasets(loadedDatasets);
      } catch (error) {
        console.error('Failed to load datasets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const handleSelect = (dataset: DatasetMetadata | string) => {
    if (typeof dataset === 'string') {
      onSelect(dataset);
    } else {
      onSelect(dataset.id);
    }
  };

  return (
    <Container>
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Sample Data" />
        <Tab label="My Uploads" />
      </Tabs>

      <TabPanel $active={activeTab === 0}>
        <DatasetList>
          {Object.entries(sampleDatasets).map(([id, dataset]) => (
            <DatasetCard
              key={id}
              $active={currentDataset === id}
              onClick={() => handleSelect(id)}
            >
              <DatasetName>{dataset.name}</DatasetName>
              <DatasetDescription>{dataset.description}</DatasetDescription>
              <DatasetMeta>
                <Badge>Sample</Badge>
              </DatasetMeta>
            </DatasetCard>
          ))}
        </DatasetList>
      </TabPanel>

      <TabPanel $active={activeTab === 1}>
        {isLoading ? (
          <LoadingState />
        ) : (
          <DatasetList>
            {uploadedDatasets.map(dataset => (
              <DatasetCard
                key={dataset.id}
                $active={currentDataset === dataset.id}
                onClick={() => handleSelect(dataset)}
              >
                <DatasetName>{dataset.name}</DatasetName>
                <DatasetDescription>
                  {dataset.description || `${dataset.rowCount} rows, ${dataset.columnCount} columns`}
                </DatasetDescription>
                <DatasetMeta>
                  <Badge>Upload</Badge>
                  {dataset.uploadDate && (
                    <span>{new Date(dataset.uploadDate).toLocaleDateString()}</span>
                  )}
                </DatasetMeta>
              </DatasetCard>
            ))}
            {uploadedDatasets.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No uploaded datasets. Visit the Data Management page to upload your data.
              </div>
            )}
          </DatasetList>
        )}
      </TabPanel>
    </Container>
  );
} 