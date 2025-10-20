/**
 * Box Component - CSS Modules Version
 * Flexible container component built with design tokens
 */

import React from 'react';
import styles from './Box.module.css';

interface BoxProps {
  // Layout
  display?: 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: string | number;

  // Flexbox
  flex?: string | number;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;

  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  gap?: string | number;

  // Spacing (using design tokens)
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;

  // Sizing
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;

  // Visual
  backgroundColor?: string;
  color?: string;
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string | number;
  boxShadow?: string;

  // Typography
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';

  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // Other
  cursor?: string;
  opacity?: number;
  transform?: string;
  transition?: string;

  // Children and className
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export const Box: React.FC<BoxProps> = ({
  children,
  className = '',
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  // Convert props to inline styles
  const inlineStyles: React.CSSProperties = {
    display: props.display,
    position: props.position,
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
    zIndex: props.zIndex,
    flex: props.flex,
    flexDirection: props.flexDirection,
    flexWrap: props.flexWrap,
    justifyContent: props.justifyContent,
    alignItems: props.alignItems,
    alignSelf: props.alignSelf,
    flexGrow: props.flexGrow,
    flexShrink: props.flexShrink,
    flexBasis: props.flexBasis,
    gridTemplateColumns: props.gridTemplateColumns,
    gridTemplateRows: props.gridTemplateRows,
    gridColumn: props.gridColumn,
    gridRow: props.gridRow,
    gap: props.gap,
    padding: props.padding,
    paddingTop: props.paddingTop,
    paddingRight: props.paddingRight,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    margin: props.margin,
    marginTop: props.marginTop,
    marginRight: props.marginRight,
    marginBottom: props.marginBottom,
    marginLeft: props.marginLeft,
    width: props.width,
    height: props.height,
    minWidth: props.minWidth,
    minHeight: props.minHeight,
    maxWidth: props.maxWidth,
    maxHeight: props.maxHeight,
    backgroundColor: props.backgroundColor,
    color: props.color,
    border: props.border,
    borderTop: props.borderTop,
    borderRight: props.borderRight,
    borderBottom: props.borderBottom,
    borderLeft: props.borderLeft,
    borderRadius: props.borderRadius,
    boxShadow: props.boxShadow,
    fontSize: props.fontSize,
    fontWeight: props.fontWeight,
    lineHeight: props.lineHeight,
    textAlign: props.textAlign,
    overflow: props.overflow,
    overflowX: props.overflowX,
    overflowY: props.overflowY,
    cursor: props.cursor,
    opacity: props.opacity,
    transform: props.transform,
    transition: props.transition,
    ...style,
  };

  return (
    <div
      className={`${styles.box} ${className}`}
      style={inlineStyles}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default Box;
