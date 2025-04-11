import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DatasetMetadata } from '../../types/dataset';
import { getAllDatasets, deleteDataset } from '../../utils/indexedDB';
import { DatasetSection } from '../Editor/DatasetSection';
import { DataTransformationPanel } from './DataTransformationPanel';
import { LoadingState } from '../common/LoadingState';
import TableViewIcon from '@mui/icons-material/TableView';
import GridViewIcon from '@mui/icons-material/GridView';

const Container = styled.div`
  padding: 24px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  color: ${props => props.theme.text.primary};
`;

const DatasetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
`;

const DatasetCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: ${props => props.theme.text.secondary};
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed ${props => props.theme.colors.border};
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  background: ${props => props.$active ? props.theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : props.theme.text.primary};
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ViewToggle = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${props => props.theme.text.primary};
  font-size: 1.5rem;
`;

const DatasetTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;

  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f8f9fa;
    font-weight: 500;
  }

  tbody tr:hover {
    background: #f8f9fa;
  }
`;

const DeleteButton = styled.button`
  padding: 6px 12px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  
  &:hover {
    background: #c82333;
  }
`;

export const DataManagement = () => {
  const [datasets, setDatasets] = useState<DatasetMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState<DatasetMetadata | null>(null);
  const [activeTab, setActiveTab] = useState<'datasets' | 'transform'>('datasets');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const data = await getAllDatasets();
      setDatasets(data);
    } catch (error) {
      console.error('Failed to load datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDataset = async (id: string) => {
    try {
      await deleteDataset(id);
      await loadDatasets();
    } catch (error) {
      console.error('Failed to delete dataset:', error);
    }
  };

  const handleDatasetSelect = (dataset: DatasetMetadata) => {
    setSelectedDataset(dataset);
    setActiveTab('transform');
  };

  const handleTransformComplete = () => {
    setSelectedDataset(null);
    setActiveTab('datasets');
    loadDatasets();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container>
      <TopBar>
        <Title>Data Management</Title>
        <TabContainer>
          <ViewToggle onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
            {viewMode === 'grid' ? <TableViewIcon /> : <GridViewIcon />}
          </ViewToggle>
          <Tab 
            $active={activeTab === 'datasets'} 
            onClick={() => setActiveTab('datasets')}
          >
            Datasets
          </Tab>
          <Tab 
            $active={activeTab === 'transform'} 
            onClick={() => setActiveTab('transform')}
            disabled={!selectedDataset}
          >
            Transform
          </Tab>
        </TabContainer>
      </TopBar>

      {activeTab === 'datasets' && (
        <>
          <DatasetSection onDatasetLoad={loadDatasets} />
          
          {datasets.length > 0 ? (
            viewMode === 'grid' ? (
              <DatasetGrid>
                {datasets.map(dataset => (
                  <DatasetCard 
                    key={dataset.id}
                    onClick={() => handleDatasetSelect(dataset)}
                  >
                    <h3>{dataset.name}</h3>
                    <p>{dataset.rowCount} rows × {dataset.columnCount} columns</p>
                    <p>Uploaded: {new Date(dataset.uploadDate).toLocaleDateString()}</p>
                  </DatasetCard>
                ))}
              </DatasetGrid>
            ) : (
              <DatasetTable>
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
                  {datasets.map(dataset => (
                    <tr key={dataset.id}>
                      <td>{dataset.name}</td>
                      <td>{dataset.rowCount}</td>
                      <td>{dataset.columnCount}</td>
                      <td>{new Date(dataset.uploadDate).toLocaleDateString()}</td>
                      <td>
                        <DeleteButton onClick={() => handleDeleteDataset(dataset.id)}>Delete</DeleteButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DatasetTable>
            )
          ) : (
            <EmptyState>
              No datasets uploaded yet. Upload your first dataset to get started.
            </EmptyState>
          )}
        </>
      )}

      {activeTab === 'transform' && selectedDataset && (
        <DataTransformationPanel 
          dataset={selectedDataset}
          onComplete={handleTransformComplete}
        />
      )}
    </Container>
  );
};

export default DataManagement; 