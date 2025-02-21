import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { renderVegaLite } from '../../utils/chartRenderer';
import { TopLevelSpec } from 'vega-lite';
import { DataTable } from './DataTable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const PreviewContainer = styled.div`
  flex: 1;
  min-height: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const ChartArea = styled.div`
  flex: 1;
  min-height: 0;
  position: relative;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const DataTableContainer = styled.div`
  border-top: 1px solid #e2e8f0;
  padding: 16px;
  background: white;
  max-height: 200px;
  overflow-y: auto;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  color: red;
`;

interface ChartPreviewProps {
  spec: TopLevelSpec;
  mode?: 'gallery' | 'editor';
  showDataTable?: boolean;
}

export const ChartPreview = ({ 
  spec, 
  mode = 'editor',
  showDataTable = mode === 'editor'
}: ChartPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<any>(null);
  const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null);

  // Cleanup function for Vega view and container
  useEffect(() => {
    return () => {
      if (view) {
        try {
          view.finalize();
          setView(null);
        } catch (e) {
          console.warn('Error finalizing view:', e);
        }
      }

      // Clean up container
      if (chartContainer) {
        try {
          while (chartContainer.firstChild) {
            chartContainer.removeChild(chartContainer.firstChild);
          }
        } catch (e) {
          console.warn('Error cleaning up container:', e);
        }
      }
    };
  }, [view, chartContainer]);

  useEffect(() => {
    let mounted = true;
    
    const renderChart = async () => {
      if (!containerRef.current || !spec) return;
      
      try {
        setIsLoading(true);
        setError(null);

        // Clean up previous view
        if (view) {
          try {
            view.finalize();
          } catch (e) {
            console.warn('Error finalizing previous view:', e);
          }
        }

        // Clean up container
        if (containerRef.current) {
          try {
            while (containerRef.current.firstChild) {
              containerRef.current.removeChild(containerRef.current.firstChild);
            }
          } catch (e) {
            console.warn('Error cleaning up container:', e);
          }
          setChartContainer(containerRef.current);
        }

        const processedSpec = {
          $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
          ...spec,
          width: mode === 'gallery' ? 300 : 'container',
          height: mode === 'gallery' ? 200 : 'container',
          autosize: { 
            type: 'fit', 
            contains: 'padding',
            resize: true 
          },
          config: {
            ...spec.config,
            mark: {
              ...spec.config?.mark,
              cursor: 'pointer'
            }
          }
        };

        if (mounted && containerRef.current) {
          const newView = await renderVegaLite(containerRef.current, processedSpec, {
            mode,
            actions: mode === 'editor'
          });
          if (mounted) {
            setView(newView);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Error rendering chart:', err);
          setError(err instanceof Error ? err.message : 'Failed to render chart');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      mounted = false;
    };
  }, [spec, mode]);

  return (
    <Container>
      <PreviewContainer>
        <ChartArea ref={containerRef}>
          {isLoading && <div>Loading...</div>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ChartArea>
      </PreviewContainer>
      {showDataTable && spec?.data?.values && (
        <DataTableContainer>
          <DataTable data={spec.data.values} />
        </DataTableContainer>
      )}
    </Container>
  );
}; 