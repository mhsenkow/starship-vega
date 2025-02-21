import React from 'react';
import styled from 'styled-components';
import { Tooltip } from '@mui/material';
import { HelpOutline } from '@mui/icons-material';
import type { EncodingChannel } from '../../types/vega';

const EncodingRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  background: ${props => props.theme.colors.surface.default};
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const EncodingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChannelLabel = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.neutral[700]};
  display: flex;
  align-items: center;
  gap: 8px;
  text-transform: capitalize;
  width: 120px;
`;

const FieldSelect = styled.select`
  flex: 1;
  padding: 6px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  background: white;
  color: ${props => props.theme.colors.text};
  font-size: 0.9rem;

  &:hover {
    border-color: ${props => props.theme.colors.primary[400]};
  }
`;

interface EncodingFieldProps {
  channel: EncodingChannel;
  field: string;
  type: string;
  availableFields: string[];
  compatibleTypes: string[];
  onChange: (field: string, type: string) => void;
}

export interface TypeIconMap {
  quantitative: JSX.Element;
  temporal: JSX.Element;
  nominal: JSX.Element;
  ordinal: JSX.Element;
}

export interface TypeLabelMap {
  quantitative: string;
  temporal: string;
  nominal: string;
  ordinal: string;
}

export const EncodingField: React.FC<EncodingFieldProps> = ({
  channel,
  field,
  type,
  availableFields,
  compatibleTypes,
  onChange
}) => {
  return (
    <EncodingRow>
      <EncodingHeader>
        <ChannelLabel>
          {channel}
          <Tooltip title={`Map data to the ${channel} channel`}>
            <HelpOutline fontSize="small" sx={{ fontSize: 16 }} />
          </Tooltip>
        </ChannelLabel>
        <FieldSelect
          value={field}
          onChange={(e) => onChange(e.target.value, type)}
        >
          <option value="">Select field</option>
          {availableFields.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </FieldSelect>
      </EncodingHeader>

      {field && (
        <select 
          value={type} 
          onChange={(e) => onChange(field, e.target.value)}
        >
          {compatibleTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      )}
    </EncodingRow>
  );
}; 