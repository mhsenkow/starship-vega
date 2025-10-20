import React, { useState } from 'react';
import styled from 'styled-components';
import { ChartEncoding, MarkType } from '../../types/vega';
import { EncodingControls } from './EncodingControls';

const EditorControls = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
  padding: var(--spacing-sm);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-size: var(--typography-fontSize-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-surface-hover);
    border-color: var(--color-text-tertiary);
  }
`;

const EncodingSection = styled.div`
  margin-top: var(--spacing-lg);
`;

interface VisualEditorProps {
  chartType: MarkType;
  dataset: any;
  onEncodingChange: (encoding: ChartEncoding | null) => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  chartType,
  dataset,
  onEncodingChange
}) => {
  const [encoding, setEncoding] = useState<ChartEncoding>({});

  const handleEncodingChange = (channel: string, field: string, type: string) => {
    const newEncoding = {
      ...encoding,
      [channel]: { field, type }
    };
    setEncoding(newEncoding);
    onEncodingChange(newEncoding);
  };

  // Special handling for parallel coordinates chart
  const isParallelCoordinates = chartType === 'parallel-coordinates';

  return (
    <div>
      <EncodingSection>
        <EncodingControls
          chartType={chartType}
          dataset={dataset}
          onEncodingChange={onEncodingChange}
          availableFields={getAvailableFields(dataset)}
        >
          {isParallelCoordinates ? (
            <>
              <EncodingField
                label="DIMENSIONS"
                field={encoding.dimensions?.field || ""}
                type={encoding.dimensions?.type || "quantitative"}
                onChange={(field, type) => handleEncodingChange('dimensions', field, type)}
              />
              <EncodingField
                label="DETAIL"
                field={encoding.detail?.field || ""}
                type={encoding.detail?.type || "nominal"}
                onChange={(field, type) => handleEncodingChange('detail', field, type)}
              />
              <EncodingField
                label="COLOR"
                field={encoding.color?.field || ""}
                type={encoding.color?.type || "nominal"}
                onChange={(field, type) => handleEncodingChange('color', field, type)}
              />
              <EncodingField
                label="OPACITY"
                field={encoding.opacity?.field || ""}
                type={encoding.opacity?.type || "quantitative"}
                onChange={(field, type) => handleEncodingChange('opacity', field, type)}
              />
            </>
          ) : (
            <>
              <EncodingField
                label="X"
                field={encoding.x?.field || ""}
                type={encoding.x?.type || "quantitative"}
                onChange={(field, type) => handleEncodingChange('x', field, type)}
              />
              <EncodingField
                label="Y"
                field={encoding.y?.field || ""}
                type={encoding.y?.type || "quantitative"}
                onChange={(field, type) => handleEncodingChange('y', field, type)}
              />
              <EncodingField
                label="COLOR"
                field={encoding.color?.field || ""}
                type={encoding.color?.type || "nominal"}
                onChange={(field, type) => handleEncodingChange('color', field, type)}
              />
              <EncodingField
                label="SIZE"
                field={encoding.size?.field || ""}
                type={encoding.size?.type || "quantitative"}
                onChange={(field, type) => handleEncodingChange('size', field, type)}
              />
            </>
          )}
        </EncodingControls>
      </EncodingSection>
    </div>
  );
};

function getAvailableFields(dataset: any): string[] {
  if (!dataset || !dataset.length) return [];
  return Object.keys(dataset[0]);
} 