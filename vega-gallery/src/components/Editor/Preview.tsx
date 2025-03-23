import { useEffect, useRef, useState, useCallback } from 'react'
import styled from 'styled-components'
import { renderVegaLite } from '../../utils/chartRenderer'
import { ChartFooter } from './ChartFooter'
import { TopLevelSpec } from 'vega-lite'

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`

const ChartContainer = styled.div<{ $height: number }>`
  height: ${props => props.$height}px;
  min-height: 200px;
  position: relative;
  padding-bottom: 6px;
  width: 100%;
  
  /* Make the Vega chart responsive */
  .vega-embed {
    width: 100% !important;
    height: 100% !important;
  }
`

const DataContainer = styled.div`
  flex: 1;
  min-height: 150px;
  border-top: 1px solid #eee;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 6px;
`

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 16px;
  background: #fff5f5;
  border-radius: 4px;
  margin-top: 16px;
`

const ResizeHandle = styled.div`
  width: 100%;
  height: 12px;
  margin: -6px 0;
  background: transparent;
  cursor: ns-resize;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  position: relative;
  z-index: 10;

  &::after {
    content: '';
    width: 60px;
    height: 4px;
    background: ${props => props.theme.colors.border};
    border-radius: 2px;
    opacity: 0;
    transition: all 0.2s ease;
  }

  &:hover::after {
    opacity: 1;
    transform: scaleY(1.5);
  }

  &:active::after {
    opacity: 1;
    background: ${props => props.theme.colors.primary};
    transform: scaleY(1.5);
  }
`

interface AspectRatio {
  name: string;
  width: number;
  height: number;
  description: string;
}

const ASPECT_RATIOS: AspectRatio[] = [
  { name: 'Free', width: 0, height: 0, description: 'Freely resizable' },
  { name: 'Square', width: 1, height: 1, description: 'Instagram, Facebook' },
  { name: '16:9', width: 16, height: 9, description: 'YouTube, Twitter' },
  { name: '4:5', width: 4, height: 5, description: 'Instagram Feed' },
  { name: '9:16', width: 9, height: 16, description: 'Instagram Stories, TikTok' },
  { name: '1.91:1', width: 1910, height: 1000, description: 'Facebook Feed' },
  { name: '3:2', width: 3, height: 2, description: 'LinkedIn' },
  { name: '2.35:1', width: 2350, height: 1000, description: 'Twitter Card' },
];

const AspectRatioControl = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  overflow-x: auto;
`;

const RatioButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border: 1px solid ${props => props.$active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 4px;
  background: ${props => props.$active ? `${props.theme.colors.primary}10` : 'white'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.text.primary};
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }

  .description {
    font-size: 0.8rem;
    color: ${props => props.theme.text.secondary};
    margin-top: 2px;
  }
`;

interface PreviewProps {
  spec: string | TopLevelSpec;
}

export const Preview = ({ spec }: PreviewProps) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any[]>([])
  const [chartHeight, setChartHeight] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startY: 0, startHeight: 0 })
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(ASPECT_RATIOS[0])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragRef.current = {
      startY: e.clientY,
      startHeight: chartHeight
    }
    document.body.style.cursor = 'ns-resize'
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const delta = e.clientY - dragRef.current.startY
      const newHeight = Math.max(200, Math.min(800, dragRef.current.startHeight + delta))
      setChartHeight(newHeight)
      
      // Trigger immediate chart resize
      requestAnimationFrame(() => {
        renderChart()
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ''
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const renderChart = useCallback(async () => {
    if (!chartRef.current) return;
    
    try {
      const parsedSpec = typeof spec === 'string' ? JSON.parse(spec) : spec;
      
      // Ensure mark configuration is properly set
      const markConfig = typeof parsedSpec.mark === 'string' 
        ? { type: parsedSpec.mark } 
        : parsedSpec.mark;

      const validSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        ...parsedSpec,
        width: 'container',
        height: 'container',
        autosize: {
          type: 'fit',
          contains: 'padding',
          resize: true
        },
        mark: {
          ...markConfig,
          // Ensure required properties are set based on mark type
          ...(markConfig.type === 'point' && {
            filled: true,
            size: markConfig.size || 100,
            opacity: markConfig.opacity || 0.7
          }),
          ...(markConfig.type === 'line' && {
            point: markConfig.point || false,
            strokeWidth: markConfig.strokeWidth || 2
          }),
          ...(markConfig.type === 'area' && {
            opacity: markConfig.opacity || 0.6,
            line: markConfig.line || false
          })
        },
        config: {
          ...parsedSpec.config,
          view: {
            stroke: null,
            continuousWidth: 400,
            continuousHeight: 300
          },
          legend: {
            symbolLimit: 50,
            labelLimit: 200,
            columns: 2
          },
          mark: {
            ...parsedSpec.config?.mark,
            invalid: 'filter',
            tooltip: true
          }
        }
      };

      await renderVegaLite(chartRef.current, validSpec);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render chart');
    }
  }, [spec]);

  // Initial render
  useEffect(() => {
    renderChart();
  }, [renderChart]);

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
  }, [renderChart]);

  const updateHeightForRatio = useCallback(() => {
    if (selectedRatio.width === 0 || !containerRef.current) return;
    
    const containerWidth = containerRef.current.clientWidth;
    const newHeight = (containerWidth * selectedRatio.height) / selectedRatio.width;
    setChartHeight(Math.min(1200, Math.max(200, newHeight)));
  }, [selectedRatio]);

  useEffect(() => {
    if (selectedRatio.width > 0) {
      updateHeightForRatio();
    }
  }, [selectedRatio, updateHeightForRatio]);

  useEffect(() => {
    if (selectedRatio.width === 0) return;

    const handleResize = () => {
      updateHeightForRatio();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedRatio, updateHeightForRatio]);

  return (
    <PreviewContainer ref={containerRef}>
      <AspectRatioControl>
        {ASPECT_RATIOS.map((ratio) => (
          <RatioButton
            key={ratio.name}
            $active={selectedRatio.name === ratio.name}
            onClick={() => setSelectedRatio(ratio)}
            title={ratio.description}
          >
            <div>{ratio.name}</div>
            <div className="description">{ratio.description}</div>
          </RatioButton>
        ))}
      </AspectRatioControl>
      <ChartContainer ref={chartRef} $height={chartHeight}>
        <div style={{ width: '100%', height: '100%' }} />
      </ChartContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {selectedRatio.width === 0 && (
        <ResizeHandle 
          onMouseDown={handleMouseDown}
          onTouchStart={(e) => {
            e.preventDefault();
            handleMouseDown({ clientY: e.touches[0].clientY } as React.MouseEvent);
          }}
        />
      )}
      <DataContainer>
        <ChartFooter 
          data={typeof spec === 'string' ? 
            JSON.parse(spec).data?.values || [] : 
            spec.data?.values || []} 
        />
      </DataContainer>
    </PreviewContainer>
  );
};
