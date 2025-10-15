import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';
import { Tooltip } from '@mui/material';
import NumbersIcon from '@mui/icons-material/Numbers';
import TimelineIcon from '@mui/icons-material/Timeline';
import CategoryIcon from '@mui/icons-material/Category';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Types
export interface ColumnMetadata {
  name: string;
  type: 'quantitative' | 'temporal' | 'nominal' | 'ordinal' | string;
  uniqueValues?: number;
  missingValues?: number;
  stats?: {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
  };
  description?: string;
}

// Drag item interface
export interface ColumnDragItem {
  type: 'column';
  column: ColumnMetadata;
}

// Styled components
const TokenContainer = styled.div<{
  $isDragging?: boolean;
  $colorScheme?: string;
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  gap: 6px;
  cursor: grab;
  background: ${props => 
    props.$isDragging 
      ? 'var(--color-background)' 
      : props.$colorScheme || 'var(--color-surface)'};
  border: 1px solid ${props => 
    props.$isDragging 
      ? 'var(--color-primary)' 
      : 'var(--color-border)'};
  opacity: ${props => (props.$isDragging ? 0.6 : 1)};
  transition: all 0.15s ease-in-out;
  box-shadow: ${props => 
    props.$isDragging 
      ? '0 5px 10px rgba(0, 0, 0, 0.15)' 
      : '0 1px 2px rgba(0, 0, 0, 0.08)'};
  transform: ${props => props.$isDragging ? 'scale(1.05)' : 'scale(1)'};
  
  &:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
    border-color: var(--color-primary);
    background: ${props => !props.$isDragging && 'var(--color-background)'};
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }
`;

const TypeIndicator = styled.div<{ $type: string }>`
  color: ${props => {
    switch (props.$type) {
      case 'quantitative': return 'var(--color-numeric, #2196f3)';
      case 'temporal': return 'var(--color-temporal, #4caf50)';
      case 'nominal': return 'var(--color-categorical, #f44336)';
      case 'ordinal': return 'var(--color-ordinal, #ff9800)';
      default: return 'var(--color-text-secondary)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$type) {
      case 'quantitative': return 'rgba(33, 150, 243, 0.1)';
      case 'temporal': return 'rgba(76, 175, 80, 0.1)';
      case 'nominal': return 'rgba(244, 67, 54, 0.1)';
      case 'ordinal': return 'rgba(255, 152, 0, 0.1)';
      default: return 'transparent';
    }
  }};
  padding: 3px;
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

const ColumnName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  font-weight: 500;
`;

const StatsIndicator = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  margin-left: 2px;
`;

const InfoIcon = styled(InfoOutlinedIcon)`
  font-size: 14px !important;
  margin-left: 3px;
  color: var(--color-text-secondary);
`;

interface DataColumnTokenProps {
  column: ColumnMetadata;
  draggable?: boolean;
  showStats?: boolean;
  onClick?: (column: ColumnMetadata) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  colorScheme?: string;
  className?: string;
}

export const DataColumnToken: React.FC<DataColumnTokenProps> = ({
  column,
  draggable = true,
  showStats = false,
  onClick,
  onDragStart,
  onDragEnd,
  colorScheme,
  className,
}) => {
  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'column',
      item: () => {
        if (onDragStart) onDragStart();
        return { type: 'column', column };
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        if (onDragEnd) onDragEnd();
      },
    }),
    [column, onDragStart, onDragEnd]
  );

  // Get appropriate icon for the data type
  const getTypeIcon = useMemo(() => {
    switch (column.type) {
      case 'quantitative':
        return <NumbersIcon fontSize="small" />;
      case 'temporal':
        return <TimelineIcon fontSize="small" />;
      case 'nominal':
        return <CategoryIcon fontSize="small" />;
      case 'ordinal':
        return <BarChartIcon fontSize="small" />;
      default:
        return <CategoryIcon fontSize="small" />;
    }
  }, [column.type]);

  // Calculate tooltip content
  const tooltipContent = useMemo(() => {
    const parts = [
      `Name: ${column.name}`,
      `Type: ${column.type}`,
    ];

    if (column.uniqueValues !== undefined) {
      parts.push(`Unique values: ${column.uniqueValues}`);
    }

    if (column.missingValues !== undefined) {
      parts.push(`Missing values: ${column.missingValues}`);
    }

    if (column.stats) {
      if (column.stats.min !== undefined && column.stats.max !== undefined) {
        parts.push(`Range: ${column.stats.min} to ${column.stats.max}`);
      }
      if (column.stats.mean !== undefined) {
        parts.push(`Mean: ${column.stats.mean.toFixed(2)}`);
      }
    }

    if (column.description) {
      parts.push(`Description: ${column.description}`);
    }

    return parts.join('\n');
  }, [column]);

  // Add a ref for the container
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Connect the drag ref to our ref
  if (draggable) {
    drag(containerRef);
  }

  return (
    <Tooltip title={tooltipContent} placement="top">
      <TokenContainer
        ref={containerRef}
        $isDragging={isDragging}
        $colorScheme={colorScheme}
        onClick={onClick ? () => onClick(column) : undefined}
        className={className}
      >
        <TypeIndicator $type={column.type}>
          {getTypeIcon}
        </TypeIndicator>
        <ColumnName>{column.name}</ColumnName>
        {showStats && column.stats && (
          <StatsIndicator>
            <InfoIcon />
          </StatsIndicator>
        )}
      </TokenContainer>
    </Tooltip>
  );
};

export default DataColumnToken; 