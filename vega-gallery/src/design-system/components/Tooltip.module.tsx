/**
 * Tooltip Component
 * Simple tooltip component built with CSS modules
 */

import React from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  title: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  title,
  children,
  placement = 'top',
  disabled = false,
}) => {
  const containerClasses = [
    styles.tooltipContainer,
    styles[`placement${placement.charAt(0).toUpperCase() + placement.slice(1)}`],
    disabled ? styles.disabled : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      data-title={title}
    >
      {children}
    </div>
  );
};
