import React, { useRef, useEffect, useState } from 'react';
import { ChartStyle } from '../../types/chart';
import { renderVegaLite } from '../../utils/chartRenderer';
import { determineChartEncodings, generateRandomEncoding } from '../../utils/chartAdapters';
import { TopLevelSpec, MarkType } from 'vega-lite';
import { ChartControls, ChartContainer } from './ChartDisplay.styles';
import { EncodingConfig } from '../../types/vega';
import { ChartEncoding } from '../../types/vega';

interface ChartDisplayProps {
  chartType: MarkType;
  dataset: any;
  encoding: ChartEncoding | null;
  style?: Partial<ChartStyle>;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ 
  chartType,
  dataset,
  encoding,
  style
}) => {
  const [spec, setSpec] = useState<TopLevelSpec | null>(null);
  const [encodings, setEncodings] = useState<EncodingConfig | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const generateSpec = (encodingConfig: EncodingConfig | null) => {
    if (!dataset || !chartType) return;

    // Use provided encodings or determine automatically
    const finalEncodings = encodingConfig || determineChartEncodings(chartType, dataset);

    const baseSpec: TopLevelSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: { values: dataset.values },
      mark: chartType,
      encoding: finalEncodings,
      width: 'container',
      height: 300
    };

    const enhancedSpec = enhanceChartSpec(baseSpec, chartType);
    setSpec(enhancedSpec);
  };

  useEffect(() => {
    generateSpec(encodings);
  }, [chartType, dataset, encodings]);

  const handleRandomize = () => {
    const newEncodings = generateRandomEncoding(chartType, dataset);
    setEncodings(newEncodings);
  };

  useEffect(() => {
    if (chartRef.current && spec) {
      renderVegaLite(chartRef.current, spec, { style });
    }
  }, [spec, style]);

  if (!spec) {
    return <div>No chart specification available</div>;
  }

  return (
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
      <div 
        ref={chartRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          border: '1px solid #eee',
          borderRadius: '8px',
          overflow: 'hidden'
        }} 
      />
    </ChartContainer>
  );
};

const enhanceChartSpec = (spec: TopLevelSpec, chartType: MarkType): TopLevelSpec => {
  switch (chartType) {
    case 'bar':
      return {
        ...spec,
        mark: { type: 'bar', tooltip: true },
        encoding: {
          ...spec.encoding,
          y: { ...spec.encoding?.y, stack: 'zero' }
        }
      };

    case 'line':
      return {
        ...spec,
        mark: { type: 'line', point: true, tooltip: true }
      };

    case 'boxplot':
      return {
        ...spec,
        mark: { type: 'boxplot', extent: 1.5 }
      };

    case 'area':
      return {
        ...spec,
        mark: { type: 'area', tooltip: true, line: true }
      };

    case 'wordcloud':
      return {
        ...spec,
        mark: 'text',
        transform: [
          {
            type: 'wordcloud',
            size: [800, 400],
            text: { field: spec.encoding?.text?.field || 'text' },
            fontSize: { field: spec.encoding?.size?.field || 'value' }
          }
        ]
      };

    // Add more chart-specific enhancements...

    default:
      return spec;
  }
}; 