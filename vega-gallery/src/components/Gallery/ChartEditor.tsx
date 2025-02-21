import React, { useState } from 'react';
import { VisualEditor } from './VisualEditor';
import { ChartDisplay } from './ChartDisplay';
import { ChartEncoding, MarkType } from '../../types/vega';

export const ChartEditor: React.FC = () => {
  const [chartType, setChartType] = useState<MarkType>('bar');
  const [dataset, setDataset] = useState<any[]>([]);
  const [encoding, setEncoding] = useState<ChartEncoding | null>(null);

  const handleEncodingChange = (newEncoding: ChartEncoding | null) => {
    // Randomly change chart type 30% of the time when encoding changes
    if (Math.random() > 0.7) {
      const chartTypes: MarkType[] = ['bar', 'point', 'line', 'area'];
      setChartType(chartTypes[Math.floor(Math.random() * chartTypes.length)]);
    }
    setEncoding(newEncoding);
  };

  return (
    <div className="chart-editor">
      <div className="editor-panel">
        <VisualEditor
          chartType={chartType}
          dataset={dataset}
          onEncodingChange={handleEncodingChange}
        />
      </div>
      <div className="chart-panel">
        <ChartDisplay
          chartType={chartType}
          dataset={dataset}
          encoding={encoding}
        />
      </div>
    </div>
  );
}; 