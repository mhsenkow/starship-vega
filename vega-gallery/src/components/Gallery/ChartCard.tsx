import { useEffect, useRef, memo, useCallback } from 'react'
import { ChartConfig } from '../../types/chart'
import { renderVegaLite } from '../../utils/chartRenderer'
import { chartSpecs } from '../../charts'
import {
  Card,
  ChartPreview,
  Content,
  Title,
  Description,
  BadgeContainer,
  Badge
} from './ChartCard.styles'

interface ChartCardProps {
  chart: ChartConfig;
  onClick: (id: string) => void;
}

const CardContent = memo(({ title, description, category, complexity }: {
  title: string;
  description: string;
  category: string;
  complexity: string;
}) => (
  <Content>
    <Title>{title}</Title>
    <Description>{description}</Description>
    <BadgeContainer>
      <Badge>{category}</Badge>
      <Badge>{complexity}</Badge>
    </BadgeContainer>
  </Content>
));

export default memo(function ChartCard({ chart, onClick }: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const renderTimeout = useRef<number>();
  const observer = useRef<ResizeObserver>();

  useEffect(() => {
    // Set up resize observer for responsive charts
    observer.current = new ResizeObserver(() => {
      if (renderTimeout.current) {
        window.clearTimeout(renderTimeout.current);
      }
      renderTimeout.current = window.setTimeout(() => {
        renderChart();
      }, 100);
    });

    if (chartRef.current) {
      observer.current.observe(chartRef.current);
    }

    return () => {
      observer.current?.disconnect();
      if (renderTimeout.current) {
        window.clearTimeout(renderTimeout.current);
      }
    };
  }, []);

  const renderChart = useCallback(async () => {
    if (!chartRef.current) return;
    
    const spec = chartSpecs[chart.id];
    if (!spec) return;

    try {
      await renderVegaLite(chartRef.current, {
        ...spec,
        width: 'container',
        height: 'container',
        autosize: { type: 'fit', contains: 'padding' }
      }, { mode: 'gallery' });
    } catch (error) {
      console.error(`Failed to render chart ${chart.id}:`, error);
    }
  }, [chart.id]);

  const handleClick = useCallback(() => onClick(chart.id), [chart.id, onClick]);

  return (
    <Card 
      onClick={handleClick}
      aria-label={`${chart.title} - ${chart.description}`}
      role="button"
      tabIndex={0}
    >
      <ChartPreview ref={chartRef} />
      <CardContent 
        title={chart.title}
        description={chart.description}
        category={chart.category}
        complexity={chart.complexity}
      />
    </Card>
  );
}, (prevProps, nextProps) => {
  return prevProps.chart.id === nextProps.chart.id;
})
