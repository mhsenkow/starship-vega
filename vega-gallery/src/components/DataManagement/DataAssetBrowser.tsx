import React, { useState, useEffect } from 'react';
import { 
  InfoIcon, 
  DeleteIcon, 
  EditIcon, 
  Filter as FilterListIcon 
} from '../common/Icons';
import { Button } from '../../design-system/components/ButtonSystem';
import { Badge, BadgeGroup } from '../../design-system/components/BadgeSystem';
import { DatasetMetadata } from '../../types/dataset';
import { getAllDatasets, deleteDataset } from '../../utils/indexedDB';
import { DatasetMetadataForm } from './DatasetMetadataForm';
import styles from './DataAssetBrowser.module.css';

interface DataAssetBrowserProps {
  onSelectDataset?: (dataset: DatasetMetadata) => void;
  onUpdateDataset?: (dataset: DatasetMetadata) => void;
  selectable?: boolean;
  narrow?: boolean;
}

export const DataAssetBrowser: React.FC<DataAssetBrowserProps> = ({ 
  onSelectDataset, 
  onUpdateDataset,
  narrow = false
}) => {
  const [datasets, setDatasets] = useState<DatasetMetadata[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<DatasetMetadata[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<DatasetMetadata | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load datasets on component mount
  useEffect(() => {
    let isMounted = true;
    const loadDatasets = async () => {
      try {
        setIsLoading(true);
        const allDatasets = await getAllDatasets();
        if (isMounted) {
          setDatasets(allDatasets);
          setFilteredDatasets(allDatasets);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load datasets:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadDatasets();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter datasets based on search query and selected filters
  useEffect(() => {
    let filtered = datasets;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(dataset =>
        dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dataset.description && dataset.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(dataset =>
        selectedTags.some(tag => dataset.tags?.includes(tag))
      );
    }

    // Apply origin filter
    if (selectedOrigins.length > 0) {
      filtered = filtered.filter(dataset =>
        dataset.origin && selectedOrigins.includes(dataset.origin)
      );
    }

    setFilteredDatasets(filtered);
  }, [datasets, searchQuery, selectedTags, selectedOrigins]);

  // Extract unique tags and origins for filters
  const allTags = Array.from(new Set(datasets.flatMap(d => d.tags || [])));
  const allOrigins = Array.from(new Set(datasets.map(d => d.origin).filter(Boolean))) as string[];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleOriginToggle = (origin: string) => {
    setSelectedOrigins(prev => 
      prev.includes(origin) 
        ? prev.filter(o => o !== origin)
        : [...prev, origin]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setSelectedOrigins([]);
  };

  const handleEditDataset = (dataset: DatasetMetadata) => {
    setSelectedDataset(dataset);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (dataset: DatasetMetadata) => {
    setSelectedDataset(dataset);
    setIsDetailDialogOpen(true);
  };

  const handleDeleteDataset = async (dataset: DatasetMetadata) => {
    if (window.confirm(`Are you sure you want to delete "${dataset.name}"?`)) {
      try {
        await deleteDataset(dataset.id);
        setDatasets(prev => prev.filter(d => d.id !== dataset.id));
        if (onUpdateDataset) {
          onUpdateDataset(dataset);
        }
      } catch (error) {
        console.error('Failed to delete dataset:', error);
        alert('Failed to delete dataset. Please try again.');
      }
    }
  };

  const handleDatasetUpdate = (updatedMetadata: Partial<DatasetMetadata>) => {
    if (selectedDataset && updatedMetadata.id) {
      const updatedDataset = { ...selectedDataset, ...updatedMetadata } as DatasetMetadata;
      setDatasets(prev => 
        prev.map(d => d.id === updatedDataset.id ? updatedDataset : d)
      );
      setIsEditDialogOpen(false);
      setSelectedDataset(null);
      if (onUpdateDataset) {
        onUpdateDataset(updatedDataset);
      }
    }
  };

  const handleDatasetSelect = (dataset: DatasetMetadata) => {
    if (onSelectDataset) {
      onSelectDataset(dataset);
    }
  };

  const formatDataPreview = (data: any[]) => {
    if (!data || data.length === 0) return 'No data available';
    
    const maxRows = 10;
    const previewData = data.slice(0, maxRows);
    
    return JSON.stringify(previewData, null, 2);
  };

  const getRowCount = (data: any[]) => {
    return data ? data.length : 0;
  };

  const getColumnCount = (data: any[]) => {
    if (!data || data.length === 0) return 0;
    return Object.keys(data[0]).length;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
          Loading datasets...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Data Assets Library</h2>
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search datasets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <Button
          variant="secondary"
          size="small"
        >
          <FilterListIcon size={16} />
          Filter
        </Button>
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.filterSection}>
          <span className={styles.filterLabel}>Tags:</span>
          <div className={styles.chipContainer}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`${styles.chip} ${selectedTags.includes(tag) ? styles.chipSelected : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.filterSection}>
          <span className={styles.filterLabel}>Origin:</span>
          <div className={styles.chipContainer}>
            {allOrigins.map(origin => (
              <button
                key={origin}
                onClick={() => handleOriginToggle(origin)}
                className={`${styles.chip} ${selectedOrigins.includes(origin) ? styles.chipSelected : ''}`}
              >
                {origin}
              </button>
            ))}
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="small"
          onClick={clearFilters}
          className={styles.clearFiltersButton}
        >
          Clear Filters
        </Button>
      </div>

      <div className={styles.resultsCount}>
        {filteredDatasets.length} datasets found
      </div>

      <div className={`${styles.datasetGrid} ${narrow ? styles.narrow : ''}`}>
        {filteredDatasets.map(dataset => (
          <div
            key={dataset.id}
            className={styles.card}
            onClick={() => handleDatasetSelect(dataset)}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{dataset.name}</h3>
              <Button
                variant="icon"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails(dataset);
                }}
              >
                <InfoIcon size={16} />
              </Button>
            </div>
            
            <p className={styles.cardDescription}>{dataset.description || 'No description available'}</p>
            
            {dataset.tags && dataset.tags.length > 0 && (
              <BadgeGroup spacing="compact">
                {dataset.tags.slice(0, 3).map(tag => (
                  <Badge 
                    key={tag}
                    variant="neutral" 
                    size="small"
                  >
                    {tag}
                  </Badge>
                ))}
                {dataset.tags.length > 3 && (
                  <Badge 
                    variant="secondary" 
                    size="small"
                  >
                    +{dataset.tags.length - 3} more
                  </Badge>
                )}
              </BadgeGroup>
            )}
            
            <div className={styles.statsContainer}>
              <span>{getRowCount(dataset.values || [])} rows</span>
              <span>{getColumnCount(dataset.values || [])} columns</span>
              <span>Origin: {dataset.origin || 'Unknown'}</span>
            </div>
            
            <div className={styles.cardActions}>
              <Button
                variant="secondary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditDataset(dataset);
                }}
              >
                <EditIcon size={14} />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteDataset(dataset);
                }}
              >
                <DeleteIcon size={14} />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      {isEditDialogOpen && selectedDataset && (
        <div className={styles.dialog}>
          <div className={styles.dialogContent}>
            <h2 className={styles.dialogTitle}>Edit Dataset</h2>
            <DatasetMetadataForm
              initialMetadata={selectedDataset}
              onSubmit={handleDatasetUpdate}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedDataset(null);
              }}
              open={true}
              previewData={selectedDataset.values}
            />
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      {isDetailDialogOpen && selectedDataset && (
        <div className={styles.dialog}>
          <div className={styles.dialogContent}>
            <h2 className={styles.dialogTitle}>Dataset Details</h2>
            
            <div className={styles.dialogSection}>
              <h3 className={styles.dialogSectionTitle}>Metadata</h3>
              <table className={styles.metadataTable}>
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{selectedDataset.name}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>{selectedDataset.description}</td>
                  </tr>
                  <tr>
                    <th>Origin</th>
                    <td>{selectedDataset.origin}</td>
                  </tr>
                  <tr>
                    <th>Created</th>
                    <td>{new Date(selectedDataset.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Updated</th>
                    <td>{selectedDataset.updatedAt ? new Date(selectedDataset.updatedAt).toLocaleString() : 'Never'}</td>
                  </tr>
                  <tr>
                    <th>Rows</th>
                    <td>{getRowCount(selectedDataset.values || [])}</td>
                  </tr>
                  <tr>
                    <th>Columns</th>
                    <td>{getColumnCount(selectedDataset.values || [])}</td>
                  </tr>
                  {selectedDataset.tags && selectedDataset.tags.length > 0 && (
                    <tr>
                      <th>Tags</th>
                      <td>
                        <BadgeGroup spacing="compact">
                          {selectedDataset.tags.map(tag => (
                            <Badge key={tag} variant="neutral" size="small">
                              {tag}
                            </Badge>
                          ))}
                        </BadgeGroup>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.dialogSection}>
              <h3 className={styles.dialogSectionTitle}>Data Preview</h3>
              <p className={styles.previewText}>
                Showing first 10 rows of data:
              </p>
              <div className={styles.previewContainer}>
                <pre className={styles.previewCode}>
                  {formatDataPreview(selectedDataset.values || [])}
                </pre>
              </div>
            </div>

            <div className={styles.dialogActions}>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDetailDialogOpen(false);
                  setSelectedDataset(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};