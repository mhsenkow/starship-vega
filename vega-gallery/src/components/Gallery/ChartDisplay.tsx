import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { ChartStyle } from '../../types/chart';
import { renderVegaLite } from '../../utils/chartRenderer';
import { determineChartEncodings, generateRandomEncoding } from '../../utils/chartAdapters';
import { TopLevelSpec } from 'vega-lite';
import {
  ChartContainer,
  ChartControls,
  ChartWrapper
} from './ChartDisplay.styles';
import { MarkType, ExtendedSpec, ChartEncoding } from '../../types/vega';
import { ErrorBoundary } from '../ErrorBoundary';
import { enhanceChartSpec } from '../../utils/chartEnhancements';

interface ChartDisplayProps {
  chartType: MarkType;
  dataset: {
    values: Record<string, unknown>[];
    [key: string]: unknown;
  };
  encoding: ChartEncoding | null;
  style?: Partial<ChartStyle>;
}

export const ChartDisplay = ({ chartType, dataset, encoding, style }: ChartDisplayProps) => {
  const [spec, setSpec] = useState<ExtendedSpec | null>(null);
  const [encodings, setEncodings] = useState<ChartEncoding | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const renderTimeout = useRef<number | undefined>(undefined);

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

    const finalEncodings = encodingConfig || determineChartEncodings(chartType, dataset);
    setSpec(enhanceChartSpec({ ...baseSpec, encoding: finalEncodings }, chartType));
  }, [chartType, dataset, baseSpec]);

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

  const handleRandomize = () => {
    const newEncodings = generateRandomEncoding(chartType, dataset);
    setEncodings(newEncodings);
  };

  if (!spec) {
    return <div>No chart specification available</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Failed to render chart</div>}>
      <ChartContainer>
        <ChartControls>
          <button 
            onClick={handleRandomize}
            title="Try different data combinations"
          >
            <span role="img" aria-label="dice">🎲</span>
            Explore Data
          </button>
          <button 
            onClick={() => setEncodings(null)}
            title="Reset to default view"
          >
            <span role="img" aria-label="reset">↺</span>
            Reset View
          </button>
        </ChartControls>
        <ChartWrapper ref={chartRef} />
      </ChartContainer>
    </ErrorBoundary>
  );
}; 