import React, { useEffect, useRef, useState } from 'react';
import { DashboardChart as DashboardChartType } from '../../types/dashboard';
import { renderVegaLite } from '../../utils/chartRenderer';
import { DeleteOutlineIcon, InfoIcon } from '../common/Icons';
import { DatasetInfoPanel } from '../Chart/DatasetInfoPanel';
import { getDataset } from '../../utils/indexedDB';
import { DataAsset } from '../../types/dataset';
import { useThemeContext } from '../../styles/ThemeProvider.module';
import styles from './DashboardChart.module.css';

interface DashboardChartProps {
  chart: DashboardChartType;
  onRemove: (id: string) => void;
}

export const DashboardChart: React.FC<DashboardChartProps> = ({ 
  chart, 
  onRemove 
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [dataset, setDataset] = useState<DataAsset | null>(null);
  
  // Get current theme to detect theme changes
  const { mode: currentTheme } = useThemeContext();
  const previousThemeRef = useRef(currentTheme);
  
  // Effect to render the chart
  useEffect(() => {
    if (chartRef.current && chart.snapshot?.spec) {
      try {
        renderVegaLite(chartRef.current, chart.snapshot.spec)
          .catch(error => console.error('Failed to render chart:', error));
      } catch (error) {
        console.error('Failed to render chart:', error);
      }
    }
  }, [chart]);
  
  // Listen for theme changes and re-render chart
  useEffect(() => {
    if (previousThemeRef.current !== currentTheme && chartRef.current && chart.snapshot?.spec) {
      console.log(`DashboardChart: Theme changed from ${previousThemeRef.current} to ${currentTheme}, re-rendering chart`);
      previousThemeRef.current = currentTheme;
      
      // Re-render chart with new theme
      setTimeout(() => {
        try {
          renderVegaLite(chartRef.current!, chart.snapshot.spec)
            .catch(error => console.error('Failed to re-render chart after theme change:', error));
        } catch (error) {
          console.error('Failed to re-render chart after theme change:', error);
        }
      }, 100); // Small delay to ensure theme is fully applied
    }
  }, [currentTheme, chart.snapshot?.spec]);
  
  // Listen for color set changes and re-render chart
  useEffect(() => {
    const handleColorSetChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log(`DashboardChart: Color set changed, re-rendering chart`, customEvent.detail);
      
      if (chartRef.current && chart.snapshot?.spec) {
        // Re-render chart with new color set
        setTimeout(() => {
          try {
            renderVegaLite(chartRef.current!, chart.snapshot.spec)
              .catch(error => console.error('Failed to re-render chart after color set change:', error));
          } catch (error) {
            console.error('Failed to re-render chart after color set change:', error);
          }
        }, 150); // Slightly longer delay to ensure color set is fully applied
      }
    };

    // Listen for color set changes
    window.addEventListener('vega-color-set-changed', handleColorSetChange);
    
    return () => {
      window.removeEventListener('vega-color-set-changed', handleColorSetChange);
    };
  }, [chart.snapshot?.spec]);
  
  // Effect to load dataset metadata
  useEffect(() => {
    const loadDataset = async () => {
      if (chart.snapshot?.datasetId) {
        try {
          const datasetData = await getDataset(chart.snapshot.datasetId);
          setDataset(datasetData);
        } catch (error) {
          console.error('Failed to load dataset:', error);
          
          // If we have embedded metadata in the snapshot, use that instead
          if (chart.snapshot.datasetMetadata) {
            setDataset(chart.snapshot.datasetMetadata as DataAsset);
          }
        }
      } else if (chart.snapshot?.datasetMetadata) {
        // Use embedded metadata
        setDataset(chart.snapshot.datasetMetadata as DataAsset);
      }
    };
    
    loadDataset();
  }, [chart]);
  
  const handleToggleMetadata = () => {
    setShowMetadata(!showMetadata);
  };
  
  return (
    <div className={`${styles.chartCard} ${styles[currentTheme] || ''}`}>
      <div className={styles.chartHeader}>
        <div className={styles.chartTitle}>{chart.snapshot?.name || 'Unnamed Chart'}</div>
        <div className={styles.chartActions}>
          {(dataset || chart.snapshot?.datasetMetadata) && (
            <button 
              className={styles.actionButton}
              onClick={handleToggleMetadata}
              title={showMetadata ? "Hide dataset info" : "Show dataset info"}
            >
              <InfoIcon size={16} />
            </button>
          )}
          <button 
            className={`${styles.actionButton} ${styles.danger}`}
            onClick={() => onRemove(chart.id)}
            title="Remove chart"
          >
            <DeleteOutlineIcon size={16} />
          </button>
        </div>
      </div>
      <div className={styles.chartContent}>
        <div className={styles.chartContainer} ref={chartRef} />
        {showMetadata && dataset && (
          <div className={styles.chartMetadata}>
            <DatasetInfoPanel dataset={dataset} />
          </div>
        )}
      </div>
    </div>
  );
}; 