import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { DatasetSection } from '../Editor/DatasetSection'
import { LoadingState } from '../common/LoadingState'
import { DatasetMetadata } from '../../types/dataset'

const Container = styled.div`
  padding: 24px;
`

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

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
`

const ActionButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    opacity: 0.9;
  }
`

interface DatasetStorageItem {
  id: string;
  name: string;
  description: string;
  uploadDate: string;
  rowCount: number;
  columnCount: number;
  data: any[]; // We'll store the actual data with IndexedDB
}

// Create IndexedDB helper functions
const initDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('VegaGalleryDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('datasets')) {
        db.createObjectStore('datasets', { keyPath: 'id' });
      }
    };
  });
};

const saveDataset = async (dataset: DatasetStorageItem) => {
  const db: IDBDatabase = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['datasets'], 'readwrite');
    const store = transaction.objectStore('datasets');
    const request = store.put(dataset);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getAllDatasets = async () => {
  const db: IDBDatabase = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['datasets'], 'readonly');
    const store = transaction.objectStore('datasets');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const deleteDataset = async (id: string) => {
  const db: IDBDatabase = await initDB() as IDBDatabase;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['datasets'], 'readwrite');
    const store = transaction.objectStore('datasets');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const DataManagement = () => {
  const [datasets, setDatasets] = useState<DatasetStorageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load datasets on mount
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setIsLoading(true);
        const loadedDatasets = await getAllDatasets() as DatasetStorageItem[];
        setDatasets(loadedDatasets);
      } catch (error) {
        console.error('Failed to load datasets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const handleDatasetUpload = async (data: any[]) => {
    try {
      setIsLoading(true);
      const id = `dataset-${Date.now()}`;
      const fileName = data.fileName || `Dataset ${datasets.length + 1}`;
      
      const newDataset: DatasetStorageItem = {
        id,
        name: fileName,
        description: `Uploaded dataset`,
        uploadDate: new Date().toISOString(),
        rowCount: Array.isArray(data) ? data.length : Object.keys(data).length,
        columnCount: data[0] ? Object.keys(data[0]).length : 0,
        data: data
      };

      await saveDataset(newDataset);
      setDatasets(prev => [...prev, newDataset]);
    } catch (error) {
      console.error('Error handling dataset upload:', error);
      alert('Failed to save dataset. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteDataset(id);
      setDatasets(prev => prev.filter(dataset => dataset.id !== id));
    } catch (error) {
      console.error('Failed to delete dataset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <DatasetSection onDatasetLoad={handleDatasetUpload} />
      <TableContainer>
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
            {datasets.map(dataset => (
              <tr key={dataset.id}>
                <td>{dataset.name}</td>
                <td>{dataset.rowCount}</td>
                <td>{dataset.columnCount}</td>
                <td>{new Date(dataset.uploadDate).toLocaleDateString()}</td>
                <td>
                  <ActionButton onClick={() => handleDelete(dataset.id)}>
                    Delete
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {isLoading && <LoadingState />}
      </TableContainer>
    </Container>
  )
}; 