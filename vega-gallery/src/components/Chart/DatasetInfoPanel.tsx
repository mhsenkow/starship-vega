import React from 'react';
import styled from 'styled-components';
import { DataAsset } from '../../types/dataset';
import { InfoIcon } from '../common/Icons';
import { Menu as HistoryIcon } from '@carbon/icons-react';

const InfoContainer = styled.div`
  padding: 16px;
  background-color: var(--color-surface);
  border-radius: var(--radius-base);
  box-shadow: var(--shadow-sm);
  margin-bottom: 16px;
  border: 1px solid var(--color-border);
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
`;

const MetaStat = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--typography-fontSize-xs);
  color: var(--color-text-secondary);
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--color-border);
  margin: 8px 0;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  font-size: var(--typography-fontSize-xs);
  border: 1px solid var(--color-primary-light);
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const InfoButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  
  &:hover {
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
  }
`;

const MetaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  font-size: var(--typography-fontSize-lg);
  font-weight: var(--typography-fontWeight-medium);
  color: var(--color-text-primary);
`;

const Description = styled.p`
  margin: 4px 0 8px 0;
  font-size: var(--typography-fontSize-sm);
  color: var(--color-text-secondary);
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
`;

interface DatasetInfoPanelProps {
  dataset: DataAsset;
  showDetails?: boolean;
  onViewDetails?: () => void;
}

export const DatasetInfoPanel: React.FC<DatasetInfoPanelProps> = ({
  dataset,
  showDetails = true,
  onViewDetails
}) => {
  const formattedDate = dataset.updatedAt 
    ? new Date(dataset.updatedAt).toLocaleDateString() 
    : dataset.createdAt 
      ? new Date(dataset.createdAt).toLocaleDateString()
      : 'Unknown date';

  return (
    <InfoContainer>
      <MetaHeader>
        <Title>Dataset Source</Title>
        {showDetails && onViewDetails && (
          <TooltipWrapper>
            <InfoButton onClick={onViewDetails} title="View Full Details">
              <InfoIcon size={16} />
            </InfoButton>
          </TooltipWrapper>
        )}
      </MetaHeader>
      
      <Title>{dataset.name}</Title>
      
      {dataset.description && (
        <Description>
          {dataset.description}
        </Description>
      )}
      
      <Divider />
      
      <MetaContainer>
        {dataset.source && (
          <MetaStat>
            Source: {dataset.source}
          </MetaStat>
        )}
        
        {(dataset.rowCount || dataset.columnCount) && (
          <MetaStat>
            {dataset.rowCount && `${dataset.rowCount.toLocaleString()} rows`}
            {dataset.rowCount && dataset.columnCount && ' · '}
            {dataset.columnCount && `${dataset.columnCount} columns`}
          </MetaStat>
        )}
        
        <MetaStat>
          <HistoryIcon size={14} />
          {formattedDate}
        </MetaStat>
      </MetaContainer>
      
      {dataset.tags && dataset.tags.length > 0 && (
        <TagsContainer>
          {dataset.tags.map(tag => (
            <Chip key={tag}>
              {tag}
            </Chip>
          ))}
        </TagsContainer>
      )}
    </InfoContainer>
  );
}; 