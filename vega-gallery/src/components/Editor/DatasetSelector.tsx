/**
 * Handles dataset selection and management.
 * Supports both sample and custom uploaded datasets.
 */

import React, { useState, useEffect } from 'react'
import styles from './DatasetSelector.module.css';
import { sampleDatasets } from '../../utils/sampleData'
import { DatasetMetadata } from '../../types/dataset'
import { LoadingState } from '../common/LoadingState'
import { Tabs } from '../../design-system'
import { getAllDatasets, initDB, deleteDataset, clearAllDatasets } from '../../utils/indexedDB'
import { DatasetSection } from './DatasetSection'
import { CloseIcon } from '../common/Icons'

interface DatasetSelectorProps {
  chartId: string;
  currentDataset: string;
  onSelect: (dataset: string, metadata?: DatasetMetadata) => void;
  allowUpload?: boolean;
  datasetCache?: Record<string, DatasetMetadata>;
  setDatasetCache?: (cache: Record<string, DatasetMetadata>) => void;
}

export const DatasetSelector = ({ 
  currentDataset, 
  onSelect,
  allowUpload = false
}: DatasetSelectorProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [uploadedDatasets, setUploadedDatasets] = useState<DatasetMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize IndexedDB and load datasets
  useEffect(() => {
    const loadDatasets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize IndexedDB
        await initDB();
        
        // Get all datasets
        const datasets = await getAllDatasets();
        // console.log('Loaded datasets:', datasets); // Debug log
        
        if (Array.isArray(datasets)) {
          setUploadedDatasets(datasets);
        } else {
          console.error('Invalid datasets format:', datasets);
          setUploadedDatasets([]);
        }
      } catch (error) {
        console.error('Failed to load datasets:', error);
        setError('Failed to load datasets. Please try again.');
        setUploadedDatasets([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDatasets();
  }, []);

  const handleSelect = async (dataset: DatasetMetadata | string) => {
    try {
      if (typeof dataset === 'string') {
        onSelect(dataset);
      } else {
        onSelect(dataset.id || '', dataset);
      }
    } catch (error) {
      console.error('Error selecting dataset:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDataset(id);
      // Refresh the dataset list
      const datasets = await getAllDatasets();
      setUploadedDatasets(datasets as DatasetMetadata[]);
    } catch (error) {
      console.error('Failed to delete dataset:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAllDatasets();
      setUploadedDatasets([]);
    } catch (error) {
      console.error('Failed to clear datasets:', error);
    }
  };

  return (
    <div className={styles.container}>
      {error && (
        <div className={styles.errorMessage}>{error}</div>
      )}
      
      {allowUpload && (
        <DatasetSection 
          onDatasetLoad={(dataset) => {
            // Refresh the dataset list after upload
            getAllDatasets().then(datasets => {
              if (Array.isArray(datasets)) {
                setUploadedDatasets(datasets);
              }
            });
            handleSelect(dataset);
          }}
        />
      )}
      
      <Tabs 
        value={activeTab} 
        onChange={(newValue) => setActiveTab(newValue as number)}
        tabs={[
          { label: "Sample Data", value: 0 },
          { label: "My Uploads", value: 1 }
        ]}
      />

      <div className={`${styles.localTabPanel} ${activeTab === 0 ? '' : styles.hidden}`}>
        <div className={styles.datasetList}>
          {Object.entries(sampleDatasets).map(([id, dataset]) => (
            <button
              key={id}
              className={`${styles.datasetCardButton} ${currentDataset === id ? styles.active : ''}`}
              onClick={() => handleSelect(id)}
            >
              <div className={styles.datasetName}>{dataset.name}</div>
              <div className={styles.datasetDescription}>{dataset.description}</div>
              <div className={styles.datasetMeta}>
                <span className={`${styles.badge} ${styles.sample}`}>Sample</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`${styles.localTabPanel} ${activeTab === 1 ? '' : styles.hidden}`}>
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            <div className={styles.datasetControls}>
              {uploadedDatasets.length > 0 && (
                <button className={styles.clearButton} onClick={handleClearAll}>
                  Clear All Datasets
                </button>
              )}
            </div>
            <div className={styles.datasetList}>
              {uploadedDatasets.map(dataset => (
                <div
                  key={dataset.id}
                  className={`${styles.datasetCard} ${currentDataset === dataset.id ? styles.active : ''}`}
                >
                  <div className={styles.datasetContent} onClick={() => handleSelect(dataset)}>
                    <div className={styles.datasetName}>{dataset.name}</div>
                    <div className={styles.datasetDescription}>
                      {dataset.columns?.length || 0} columns
                    </div>
                    <div className={styles.datasetMeta}>
                      <span className={`${styles.badge} ${styles.upload}`}>Upload</span>
                      {dataset.transformed && (
                        <span className={`${styles.badge} ${styles.transformed}`}>Transformed</span>
                      )}
                      {dataset.uploadDate && (
                        <span className={styles.uploadDate}>{new Date(dataset.uploadDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (dataset.id) {
                        handleDelete(dataset.id);
                      }
                    }}
                    title="Delete dataset"
                  >
                    <CloseIcon size={14} />
                  </button>
                </div>
              ))}
              {uploadedDatasets.length === 0 && (
                <div className={styles.emptyState}>No uploaded datasets</div>
              )}
            </div>
          </>
        )}
        </div>
    </div>
  );
} 