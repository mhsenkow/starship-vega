/**
 * Tooltip Component
 * Simple tooltip component built with design tokens
 */

import React from 'react';
import styled from 'styled-components';

export interface TooltipProps {
  title: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
}

const TooltipContainer = styled.div<{ $placement?: 'top' | 'bottom' | 'left' | 'right'; $disabled?: boolean }>`
  position: relative;
  display: inline-block;
  
  &:hover::after {
    ${props => props.$disabled ? 'display: none;' : ''}
    content: attr(data-title);
    position: absolute;
    ${props => {
      switch (props.$placement) {
        case 'top':
          return 'bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);';
        case 'bottom':
          return 'top: calc(100% + 8px); left: 50%; transform: translateX(-50%);';
        case 'left':
          return 'top: 50%; right: calc(100% + 8px); transform: translateY(-50%);';
        case 'right':
          return 'top: 50%; left: calc(100% + 8px); transform: translateY(-50%);';
        default:
          return 'bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);';
      }
    }}
    background: var(--color-surface);
    color: var(--color-text-primary);
    padding: var(--spacing-1) var(--spacing-2);
    border-radius: var(--radius-sm);
    font-size: var(--typography-fontSize-sm);
    font-weight: var(--typography-fontWeight-medium);
    white-space: nowrap;
    z-index: 1000;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border-light);
  }
`;

export const Tooltip: React.FC<TooltipProps> = ({ 
  title, 
  children, 
  placement = 'bottom',
  disabled = false 
}) => {
  if (disabled || !title) {
    return <>{children}</>;
  }

  return (
    <TooltipContainer data-title={title} $placement={placement} $disabled={disabled}>
      {children}
    </TooltipContainer>
  );
};
