import { useEffect, useRef, memo, useCallback } from 'react'
import { ChartConfig } from '../../types/chart'
import { renderVegaLite } from '../../utils/chartRenderer'
import { useThemeContext } from '../../styles/ThemeProvider.module'
import { Badge, BadgeGroup } from '../../design-system/components/BadgeSystem'
import { InfoIcon } from '../common/Icons'
import styles from './ChartCard.module.css'

interface ChartCardProps {
  chart: ChartConfig;
  onClick: (id: string) => void;
}

const CardContent = memo(
  ({ title, description, category, complexity }: {
    title: string;
    description: string;
    category: string;
    complexity: string;
  }) => (
    <div className={styles.content}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <BadgeGroup spacing="compact">
        <Badge 
          variant="primary" 
          size="small"
          icon={<InfoIcon size={12} />}
        >
          {category}
        </Badge>
        <Badge 
          variant="secondary" 
          size="small"
        >
          {complexity}
        </Badge>
      </BadgeGroup>
    </div>
  ),
  (prevProps, nextProps) => {
    return (
      prevProps.title === nextProps.title &&
      prevProps.description === nextProps.description &&
      prevProps.category === nextProps.category &&
      prevProps.complexity === nextProps.complexity
    );
  }
);

CardContent.displayName = 'CardContent';

export default memo(function ChartCard({ chart, onClick }: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const renderTimeout = useRef<number | undefined>(undefined);
  const observer = useRef<ResizeObserver | undefined>(undefined);
  const { mode: currentTheme } = useThemeContext();
  const previousThemeRef = useRef(currentTheme);

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
    
    // Use the spec directly from the chart object instead of looking it up
    const spec = chart.spec;
    
    if (!spec) {
      console.error(`No specification found for chart ID: ${chart.id}`);
      
      // Display a placeholder for failed chart
      if (chartRef.current) {
        chartRef.current.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:12px;">Chart unavailable</div>';
      }
      return;
    }

    try {
      // Check if this is a Vega spec rather than Vega-Lite
      const isVegaSpec = !!(spec.$schema && spec.$schema.includes('vega.github.io/schema/vega'));
      
      // Apply container sizing only to Vega-Lite specs, as Vega specs have their own sizing
      const specToRender = isVegaSpec ? 
        spec : 
        {
          ...spec,
          width: 'container',
          height: 'container',
          autosize: { type: 'fit', contains: 'padding', resize: true }
        };
      
      // Use a type assertion to handle both Vega and Vega-Lite specs
      await renderVegaLite(chartRef.current, specToRender as any, { mode: 'gallery' });
    } catch (error) {
      console.error(`Failed to render chart ${chart.id}:`, error);
      
      // Display an error message in place of the failed chart
      if (chartRef.current) {
        chartRef.current.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#f44336;font-size:12px;">Failed to render chart</div>';
      }
    }
  }, [chart.spec]);

  // Listen for theme changes and re-render chart (moved after renderChart definition)
  useEffect(() => {
    if (previousThemeRef.current !== currentTheme) {
      console.log(`ChartCard: Theme changed from ${previousThemeRef.current} to ${currentTheme}, re-rendering chart`);
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
      console.log(`ChartCard: Color set changed, re-rendering chart ${chart.id}`, event.detail);
      
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
  }, [renderChart, chart.id]);

  const handleClick = useCallback(() => onClick(chart.id), [chart.id, onClick]);

  return (
    <button 
      className={`${styles.card} ${styles[currentTheme] || ''}`}
      onClick={handleClick}
      aria-label={`${chart.title} - ${chart.description}`}
      role="button"
      tabIndex={0}
    >
      <div className={styles.chartPreview} ref={chartRef} />
      <CardContent 
        title={chart.title}
        description={chart.description}
        category={chart.category}
        complexity={chart.complexity}
      />
    </button>
  );
}, (prevProps, nextProps) => {
  return prevProps.chart.id === nextProps.chart.id;
})
