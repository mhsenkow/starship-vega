import React from 'react';
import styled from 'styled-components';
import { ChartEncoding } from '../../types/vega';
import { EncodingField } from './EncodingField';

// ... styled components from the Gallery version ...

interface EncodingControlsProps {
  spec: ChartSpec;
  onChange: (updates: Partial<ChartSpec>) => void;
  availableFields: string[];
}

export const EncodingControls: React.FC<EncodingControlsProps> = ({
  spec,
  onChange,
  availableFields
}) => {
  return (
    <EncodingSection>
      <EncodingTitle>
        Encoding Mappings
      </EncodingTitle>
      {(['x', 'y', 'color', 'size', 'shape'] as const).map(channel => (
        <EncodingField
          key={channel}
          channel={channel}
          field={spec.encoding?.[channel]?.field || ''}
          type={(spec.encoding?.[channel]?.type as keyof TypeIconMap) || 'quantitative'}
          availableFields={availableFields}
          compatibleTypes={getCompatibleTypes(channel, spec.mark as MarkType)}
          onChange={(field, type) => {
            const newSpec = {
              ...spec,
              encoding: {
                ...spec.encoding,
                [channel]: { field, type }
              }
            };
            onChange(newSpec);
          }}
        />
      ))}
    </EncodingSection>
  );
}; 