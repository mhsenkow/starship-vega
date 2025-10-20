import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ChartStyle } from '../../types/chart';
import { renderVegaLite } from '../../utils/chartRenderer';
import { determineChartEncodings, generateRandomEncoding } from '../../utils/chartAdapters';
import { MarkType, ExtendedSpec, ChartEncoding } from '../../types/vega';
import { ErrorBoundary } from '../ErrorBoundary';
import { enhanceChartSpec } from '../../utils/chartEnhancements';
import { exportChartWithMetadata } from '../../utils/exportImport';
import { DatasetMetadata } from '../../types/dataset';
import { detectDataTypes } from '../../utils/dataUtils';
import { useThemeContext } from '../../styles/ThemeProvider.module';
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem';
import styles from './ChartDisplay.module.css';

interface ChartDisplayProps {
  chartType: MarkType;
  dataset: {
    values: Record<string, unknown>[];
    id?: string;
    [key: string]: unknown;
  };
  encoding: ChartEncoding | null;
  style?: Partial<ChartStyle>;
}

/**
 * Adapter function to transform partial dataset to format expected by chart utilities
 */
const createDatasetAdapter = (dataset: ChartDisplayProps['dataset']): DatasetMetadata => {
  return {
    id: dataset.id || 'temp-id',
    name: 'display-dataset',
    values: dataset.values,
    createdAt: new Date().toISOString(),
    dataTypes: detectDataTypes(dataset.values)
  };
};

/**
 * Prepare data for random encoding generation
 */
const prepareDataForRandomEncoding = (dataset: ChartDisplayProps['dataset']): [string, string][] => {
  const dataTypes = detectDataTypes(dataset.values);
  return Object.entries(dataTypes);
};

export const ChartDisplay = ({ chartType, dataset, encoding, style }: ChartDisplayProps) => {
  const [spec, setSpec] = useState<ExtendedSpec | null>(null);
  const [encodings, setEncodings] = useState<ChartEncoding | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDataSampled, setIsDataSampled] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTimeout = useRef<number | undefined>(undefined);

  // Get current theme to detect theme changes
  const { mode: currentTheme } = useThemeContext();
  const previousThemeRef = useRef(currentTheme);

  // Memoize the base spec to prevent unnecessary recalculations
  const baseSpec = useMemo<ExtendedSpec>(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: { values: dataset?.values || [] },
    mark: { type: chartType },
    width: 'container',
    height: 300
  }), [chartType, dataset?.values]);

  const generateSpec = useCallback((encodingConfig: ChartEncoding | null) => {
    if (!dataset?.values?.length || !chartType) return;
    
    // Create a proper dataset adapter for the chart utilities
    const datasetAdapter = createDatasetAdapter(dataset);

    // Get the encodings using the adapter
    const finalEncodings = encodingConfig || determineChartEncodings(chartType, datasetAdapter);
    
    // Create the spec with encodings
    const fullSpec = { ...baseSpec, encoding: finalEncodings };
    
    // Apply chart enhancements including data sampling for large datasets
    const enhancedSpec = enhanceChartSpec(fullSpec, chartType);
    
    // Check if data was sampled by comparing array lengths
    const originalLength = dataset?.values?.length || 0;
    const enhancedValues = (enhancedSpec.data as any)?.values;
    const enhancedLength = Array.isArray(enhancedValues) ? enhancedValues.length : 0;
    setIsDataSampled(originalLength > 0 && enhancedLength > 0 && originalLength !== enhancedLength);
    
    setSpec(enhancedSpec);
  }, [chartType, dataset, baseSpec]);

  // Update spec when encodings change
  useEffect(() => {
    generateSpec(encodings || encoding);
  }, [encodings, encoding, generateSpec]);

  // Debounced chart rendering
  const renderChart = useCallback(() => {
    if (!chartRef.current || !spec) return;

    if (renderTimeout.current) {
      window.clearTimeout(renderTimeout.current);
    }

    renderTimeout.current = window.setTimeout(() => {
      renderVegaLite(chartRef.current!, spec, { style })
        .catch(error => console.error('Failed to render chart:', error));
    }, 100);
  }, [spec, style]);

  useEffect(() => {
    renderChart();
    return () => {
      if (renderTimeout.current) {
        window.clearTimeout(renderTimeout.current);
      }
    };
  }, [renderChart]);

  // Listen for theme changes and re-render chart
  useEffect(() => {
    if (previousThemeRef.current !== currentTheme) {
      console.log(`ChartDisplay: Theme changed from ${previousThemeRef.current} to ${currentTheme}, re-rendering chart`);
      previousThemeRef.current = currentTheme;
      
      // Re-render chart with new theme
      setTimeout(() => {
        renderChart();
      }, 100); // Small delay to ensure theme is fully applied
    }
  }, [currentTheme, renderChart]);

  // Listen for color set changes and re-render chart
  useEffect(() => {
    const handleColorSetChange = (event: CustomEvent) => {
      console.log(`ChartDisplay: Color set changed, re-rendering chart`, event.detail);
      
      // Re-render chart with new color set
      setTimeout(() => {
        renderChart();
      }, 150); // Slightly longer delay to ensure color set is fully applied
    };

    // Listen for color set changes
    window.addEventListener('vega-color-set-changed', handleColorSetChange as EventListener);
    
    return () => {
      window.removeEventListener('vega-color-set-changed', handleColorSetChange as EventListener);
    };
  }, [renderChart]);

  const handleRandomize = () => {
    // Prepare data in the format expected by generateRandomEncoding
    const fieldsWithTypes = prepareDataForRandomEncoding(dataset);
    
    // Call with the correct parameters: chartType, fields, and dataTypes
    const newEncodings = generateRandomEncoding(chartType, fieldsWithTypes.map(([field]) => field), dataTypes) as unknown as ChartEncoding;
    setEncodings(newEncodings);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const downloadChart = async (format: 'png' | 'svg' | 'json') => {
    if (!chartRef.current) return;
    
    const vegaView = (chartRef.current as any).__vegaMetadata__?.view;
    if (!vegaView) return;
    
    if (format === 'json') {
      try {
        // Use the enhanced export that includes dataset metadata
        const exportData = await exportChartWithMetadata(spec, dataset.id);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(exportData)}`;
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', dataUri);
        downloadLink.setAttribute('download', `chart-${Date.now()}.json`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (error) {
        console.error('Failed to export chart with metadata:', error);
        // Fallback to basic export if enhanced export fails
        const dataStr = JSON.stringify(spec, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', dataUri);
        downloadLink.setAttribute('download', `chart-${Date.now()}.json`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      return;
    }
    
    // Image exports (png, svg)
    vegaView.toImageURL(format).then((url: string) => {
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `chart-${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch((error: Error) => {
      console.error(`Failed to download chart as ${format}:`, error);
    });
  };

  if (!spec) {
    return <div>No chart specification available</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Failed to render chart</div>}>
      <div ref={containerRef} className={`${styles.chartContainer} ${isFullscreen ? styles.fullscreen : ''}`}>
        <div className={styles.chartControls}>
          <div className="control-group">
            <ButtonGroup buttonStyle="floating">
              <Button 
                variant="secondary"
                size="small"
                onClick={handleRandomize}
                title="Try different data combinations"
              >
                <span role="img" aria-label="dice">🎲</span>
                Explore Data
              </Button>
              <Button 
                variant="tertiary"
                size="small"
                onClick={() => setEncodings(null)}
                title="Reset to default view"
              >
                <span role="img" aria-label="reset">↺</span>
                Reset
              </Button>
            </ButtonGroup>
          </div>
          
          <div className="control-group">
            {isDataSampled && (
              <span className="data-info" title={`Showing a sample of the full dataset (${dataset?.values?.length} points) for performance`}>
                <span role="img" aria-label="sampled">📊</span> Sampled Data
              </span>
            )}
            <ButtonGroup buttonStyle="floating">
              <Button 
                variant="icon"
                size="small"
                iconOnly
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
              >
                <span role="img" aria-label="fullscreen">{isFullscreen ? '⊠' : '⤢'}</span>
              </Button>
              
              <Button 
                variant="tertiary"
                size="small"
                onClick={() => downloadChart('png')}
                title="Download as PNG"
              >
                <span role="img" aria-label="download">⬇️</span>
                PNG
              </Button>
              <Button 
                variant="tertiary"
                size="small"
                onClick={() => downloadChart('svg')}
                title="Download as SVG"
              >
                SVG
              </Button>
              <Button 
                variant="tertiary"
                size="small"
                onClick={() => downloadChart('json')}
                title="Download as JSON"
              >
                JSON
              </Button>
            </ButtonGroup>
          </div>
        </div>
        <div ref={chartRef} className={styles.chartWrapper} />
      </div>
    </ErrorBoundary>
  );
}; 