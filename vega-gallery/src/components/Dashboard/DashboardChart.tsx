import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { DashboardChart as DashboardChartType } from '../../types/dashboard';
import { renderVegaLite } from '../../utils/chartRenderer';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import InfoIcon from '@mui/icons-material/Info';
import { DatasetInfoPanel } from '../Chart/DatasetInfoPanel';
import { getDataset } from '../../utils/indexedDB';
import { DataAsset } from '../../types/dataset';
import { getThemeSpecificChartStyles } from '../../utils/vegaThemes';
import { useTheme } from '../../styles/ThemeProvider';

const ChartCard = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 300px;
  position: relative;
  
  /* Apply theme-specific container styles */
  ${(props: any) => {
    const themeStyles = getThemeSpecificChartStyles();
    const containerStyle = themeStyles.containerStyle;
    
    if (containerStyle && Object.keys(containerStyle).length > 0) {
      return Object.entries(containerStyle)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`)
        .join(' ');
    }
    
    // Default fallback styling
    return `
      background-color: var(--color-surface);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    `;
  }}
`;

const ChartHeader = styled.div`
  padding: 12px 16px;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartTitle = styled.div`
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--color-text-primary);
`;

const ChartContent = styled.div`
  flex-grow: 1;
  position: relative;
  min-height: 250px;
  
  /* Make chart container properly sized */
  & > div {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Make Vega charts responsive */
  .vega-embed {
    width: 100% !important;
    height: 100% !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Ensure SVG expands to fill container */
  svg {
    width: 100% !important;
    height: 100% !important;
    max-width: 100%;
  }
`;

const MetadataContainer = styled.div`
  padding: 0 16px 16px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 4px;

  &:hover {
    background-color: var(--color-surfaceHover);
    color: var(--color-text-primary);
  }
`;

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
  const { mode: currentTheme } = useTheme();
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
    <ChartCard>
      <ChartHeader>
        <ChartTitle>{chart.snapshot?.name || 'Unnamed Chart'}</ChartTitle>
        <div>
          {(dataset || chart.snapshot?.datasetMetadata) && (
            <ActionButton 
              onClick={handleToggleMetadata}
              title={showMetadata ? "Hide dataset info" : "Show dataset info"}
            >
              <InfoIcon fontSize="small" />
            </ActionButton>
          )}
          <ActionButton 
            onClick={() => onRemove(chart.id)}
            title="Remove chart"
          >
            <DeleteOutlineIcon fontSize="small" />
          </ActionButton>
        </div>
      </ChartHeader>
      <ChartContent ref={chartRef} />
      
      {showMetadata && dataset && (
        <MetadataContainer>
          <DatasetInfoPanel dataset={dataset} />
        </MetadataContainer>
      )}
    </ChartCard>
  );
}; 