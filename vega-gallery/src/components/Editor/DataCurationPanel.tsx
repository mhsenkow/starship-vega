import React, { useState, useEffect } from 'react';
import styles from './DataCurationPanel.module.css';
import { DatasetMetadata } from '../../types/dataset';

interface DataCurationPanelProps {
  dataset: DatasetMetadata;
  onDatasetUpdate: (dataset: DatasetMetadata) => void;
}

// Add interface for accordion states
interface AccordionStates {
  quality: boolean;
  transformations: boolean;
  lineage: boolean;
}

export const DataCurationPanel: React.FC<DataCurationPanelProps> = ({
  dataset,
  onDatasetUpdate
}) => {
  const loadSavedStates = (): AccordionStates => {
    const saved = localStorage.getItem('dataCurationAccordionStates');
    return saved ? JSON.parse(saved) : {
      quality: false,
      transformations: false,
      lineage: false
    };
  };

  const [accordionStates, setAccordionStates] = useState<AccordionStates>(loadSavedStates());

  useEffect(() => {
    localStorage.setItem('dataCurationAccordionStates', JSON.stringify(accordionStates));
  }, [accordionStates]);

  const toggleAccordion = (section: keyof AccordionStates) => {
    setAccordionStates((prev: AccordionStates) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const calculateQualityMetrics = () => {
    const metrics = {
      completeness: 0,
      uniqueness: 0,
      outliers: 0
    };
    
    if (!dataset.values?.length) return metrics;
    
    // Calculate completeness
    const totalFields = Object.keys(dataset.values[0]).length * dataset.values.length;
    const nonNullFields = dataset.values.reduce((acc, row) => {
      return acc + Object.values(row).filter(v => v != null).length;
    }, 0);
    metrics.completeness = Math.round((nonNullFields / totalFields) * 100);

    // Calculate uniqueness
    const uniqueRows = new Set(dataset.values.map(row => JSON.stringify(row))).size;
    metrics.uniqueness = Math.round((uniqueRows / dataset.values.length) * 100);

    // Detect outliers in numeric columns
    const numericColumns = Object.entries(dataset.dataTypes || {})
      .filter(([_, type]) => type === 'quantitative')
      .map(([field]) => field);

    let outlierCount = 0;
    numericColumns.forEach(column => {
      const values = dataset.values?.map(row => row[column]).filter(v => !isNaN(v)) || [];
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const std = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length);
      outlierCount += values.filter(v => Math.abs(v - mean) > 3 * std).length;
    });
    metrics.outliers = outlierCount;

    return metrics;
  };

  const metrics = calculateQualityMetrics();

  const handleCleanData = () => {
    const cleanedData = {
      ...dataset,
      values: dataset.values?.map(row => {
        const cleaned = { ...row };
        Object.entries(cleaned).forEach(([key, value]) => {
          // Remove leading/trailing whitespace from strings
          if (typeof value === 'string') {
            cleaned[key] = value.trim();
          }
          // Convert empty strings to null
          if (value === '') {
            cleaned[key] = null;
          }
        });
        return cleaned;
      })
    };
    onDatasetUpdate(cleanedData);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.accordion}>
        <button 
          className={`${styles.accordionHeader} ${accordionStates.quality ? styles.open : ''}`}
          onClick={() => toggleAccordion('quality')}
        >
          Data Quality
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className={`${styles.accordionContent} ${accordionStates.quality ? styles.open : ''}`}>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{metrics.completeness}%</div>
            <div className={styles.metricLabel}>Data Completeness</div>
          </div>
          <div className={styles.metricCard}>
              <div className={styles.metricValue}>{metrics.uniqueness}%</div>
              <div className={styles.metricLabel}>Row Uniqueness</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>{metrics.outliers}</div>
            <div className={styles.metricLabel}>Potential Outliers</div>
          </div>
          <button className={styles.actionButton} onClick={handleCleanData}>
            Clean Data
          </button>
        </div>
      </div>

      <div className={styles.accordion}>
        <button 
          className={`${styles.accordionHeader} ${accordionStates.transformations ? styles.open : ''}`}
          onClick={() => toggleAccordion('transformations')}
        >
          Suggested Transformations
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className={`${styles.accordionContent} ${accordionStates.transformations ? styles.open : ''}`}>
          {Object.entries(dataset.dataTypes || {}).map(([field, type]) => (
            <div className={styles.metricCard} key={field}>
              <div className={styles.metricLabel}>{field}</div>
              {type === 'quantitative' && (
                <button className={styles.actionButton} onClick={() => {
                  const transformed = {
                    ...dataset,
                    values: dataset.values?.map(row => ({
                      ...row,
                      [`${field}_log`]: Math.log(Math.max(row[field], 1))
                    }))
                  };
                  onDatasetUpdate(transformed);
                }}>
                  Add Log Transform
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.accordion}>
        <button 
          className={`${styles.accordionHeader} ${accordionStates.lineage ? styles.open : ''}`}
          onClick={() => toggleAccordion('lineage')}
        >
          Data Lineage
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className={`${styles.accordionContent} ${accordionStates.lineage ? styles.open : ''}`}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Original Source</div>
            <div className={styles.metricValue}>{dataset.source || 'Unknown'}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Last Modified</div>
            <div className={styles.metricValue}>
              {dataset.uploadDate ? new Date(dataset.uploadDate).toLocaleString() : 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 