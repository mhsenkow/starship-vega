import React, { useState, useRef, useEffect } from 'react';
import { exportAllData, importData, calculateDatabaseSize } from '../../utils/exportImport';
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem';
import styles from './ExportImport.module.css';

// Styled components removed - using CSS modules instead

export const ExportImport: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const [dbSize, setDbSize] = useState<string>('Calculating...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Calculate database size when component mounts
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      const { sizeText } = await calculateDatabaseSize();
      setDbSize(sizeText);
    } catch (error) {
      console.error('Failed to load database stats:', error);
      setDbSize('Unknown');
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setMessage(null);
      await exportAllData();
      setMessage({ text: 'Export completed successfully!', success: true });
      
      // Refresh database stats after export
      await loadDatabaseStats();
    } catch (error) {
      setMessage({ 
        text: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        success: false 
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setMessage(null);

      const result = await importData(file);
      setMessage({ 
        text: `Import completed successfully! Imported ${result.snapshots} snapshots and ${result.canvases} canvases.`,
        success: true 
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh database stats after import
      await loadDatabaseStats();
    } catch (error) {
      setMessage({ 
        text: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        success: false 
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Export & Import</h3>
      
      <p className={styles.description}>
        Export your snapshots and dashboards to share them or create a backup.
        Import previously exported data to restore your snapshots and dashboards.
      </p>

      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{dbSize}</div>
          <div className={styles.statLabel}>Database Size</div>
        </div>
      </div>
      
      <div className={styles.buttonContainer}>
        <ButtonGroup buttonStyle="floating">
          <Button 
            variant="primary"
            size="medium"
            onClick={handleExport} 
            disabled={isExporting}
            loading={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export All Data'}
          </Button>
          
          <Button 
            variant="secondary"
            size="medium"
            onClick={handleImportClick}
            disabled={isImporting}
            loading={isImporting}
          >
            {isImporting ? 'Importing...' : 'Import Data'}
          </Button>
        </ButtonGroup>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          accept=".json" 
          onChange={handleFileSelect}
          className={styles.fileInput}
        />
      </div>
      
      {message && (
        <div className={`${styles.message} ${message.success ? styles.success : styles.error}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}; 