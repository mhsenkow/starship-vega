import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './Preview.module.css';
import { renderVegaLite } from '../../utils/chartRenderer'
import { ChartFooter } from './ChartFooter'
import { TopLevelSpec } from 'vega-lite'
import { ExtendedSpec } from '../../types/vega'
import { enhanceChartSpec } from '../../utils/chartEnhancements'
import { Tooltip } from '../../design-system'
import { Button, ButtonGroup } from '../../design-system/components/ButtonSystem'
import { 
  DownloadIcon, 
  WidthNormalIcon, 
  WidthMediumIcon, 
  WidthWideIcon, 
  InfoIcon 
} from '../common/Icons'
import { useThemeContext } from '../../styles/ThemeProvider.module'

// Aspect ratio definitions
const ASPECT_RATIOS = [
  { name: 'Free', width: 0, height: 0, description: 'Free aspect ratio' },
  { name: 'Square', width: 1, height: 1, description: 'Square (1:1)' },
  { name: '16:9', width: 16, height: 9, description: 'Widescreen (16:9)' },
  { name: '4:5', width: 4, height: 5, description: 'Portrait (4:5)' },
  { name: '9:16', width: 9, height: 16, description: 'Vertical (9:16)' },
  { name: '1.91:1', width: 1.91, height: 1, description: 'Facebook/Instagram (1.91:1)' },
  { name: '3:2', width: 3, height: 2, description: 'Photo (3:2)' },
  { name: '2.35:1', width: 2.35, height: 1, description: 'Cinematic (2.35:1)' }
];

interface AspectRatio {
  name: string;
  width: number;
  height: number;
  description: string;
}

// Helper function to get chart type from spec
const getChartType = (spec: any): string => {
  if (!spec || !spec.mark) return 'unknown';
  
  if (typeof spec.mark === 'string') {
    return spec.mark;
  }
  
  if (typeof spec.mark === 'object' && spec.mark.type) {
    return spec.mark.type;
  }
  
  return 'unknown';
};

interface PreviewProps {
  spec: string | TopLevelSpec | ExtendedSpec;
  renderKey?: number;
  onVegaViewUpdate?: (view: any) => void;
}

// Define InlineData interface
interface InlineData {
  values: any[];
  [key: string]: any;
}

export const Preview = ({ spec, renderKey = 0, onVegaViewUpdate }: PreviewProps) => {
  const [chartHeight, setChartHeight] = useState(400)
  const [chartWidth, setChartWidth] = useState<string>('medium')
  const [, setIsResizing] = useState(false)
  const isResizingRef = useRef(false)
  const [initialY, setInitialY] = useState(0)
  const [initialHeight, setInitialHeight] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null)
  const chartContentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentViewRef = useRef<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)
  const [chartActive, setChartActive] = useState(false)
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(ASPECT_RATIOS[0])
  const [parsedSpec, setParsedSpec] = useState<any>(null)
  const [isDataSampled, setIsDataSampled] = useState(false)
  const [originalDataLength, setOriginalDataLength] = useState<number | null>(null)
  const [sampledDataLength, setSampledDataLength] = useState<number | null>(null)
  const [sampleSize, setSampleSize] = useState(1000);

  // Get current theme to detect theme changes
  const { mode: currentTheme } = useThemeContext();

  // Debug chartHeight changes
  useEffect(() => {
    console.log('chartHeight state changed to:', chartHeight);
  }, [chartHeight]);

  // Helper function to check if spec is valid for rendering
  const isValidSpec = (spec: any) => {
    if (!spec || typeof spec !== 'object') return false;
    
    const hasData = spec.data || spec.datasets;
    const hasMark = spec.mark || spec.layer || spec.concat || spec.facet || spec.repeat;
    
    return hasData && hasMark;
  };
  const previousThemeRef = useRef(currentTheme);
  
  // Ref to track timeouts for cleanup
  const timeoutRefs = useRef<Set<NodeJS.Timeout>>(new Set());
  
  // Refs to track current values for reliable access in callbacks
  const selectedRatioRef = useRef(selectedRatio);
  const chartWidthRef = useRef(chartWidth);

  // Parse the input spec
  useEffect(() => {
    try {
      const specObj = typeof spec === 'string' ? JSON.parse(spec) : spec;
      setParsedSpec(specObj);
      
      // Check if data exists and store original length
      if (specObj?.data?.values) {
        setOriginalDataLength(specObj.data.values.length);
      } else {
        setOriginalDataLength(null);
      }
    } catch (e) {
      console.error('Error parsing spec:', e);
      setError(e instanceof Error ? e.message : 'Failed to parse spec');
    }
  }, [spec]);

  // Update refs when values change
  useEffect(() => {
    selectedRatioRef.current = selectedRatio;
  }, [selectedRatio]);

  useEffect(() => {
    chartWidthRef.current = chartWidth;
  }, [chartWidth]);

  // Function to render the chart
  const renderChart = useCallback(async () => {
    if (!chartContentRef.current || !parsedSpec) {
      return;
    }

    // Check if spec is valid for rendering
    if (!isValidSpec(parsedSpec)) {
      // Don't set error for empty specs - this is normal when first loading
      if (Object.keys(parsedSpec).length === 0) {
        setError(null);
      } else {
        const errorMsg = parsedSpec.data ? 
          'Chart specification is missing required mark property' : 
          'Chart specification is missing required data property';
        console.error(errorMsg);
        setError(errorMsg);
      }
      return;
    }

    if (currentViewRef.current) {
      try {
        currentViewRef.current.finalize();
        currentViewRef.current = null;
      } catch (e) {
        console.error('Error finalizing existing view:', e);
      }
    }
     
    try {
      // Clear previous content safely
      chartContentRef.current.innerHTML = '';
      
      // Apply data sampling for large datasets
      const chartType = getChartType(parsedSpec);
      const originalData = parsedSpec.data?.values;
      let renderSpec;
      
      // Get container dimensions for proper sizing - use fallback values if container isn't ready
      let containerWidth = 400;
      let containerHeight = 400;
      
      if (chartContentRef.current) {
        const rect = chartContentRef.current.getBoundingClientRect();
        const chartRect = chartRef.current?.getBoundingClientRect();
        
        // Use the ChartContainer dimensions if available, otherwise use ChartContent
        const parentRect = chartRect && chartRect.height > 0 ? chartRect : rect;
        
        if (parentRect && parentRect.width > 0 && parentRect.height > 0) {
          // Use the actual container width since we're controlling it at the container level
          containerWidth = Math.max(300, parentRect.width - 32); // Account for padding
          containerHeight = Math.max(200, parentRect.height - 32);
          
          console.log('Chart width calculation:', {
            chartWidth,
            containerWidth,
            parentRectWidth: parentRect.width
          });
        } else {
          // Use chartHeight state as fallback for height
          const fallbackHeight = chartHeight || 400;
          containerWidth = Math.max(300, (chartRef.current?.clientWidth || 400) - 32);
          containerHeight = Math.max(200, fallbackHeight - 32);
          
          console.log('Chart width calculation (fallback):', {
            chartWidth,
            containerWidth,
            fallbackHeight
          });
        }
      }
      
      
      // Check if the dataset is large and apply sampling
      if (originalData && originalData.length > 1000) {
        
        // Apply enhancements including sampling
        renderSpec = enhanceChartSpec({
          ...parsedSpec,
          width: containerWidth,
          height: containerHeight,
          autosize: {
            type: 'fit',
            contains: 'padding'
          },
          config: {
            ...(parsedSpec.config || {}),
            _forceNewView: renderKey, // This will cause Vega to create a new View
            sampleSize: sampleSize // Add sampleSize to config
          }
        }, chartType as any, sampleSize);
        
        // Check if sampling was applied with proper type casting
        const inlineData = renderSpec.data as InlineData;
        const sampledData = inlineData?.values;
        const wasSampled = sampledData && originalData && sampledData.length < originalData.length;
        setIsDataSampled(wasSampled);
        
        if (wasSampled && sampledData) {
          setSampledDataLength(sampledData.length);
          // console.log(`Dataset sampled from ${originalData.length} to ${sampledData.length} points`);
        } else {
          setSampledDataLength(null);
        }
      } else {
        // For smaller datasets, no sampling needed
        renderSpec = {
          ...parsedSpec,
          width: containerWidth,
          height: containerHeight,
          autosize: {
            type: 'fit',
            contains: 'padding'
          },
          config: {
            ...(parsedSpec.config || {}),
            _forceNewView: renderKey,
            sampleSize: sampleSize // Add sampleSize to config
          }
        };
        setIsDataSampled(false);
        setSampledDataLength(null);
      }
      
      // console.log('Rendering chart with spec:', renderSpec);
      
      // Set chart type data attribute for styling
      if (chartRef.current) {
        chartRef.current.setAttribute('data-chart-type', chartType);
      }
      
      // Render the chart and get the view
      const view = await renderVegaLite(chartContentRef.current, renderSpec);
      
      // Store the view reference
      currentViewRef.current = view;
      
      // If view is available, update state and callback
      if (view) {
        // console.log('Vega view successfully created');
        setChartActive(true);
        
        // If callback is provided, pass the view
        if (onVegaViewUpdate) {
          // console.log('Updating Vega view reference in parent component');
          onVegaViewUpdate(view);
        }
      } else {
        console.warn('renderVegaLite returned no view');
        
        // Reset the view reference in parent if no view is available
        if (onVegaViewUpdate) {
          onVegaViewUpdate(null);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error rendering chart:', err);
      setError(err instanceof Error ? err.message : 'Failed to render chart');
      
      // Reset the view if there's an error
      currentViewRef.current = null;
      if (onVegaViewUpdate) {
        onVegaViewUpdate(null);
      }
    }
  }, [parsedSpec, onVegaViewUpdate, sampleSize]);

  // Ensure chart is rendered when component mounts or spec changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // console.log('Initial chart render');
      renderChart().then(() => {
        // Automatically activate the chart when it's rendered
        if (currentViewRef.current) {
          setChartActive(true);
          if (onVegaViewUpdate) {
            // console.log('Auto-activating chart and updating parent view reference');
            onVegaViewUpdate(currentViewRef.current);
          }
        }
      });
    }, 200); // Slightly longer timeout to ensure DOM is ready
    
    // Track timeout for cleanup
    timeoutRefs.current.add(timeoutId);
    
    return () => {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(timeoutId);
    };
  }, [parsedSpec, sampleSize]); // Remove renderChart and onVegaViewUpdate from dependencies

  // Listen for theme changes and re-render chart
  useEffect(() => {
    if (previousThemeRef.current !== currentTheme) {
      previousThemeRef.current = currentTheme;
      
      // Re-render chart with new theme
      const timeoutId = setTimeout(() => {
        renderChart().then(() => {
          if (currentViewRef.current && onVegaViewUpdate) {
            onVegaViewUpdate(currentViewRef.current);
          }
        });
      }, 100); // Small delay to ensure theme is fully applied
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentTheme]); // Remove renderChart and onVegaViewUpdate from dependencies

  // Listen for color set changes and re-render chart
  useEffect(() => {
    const handleColorSetChange = () => {
      // Re-render chart with new color set
      const timeoutId = setTimeout(() => {
        renderChart().then(() => {
          if (currentViewRef.current && onVegaViewUpdate) {
            onVegaViewUpdate(currentViewRef.current);
          }
        });
      }, 150); // Slightly longer delay to ensure color set is fully applied
      
      return () => clearTimeout(timeoutId);
    };

    // Listen for color set changes
    window.addEventListener('vega-color-set-changed', handleColorSetChange);
    
    return () => {
      window.removeEventListener('vega-color-set-changed', handleColorSetChange);
    };
  }, []); // Remove renderChart and onVegaViewUpdate from dependencies

  // Add a separate effect to ensure chart is re-rendered when renderKey changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      renderChart().then(() => {
        // Auto-activate on re-render as well
        if (currentViewRef.current) {
          setChartActive(true);
          if (onVegaViewUpdate) {
            onVegaViewUpdate(currentViewRef.current);
          }
        }
      });
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [renderKey]); // Remove renderChart and onVegaViewUpdate from dependencies

  // Handle resize
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        renderChart();
      });
    });

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []); // Remove renderChart dependency to avoid infinite loops

  const updateHeightForRatio = useCallback(() => {
    const currentRatio = selectedRatioRef.current;
    const currentChartWidth = chartWidthRef.current;
    
    console.log('updateHeightForRatio called', {
      ratioName: currentRatio.name,
      ratioWidth: currentRatio.width,
      ratioHeight: currentRatio.height,
      chartWidth: currentChartWidth,
      containerExists: !!containerRef.current,
      chartExists: !!chartRef.current,
      actualChartWidth: containerRef.current?.clientWidth
    });
    
    if (currentRatio.width === 0) {
      console.log('Skipping - ratio width is 0 (Free mode)');
      return;
    }
    
    if (!containerRef.current) {
      console.log('Skipping - containerRef not available');
      return;
    }
    
    // Get the actual chart container width (which is now controlled by the width setting)
    const actualChartWidth = containerRef.current.clientWidth;
    console.log('Actual chart container width:', actualChartWidth);
    
    // Calculate height based on the aspect ratio
    if (actualChartWidth > 0) {
      const newHeight = (actualChartWidth * currentRatio.height) / currentRatio.width;
      const constrainedHeight = Math.min(1200, Math.max(200, newHeight));
      console.log(`Aspect ratio update: ${currentRatio.name}, width: ${actualChartWidth}, calculated height: ${constrainedHeight}`);
      console.log('Setting chartHeight to:', constrainedHeight);
      setChartHeight(constrainedHeight);
    } else {
      console.log('Skipping - actualChartWidth is 0 or negative');
    }
  }, [selectedRatio, chartWidth]);

  useEffect(() => {
    if (selectedRatio.width > 0) {
      // Immediate update
      updateHeightForRatio();
      
      // Also set up a ResizeObserver to watch for container size changes
      const resizeObserver = new ResizeObserver(() => {
        updateHeightForRatio();
      });
      
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [selectedRatio]);

  // Also update height when chart width changes
  useEffect(() => {
    if (selectedRatio.width > 0) {
      updateHeightForRatio();
    }
  }, [chartWidth]);

  useEffect(() => {
    if (selectedRatio.width === 0) return;

    const handleResize = () => {
      updateHeightForRatio();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedRatio]);

  // Effect to trigger chart re-render when chart width changes
  useEffect(() => {
    // Debounce the re-render to avoid excessive updates
    const timeoutId = setTimeout(() => {
      renderChart();
      
      // Also update aspect ratio if one is selected
      if (selectedRatio.width > 0) {
        // Use a longer delay to ensure the container width has updated
        setTimeout(() => {
          updateHeightForRatio();
        }, 50);
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [chartWidth]); // Re-render when width setting changes

  // Effect to trigger chart re-render when chart height changes due to aspect ratio
  useEffect(() => {
    if (selectedRatio.width > 0) {
      // Debounce the re-render to avoid excessive updates
      const timeoutId = setTimeout(() => {
        renderChart();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [chartHeight]); // Only depend on chartHeight to avoid infinite loops

  const handleDownloadSVG = useCallback(() => {
    if (!chartRef.current) return;

    // Find the SVG element
    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;

    // Clone the SVG to avoid modifying the displayed one
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    
    // Add any missing namespaces
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    // Create a blob from the SVG
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart.svg';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadPNG = useCallback(async () => {
    if (!chartRef.current) return;

    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;

    // Create a canvas with the same dimensions
    const canvas = document.createElement('canvas');
    const bbox = svgElement.getBoundingClientRect();
    canvas.width = bbox.width;
    canvas.height = bbox.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Convert SVG to data URL
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Create image and draw to canvas
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL('image/png');
      
      // Download PNG
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'chart.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const handleDownloadJSON = useCallback(() => {
    if (!parsedSpec) return;
    
    // Convert the spec to a string
    const jsonString = JSON.stringify(parsedSpec, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chart-spec.json';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [parsedSpec]);


  const handleChartWidthChange = (newValue: string) => {
    console.log('Width button clicked:', newValue);
    console.log('Current selectedRatio:', selectedRatio);
    setChartWidth(newValue);
    localStorage.setItem('chartWidth', newValue);
    // Trigger a resize to update the chart
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow manual resizing if aspect ratio is set to "Free"
    if (selectedRatio.width !== 0) {
      e.preventDefault();
      return;
    }
    
    setIsResizing(true);
    isResizingRef.current = true;
    setInitialY(e.clientY);
    setInitialHeight(chartHeight);
    document.body.style.cursor = 'ns-resize';
    
    // Define the handlers outside the mousedown event to ensure proper cleanup
    function handleMouseMove(e: MouseEvent) {
      if (!isResizingRef.current) return;
      const delta = e.clientY - initialY;
      const newHeight = Math.max(200, Math.min(1200, initialHeight + delta));
      setChartHeight(newHeight);
      
      // Force chart to redraw when resizing is happening
      if (chartRef.current) {
        chartRef.current.style.height = `${newHeight}px`;
      }
    }
    
    function handleMouseUp() {
      setIsResizing(false);
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Force chart to redraw after resize is complete
      window.dispatchEvent(new Event('resize'));
      
      // Force vega chart to redraw specifically
      renderChart();
    }
    
    // Add event listeners to document to catch events outside the component
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Prevent default behavior to avoid text selection during resize
    e.preventDefault();
  };

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear all timeouts
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current.clear();
      
      // Clean up Vega view
      if (currentViewRef.current) {
        try {
          currentViewRef.current.finalize();
        } catch (e) {
          console.error('Error finalizing view on cleanup:', e);
        }
      }
      
      // Reset document cursor and ensure proper cleanup
      if (document.body) {
        document.body.style.cursor = '';
      }
      
      // Ensure cursor is reset if component unmounts during resizing
      if (isResizingRef.current) {
        isResizingRef.current = false;
        setIsResizing(false);
      }
    };
  }, []);

  return (
    <div className={styles.previewContainer} ref={containerRef}>
      <div className={styles.aspectRatioControl}>
        <div className={styles.ratioContainer}>
          <ButtonGroup buttonStyle="embedded">
            {ASPECT_RATIOS.map((ratio) => (
              <Tooltip key={ratio.name} title={ratio.description}>
                <Button
                  variant={selectedRatio.name === ratio.name ? 'primary' : 'ghost'}
                  size="small"
                  buttonStyle="embedded"
                  onClick={() => {
                    console.log('Aspect ratio button clicked:', ratio.name);
                    // Update the ref immediately so updateHeightForRatio can access the new value
                    selectedRatioRef.current = ratio;
                    setSelectedRatio(ratio);
                    
                    // Try to update immediately and with delayed attempts
                    updateHeightForRatio();
                    
                    // Use requestAnimationFrame to ensure DOM is updated
                    requestAnimationFrame(() => {
                      updateHeightForRatio();
                    });
                    
                    // Also try with a slight delay as backup
                    setTimeout(() => {
                      updateHeightForRatio();
                    }, 100);
                  }}
                >
                  {ratio.name}
                </Button>
              </Tooltip>
            ))}
          </ButtonGroup>
        </div>
        
        <div className={styles.widthToggleContainer}>
          <span>Width:</span>
          <ButtonGroup buttonStyle="embedded">
            <Button
              variant={chartWidth === "narrow" ? 'primary' : 'ghost'}
              size="small"
              buttonStyle="embedded"
              onClick={() => handleChartWidthChange("narrow")}
              aria-label="narrow width"
            >
              <WidthNormalIcon />
            </Button>
            <Button
              variant={chartWidth === "medium" ? 'primary' : 'ghost'}
              size="small"
              buttonStyle="embedded"
              onClick={() => handleChartWidthChange("medium")}
              aria-label="medium width"
            >
              <WidthMediumIcon />
            </Button>
            <Button
              variant={chartWidth === "wide" ? 'primary' : 'ghost'}
              size="small"
              buttonStyle="embedded"
              onClick={() => handleChartWidthChange("wide")}
              aria-label="wide width"
            >
              <WidthWideIcon />
            </Button>
          </ButtonGroup>
        </div>
        
        <Button
          variant="icon"
          size="small"
          onClick={() => setShowDownloadMenu(!showDownloadMenu)}
          aria-label="Download chart"
        >
          <DownloadIcon />
        </Button>
        
        <div className={styles.downloadMenu}>
          <div className={`${styles.downloadOptions} ${showDownloadMenu ? styles.show : ''}`}>
            <Button
              variant="ghost"
              size="small"
              onClick={handleDownloadSVG}
            >
              SVG Image
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleDownloadPNG}
            >
              PNG Image
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleDownloadJSON}
            >
              JSON Spec
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`${styles.chartContainer} ${chartActive ? styles.active : ''}`}
        ref={chartRef}
        onClick={() => !chartActive && setChartActive(true)}
        style={{ 
          '--chart-height': `${Math.max(400, chartHeight)}px`,
          height: 'var(--chart-height)',
          minHeight: '400px',
          width: chartWidth === 'narrow' ? '40%' : chartWidth === 'medium' ? '60%' : chartWidth === 'wide' ? '80%' : '60%',
          maxWidth: '100%',
          margin: '0 auto',
          flexShrink: 0
        } as React.CSSProperties}
        data-debug-height={chartHeight}
      >
        {isDataSampled && (
          <div className={styles.samplingIndicator} title={`Showing a sample of ${sampledDataLength} out of ${originalDataLength} data points for better performance`}>
            <InfoIcon size={16} />
            Showing sampled data for performance
          </div>
        )}
        
        {!isValidSpec(parsedSpec) && !error ? (
          <div className={styles.emptyStateMessage}>
            <h3>No Chart to Display</h3>
            <p>
              Select a dataset and chart type from the left panel to create a visualization.
            </p>
          </div>
        ) : error ? (
          <div className={styles.emptyStateMessage}>
            <h3>Chart Error</h3>
            <p>{error}</p>
          </div>
        ) : (
          <div className={styles.chartContent} ref={chartContentRef} />
        )}
      </div>

      <div
        className={`${styles.resizeHandle} ${selectedRatio.width !== 0 ? styles.disabled : ''}`}
        onMouseDown={handleMouseDown}
        title={selectedRatio.width !== 0 ? "Manual resize disabled - aspect ratio locked" : "Drag to resize chart"}
      />

      <div className={styles.dataContainer}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        <ChartFooter
          data={parsedSpec?.data?.values}
          spec={parsedSpec}
          sampleSize={sampleSize}
          onSampleSizeChange={(newSize) => {
            // console.log(`Preview: Changing sample size from ${sampleSize} to ${newSize}`);
            setSampleSize(newSize);
            
            // Ensure we're not in resize mode when changing sample size
            if (isResizingRef.current) {
              isResizingRef.current = false;
              setIsResizing(false);
              document.body.style.cursor = '';
            }
            
            // Use setTimeout to ensure state is updated before re-rendering
            setTimeout(() => {
              // Force re-render with the new sample size
              renderChart();
            }, 0);
          }}
        />
      </div>
    </div>
  )
}
