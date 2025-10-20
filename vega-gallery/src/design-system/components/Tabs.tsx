/**
 * Tabs Component
 * Tab navigation component built with design tokens
 */

import React, { useState } from 'react';
import styled, { css } from 'styled-components';

export interface TabItem {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  disabled?: boolean;
}

interface TabsProps {
  value: string | number;
  onChange: (value: string | number) => void;
  tabs: TabItem[];
  variant?: 'standard' | 'fullWidth' | 'scrollable';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

interface TabProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

interface StyledTabProps {
  $iconPosition?: 'start' | 'end' | 'top' | 'bottom';
  $disabled?: boolean;
  $selected?: boolean;
}

interface TabsContainerProps {
  $orientation: 'horizontal' | 'vertical';
  $variant?: 'standard' | 'fullWidth' | 'scrollable';
}

const TabsContainer = styled.div<TabsContainerProps>`
  display: flex;
  flex-direction: ${({ $orientation }) => $orientation === 'vertical' ? 'column' : 'row'};
  border-bottom: ${({ $orientation }) => $orientation === 'horizontal' ? '1px solid var(--color-border-light)' : 'none'};
  border-right: ${({ $orientation }) => $orientation === 'vertical' ? '1px solid var(--color-border-light)' : 'none'};
  width: 100%;
  ${({ $variant }) => $variant === 'fullWidth' && css`
    justify-content: stretch;
  `}
`;

const TabIndicator = styled.div<{ 
  $left: number; 
  $width: number; 
  $orientation: 'horizontal' | 'vertical' 
}>`
  position: absolute;
  background-color: var(--color-primary);
  transition: all var(--transition-duration-normal) var(--transition-easing-standard);
  
  ${({ $orientation, $left, $width }) => $orientation === 'horizontal' ? css`
    bottom: 0;
    height: 2px;
    left: ${$left}px;
    width: ${$width}px;
  ` : css`
    right: 0;
    top: ${$left}px;
    width: 2px;
    height: ${$width}px;
  `}
`;

const StyledTab = styled.button<StyledTabProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-family-primary);
  font-size: var(--typography-fontSize-sm);
  font-weight: var(--typography-fontWeight-medium);
  cursor: pointer;
  transition: all var(--transition-duration-normal) var(--transition-easing-standard);
  text-transform: none;
  min-height: 48px;
  
  ${({ $iconPosition }) => {
    switch ($iconPosition) {
      case 'end':
        return css`flex-direction: row-reverse;`;
      case 'top':
        return css`
          flex-direction: column;
          gap: var(--spacing-1);
        `;
      case 'bottom':
        return css`
          flex-direction: column-reverse;
          gap: var(--spacing-1);
        `;
      default:
        return css`flex-direction: row;`;
    }
  }}
  
  &:hover {
    background-color: var(--color-surface-hover);
    color: var(--color-text-primary);
  }
  
  ${({ $selected }) => $selected && css`
    color: var(--color-primary);
    background-color: var(--color-surface-active);
  `}
  
  ${({ $disabled }) => $disabled && css`
    opacity: 0.4;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
      color: inherit;
    }
  `}
  
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: -2px;
  }
`;

const TabIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const TabLabel = styled.span`
  white-space: nowrap;
`;

export const Tab: React.FC<TabProps> = ({
  label,
  value,
  icon,
  iconPosition = 'start',
  disabled = false,
  selected = false,
  onClick,
}) => {
  return (
    <StyledTab
      $iconPosition={iconPosition}
      $disabled={disabled}
      $selected={selected}
      onClick={onClick}
    >
      {icon && (
        <TabIcon>
          {icon}
        </TabIcon>
      )}
      <TabLabel>{label}</TabLabel>
    </StyledTab>
  );
};

export const Tabs: React.FC<TabsProps> = ({
  value,
  onChange,
  tabs,
  variant = 'standard',
  orientation = 'horizontal',
  className,
}) => {
  const [indicatorPosition, setIndicatorPosition] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      const activeTab = containerRef.current.querySelector(`[data-value="${value}"]`) as HTMLElement;
      if (activeTab) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        
        setIndicatorPosition({
          left: tabRect.left - containerRect.left,
          width: tabRect.width,
        });
      }
    }
  }, [value]);

  return (
    <TabsContainer
      ref={containerRef}
      $orientation={orientation}
      $variant={variant}
      className={className}
      style={{ position: 'relative' }}
    >
      {orientation !== 'vertical' && (
        <TabIndicator
          $left={indicatorPosition.left}
          $width={indicatorPosition.width}
          $orientation={orientation}
        />
      )}
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          label={tab.label}
          value={tab.value}
          icon={tab.icon}
          iconPosition={tab.iconPosition}
          disabled={tab.disabled}
          selected={value === tab.value}
          onClick={() => !tab.disabled && onChange(tab.value)}
          data-value={tab.value}
        />
      ))}
    </TabsContainer>
  );
};

// Convenience component for simple tab content
export const TabPanel: React.FC<{
  value: string | number;
  currentValue: string | number;
  children: React.ReactNode;
}> = ({ value, currentValue, children }) => {
  if (value !== currentValue) return null;
  
  return <div>{children}</div>;
};
