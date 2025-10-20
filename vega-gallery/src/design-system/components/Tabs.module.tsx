/**
 * Tabs Component
 * Tab navigation component built with CSS modules
 */

import React, { useState } from 'react';
import styles from './Tabs.module.css';

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

export const Tab: React.FC<TabProps> = ({
  label,
  value,
  icon,
  iconPosition = 'start',
  disabled = false,
  selected = false,
  onClick,
}) => {
  const tabClasses = [
    styles.tab,
    iconPosition === 'end' ? styles.iconEnd : '',
    iconPosition === 'top' ? styles.iconTop : '',
    iconPosition === 'bottom' ? styles.iconBottom : '',
    selected ? styles.selected : '',
    disabled ? styles.disabled : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={tabClasses}
      onClick={onClick}
      disabled={disabled}
      data-value={value}
    >
      {icon && (
        <span className={styles.tabIcon}>
          {icon}
        </span>
      )}
      <span className={styles.tabLabel}>{label}</span>
    </button>
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

  const containerClasses = [
    styles.tabsContainer,
    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
    variant === 'fullWidth' ? styles.fullWidth : '',
    className || '',
  ].filter(Boolean).join(' ');

  const indicatorClasses = [
    styles.tabIndicator,
    orientation === 'horizontal' ? styles.horizontal : styles.vertical,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{ position: 'relative' }}
    >
      {orientation !== 'vertical' && (
        <div
          className={indicatorClasses}
          style={{
            left: `${indicatorPosition.left}px`,
            width: `${indicatorPosition.width}px`,
          }}
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
        />
      ))}
    </div>
  );
};

// Convenience component for simple tab content
export const TabPanel: React.FC<{
  value: string | number;
  currentValue: string | number;
  children: React.ReactNode;
}> = ({ value, currentValue, children }) => {
  if (value !== currentValue) return null;
  
  return <div className={styles.tabPanel}>{children}</div>;
};
