import React, { useMemo } from 'react';
import { NumbersIcon, TimelineIcon, CategoryIcon, BarChartIcon, InfoIcon as InfoIconComponent } from './Icons';
import styles from './DataColumnToken.module.css';

// Types
export interface ColumnMetadata {
  name: string;
  type: 'quantitative' | 'temporal' | 'nominal' | 'ordinal' | string;
  description?: string;
  stats?: {
    count?: number;
    unique?: number;
    nulls?: number;
    min?: number;
    max?: number;
    mean?: number;
  };
}

export interface ColumnDragItem {
  type: 'column';
  column: ColumnMetadata;
}

interface DataColumnTokenProps {
  column: ColumnMetadata;
  showStats?: boolean;
  onDragStart?: (column: ColumnMetadata) => void;
  onDragEnd?: () => void;
  onClick?: (column: ColumnMetadata) => void;
  className?: string;
  style?: React.CSSProperties;
}

const DataColumnToken: React.FC<DataColumnTokenProps> = ({
  column,
  showStats = true,
  onDragStart,
  onDragEnd,
  onClick,
  className = '',
  style
}) => {
  const typeIcon = useMemo(() => {
    switch (column.type) {
      case 'quantitative':
        return <NumbersIcon />;
      case 'temporal':
        return <TimelineIcon />;
      case 'nominal':
        return <CategoryIcon />;
      case 'ordinal':
        return <BarChartIcon />;
      default:
        return <InfoIconComponent />;
    }
  }, [column.type]);

  const statsText = useMemo(() => {
    if (!showStats || !column.stats) return '';
    
    const stats = column.stats;
    const parts = [];
    
    if (stats.unique !== undefined) {
      parts.push(`${stats.unique} unique`);
    }
    if (stats.nulls !== undefined && stats.nulls > 0) {
      parts.push(`${stats.nulls} nulls`);
    }
    if (stats.min !== undefined && stats.max !== undefined) {
      parts.push(`${stats.min}-${stats.max}`);
    }
    
    return parts.join(', ');
  }, [showStats, column.stats]);

  const tooltipText = useMemo(() => {
    const parts = [column.name, column.type];
    if (column.description) {
      parts.push(column.description);
    }
    if (statsText) {
      parts.push(statsText);
    }
    return parts.join(' • ');
  }, [column.name, column.type, column.description, statsText]);

  const handleMouseDown = () => {
    if (onDragStart) {
      onDragStart(column);
    }
  };

  const handleMouseUp = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(column);
    }
  };

  return (
    <div 
      className={`${styles.tooltip} ${className}`}
      data-title={tooltipText}
      style={style}
    >
      <div 
        className={`${styles.columnToken} ${styles[column.type] || ''}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className={styles.typeIcon}>
          {typeIcon}
        </div>
        <span className={styles.columnName}>
          {column.name}
        </span>
        <span className={styles.columnType}>
          {column.type}
        </span>
        {statsText && (
          <span className={styles.stats}>
            {statsText}
          </span>
        )}
      </div>
    </div>
  );
};

export default DataColumnToken;
