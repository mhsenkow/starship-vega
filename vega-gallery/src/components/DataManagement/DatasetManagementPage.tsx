import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem';
import { Tabs, TabPanel } from '../../design-system/components/Tabs';
import styles from './DatasetManagementPage.module.css';
import { 
  StorageIcon, 
  UploadFileIcon, 
  ImageIcon, 
  AutoFixHighIcon, 
  TableChartIcon, 
  CloudUploadIcon, 
  DirectionsIcon 
} from '../common/Icons';
import { DataAssetBrowser } from './DataAssetBrowser';
import { ImageDataExtractor } from './ImageDataExtractor';
import { DataTransformationPanel } from './DataTransformationPanel';
import { ExportImport } from './ExportImport';
import { storeDataset } from '../../utils/indexedDB';
import { exportAllData } from '../../utils/exportImport';
import { DataUploader } from '../Editor/DataUploader';
import { detectDataTypes, determineCompatibleCharts } from '../../utils/dataUtils';
import { DatasetMetadata } from '../../types/dataset';
import { updateSampleDatasets } from '../../utils/seedData';

// Styled components removed - using CSS modules instead

export const DatasetManagementPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDataset, setSelectedDataset] = useState<DatasetMetadata | null>(null);
  const [isUpdatingSamples, setIsUpdatingSamples] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Clear success message after 5 seconds
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleTabChange = (newValue: string | number) => {
    setTabValue(newValue as number);
  };

  const tabs = [
    { label: "Browse Datasets", value: 0, icon: <TableChartIcon /> },
    { label: "Upload Dataset", value: 1, icon: <UploadFileIcon /> },
    { label: "Image Extraction", value: 2, icon: <ImageIcon /> },
    { label: "Export/Import", value: 3, icon: <CloudUploadIcon /> },
    ...(selectedDataset ? [{ label: "Transform", value: 4, icon: <DirectionsIcon /> }] : [])
  ];

  const handleExportAllData = async () => {
    try {
      await exportAllData();
      setSuccessMessage("Data exported successfully!");
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleDatasetAdd = async (dataset: DatasetMetadata) => {
    try {
      await storeDataset(dataset);
      setSuccessMessage("Dataset added successfully!");
    } catch (error) {
      console.error('Failed to store dataset:', error);
      alert('Failed to store dataset. Please try again.');
    }
  };

  const handleDatasetSelect = (dataset: DatasetMetadata) => {
    setSelectedDataset(dataset);
    setTabValue(4); // Switch to transform tab
  };

  const handleTransformComplete = () => {
    setSelectedDataset(null);
    setTabValue(0); // Back to browse tab
    setSuccessMessage("Dataset transformed successfully!");
  };

  const handleImageDataExtracted = async (dataset: DatasetMetadata) => {
    try {
      await storeDataset(dataset);
      setSuccessMessage("Data extracted from image successfully!");
    } catch (error) {
      console.error('Failed to save extracted dataset:', error);
      alert('Failed to save extracted dataset. Please try again.');
    }
  };

  const handleUpdateSampleDatasets = async () => {
    try {
      setIsUpdatingSamples(true);
      await updateSampleDatasets();
      setSuccessMessage("Sample datasets updated successfully!");
    } catch (error) {
      console.error('Failed to update sample datasets:', error);
      alert('Failed to update sample datasets. Please try again.');
    } finally {
      setIsUpdatingSamples(false);
    }
  };

  const handleClearAndReseedDatabase = async () => {
    try {
      setIsUpdatingSamples(true);
      // Clear all datasets first
      const { clearAllDatasets } = await import('../../utils/indexedDB');
      await clearAllDatasets();
      
      // Reseed with sample data
      const { seedDatabaseWithSampleData } = await import('../../utils/seedData');
      await seedDatabaseWithSampleData();
      
      setSuccessMessage("Database cleared and reseeded successfully!");
    } catch (error) {
      console.error('Failed to clear and reseed database:', error);
      alert('Failed to clear and reseed database. Please try again.');
    } finally {
      setIsUpdatingSamples(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Data Asset Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse, manage, and organize your datasets
          </Typography>
        </Box>
        <Box>
          <ButtonGroup buttonStyle="floating">
            <Button 
              variant="secondary" 
              size="medium"
              onClick={handleUpdateSampleDatasets}
              disabled={isUpdatingSamples}
            >
              <AutoFixHighIcon />
              {isUpdatingSamples ? 'Updating...' : 'Update Sample Data'}
            </Button>
            <Button 
              variant="tertiary" 
              size="medium"
              onClick={handleClearAndReseedDatabase}
              disabled={isUpdatingSamples}
            >
              <StorageIcon />
              {isUpdatingSamples ? 'Processing...' : 'Clear & Reseed DB'}
            </Button>
            <Button 
              variant="tertiary" 
              size="medium"
              onClick={handleExportAllData}
            >
              <StorageIcon />
              Export All Data
            </Button>
          </ButtonGroup>
        </Box>
      </div>

      {successMessage && (
        <Box style={{ 
          padding: '16px', 
          marginBottom: '16px',
          backgroundColor: '#e8f5e9', 
          borderRadius: '8px',
          border: '1px solid #c8e6c9'
        }}>
          <Typography color="success">{successMessage}</Typography>
        </Box>
      )}

      <Box style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          tabs={tabs}
        />
      </Box>

      <TabPanel value={0} currentValue={tabValue}>
        <Box style={{ marginTop: '16px' }}>
          <DataAssetBrowser 
            key="data-asset-browser" 
            onSelectDataset={handleDatasetSelect}
          />
        </Box>
      </TabPanel>

      <TabPanel value={1} currentValue={tabValue}>
        <Box style={{ marginTop: '16px', padding: '24px', border: '1px solid #eee', borderRadius: '16px' }}>
          <Typography variant="h6" gutterBottom>
            Upload New Dataset
          </Typography>
          <Typography variant="body2" color="secondary">
            Upload CSV or JSON data. You'll be prompted to add metadata to help organize and identify your dataset.
          </Typography>
          
          <DataUploader 
            onDatasetAdd={handleDatasetAdd}
            detectDataTypes={detectDataTypes}
            determineCompatibleCharts={determineCompatibleCharts}
          />
        </Box>
      </TabPanel>

      <TabPanel value={2} currentValue={tabValue}>
        <Box style={{ marginTop: '16px' }}>
          <ImageDataExtractor onDataExtracted={handleImageDataExtracted} />
        </Box>
      </TabPanel>

      <TabPanel value={3} currentValue={tabValue}>
        <Box style={{ marginTop: '16px' }}>
          <ExportImport />
        </Box>
      </TabPanel>

      {selectedDataset && (
        <TabPanel value={4} currentValue={tabValue}>
          <Box style={{ marginTop: '16px' }}>
            <DataTransformationPanel 
              dataset={selectedDataset}
              onComplete={handleTransformComplete}
            />
          </Box>
        </TabPanel>
      )}
    </div>
  );
}; 