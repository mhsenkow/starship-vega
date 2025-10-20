/**
 * Typography Component - CSS Modules Version
 */

import React from 'react';
import styles from './Typography.module.css';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'subtitle1' | 'subtitle2';
  component?: keyof JSX.IntrinsicElements;
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error' | 'inherit';
  align?: 'left' | 'center' | 'right' | 'justify';
  gutterBottom?: boolean;
  noWrap?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  component,
  color = 'textPrimary',
  align,
  gutterBottom = false,
  noWrap = false,
  children,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  // Determine the HTML element to use
  const Component = component || getDefaultComponent(variant);
  
  // Build class names
  const classNames = [
    styles.typography,
    styles[variant],
    styles[`color-${color}`],
    align && styles[`align-${align}`],
    gutterBottom && styles.gutterBottom,
    noWrap && styles.noWrap,
    className
  ].filter(Boolean).join(' ');

  return React.createElement(
    Component,
    {
      className: classNames,
      style,
      onClick,
      ...props
    },
    children
  );
};

function getDefaultComponent(variant: string): keyof JSX.IntrinsicElements {
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return variant;
    case 'subtitle1':
    case 'subtitle2':
      return 'h6';
    case 'body1':
    case 'body2':
    case 'caption':
    default:
      return 'p';
  }
}

export default Typography;
