import { storeDataset, getAllDatasets } from './indexedDB';
import { sampleDatasets } from './sampleData';

/**
 * Seeds the database with sample datasets if no datasets exist
 * Returns true if datasets were seeded, false otherwise
 */
export const seedDatabaseWithSampleData = async (): Promise<boolean> => {
  try {
    // Check if datasets already exist
    const existingDatasets = await getAllDatasets();
    
    if (existingDatasets.length === 0) {
      console.log('No datasets found, seeding database with sample data...');
      
      // Load each sample dataset into the database
      for (const key of Object.keys(sampleDatasets)) {
        const dataset = sampleDatasets[key];
        
        // Make sure dataset has proper metadata with all required fields
        const datasetWithMetadata = {
          ...dataset,
          createdAt: new Date().toISOString(),
          uploadDate: new Date().toISOString(), // Legacy field
          source: 'Sample Dataset',
          origin: 'sample data',
          isSample: true, // Mark as sample dataset for UI differentiation
          rowCount: dataset.values?.length || 0,
          columnCount: dataset.columns?.length || 0,
          previewRows: dataset.values?.slice(0, 5) || [],
          tags: ['sample', 'demo'] // Add default tags for sample data
        };
        
        // Store in database
        await storeDataset(datasetWithMetadata);
        console.log(`Stored sample dataset: ${dataset.name}`);
      }
      
      console.log('Database seeding complete');
      return true;
    } else {
      console.log('Datasets already exist, skipping seed process');
      return false;
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

/**
 * Updates sample datasets with new versions
 * Useful for updating when the app has new samples available
 */
export const updateSampleDatasets = async (): Promise<boolean> => {
  try {
    // Get all existing datasets
    const existingDatasets = await getAllDatasets();
    
    // Filter to find sample datasets
    const sampleDatasetIds = existingDatasets
      .filter(dataset => dataset.isSample)
      .map(dataset => dataset.id);
    
    // Update each sample dataset
    for (const key of Object.keys(sampleDatasets)) {
      const dataset = sampleDatasets[key];
      
      if (sampleDatasetIds.includes(dataset.id)) {
        // Update existing sample dataset with all required fields
        const updatedDataset = {
          ...dataset,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          uploadDate: new Date().toISOString(), // Legacy field
          source: 'Sample Dataset',
          origin: 'sample data',
          isSample: true,
          lastUpdated: new Date().toISOString(),
          rowCount: dataset.values?.length || 0,
          columnCount: dataset.columns?.length || 0,
          previewRows: dataset.values?.slice(0, 5) || [],
          tags: ['sample', 'demo'] // Add default tags for sample data
        };
        
        await storeDataset(updatedDataset);
        console.log(`Updated sample dataset: ${dataset.name}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating sample datasets:', error);
    return false;
  }
}; 