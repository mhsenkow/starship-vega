import { useEffect, useRef, useState } from 'react';
import { TopLevelSpec } from 'vega-lite';
import { renderVegaLite } from '../../../utils/chartRenderer';
import { PreviewContainer, LoadingOverlay, Container } from './styles';
import { DataTable } from '../DataTable';

interface ChartPreviewProps {
  spec: TopLevelSpec;
  width?: number;
  height?: number;
  mode?: 'gallery' | 'editor';
  showDataTable?: boolean;
}

export const ChartPreview = ({ 
  spec, 
  width, 
  height,
  mode = 'editor',
  showDataTable = mode === 'editor'
}: ChartPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current || !spec) return;
      
      try {
        setIsLoading(true);
        setError(null);

        const finalSpec = {
          ...spec,
          width: mode === 'gallery' ? width : 'container',
          height: mode === 'gallery' ? height : 'container',
          autosize: { type: 'fit', contains: 'padding', resize: true },
          background: 'white',
          config: {
            ...spec.config,
            view: { stroke: 'transparent' }
          }
        };

        await renderVegaLite(containerRef.current, finalSpec, {
          mode,
          actions: mode === 'editor'
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render chart');
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [spec, width, height, mode]);

  return (
    <Container>
      <PreviewContainer 
        ref={containerRef} 
        $height={height}
        $mode={mode}
      >
        {isLoading && <LoadingOverlay>Loading...</LoadingOverlay>}
        {error && <LoadingOverlay>{error}</LoadingOverlay>}
      </PreviewContainer>
      {showDataTable && <DataTable data={spec.data?.values || []} />}
    </Container>
  );
}; 