import React, { useState } from 'react';
import { VisualEditor } from './VisualEditor';
import { ChartDisplay } from './ChartDisplay';
import { ChartEncoding, MarkType } from '../../types/vega';

export const ChartEditor: React.FC = () => {
  const [chartType, setChartType] = useState<MarkType>('bar');
  const [dataset, setDataset] = useState<any[]>([]);
  const [encoding, setEncoding] = useState<ChartEncoding | null>(null);

  const handleEncodingChange = (newEncoding: ChartEncoding | null) => {
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