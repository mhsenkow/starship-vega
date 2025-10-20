/**
 * Box Component
 * Flexible container component built with design tokens
 */

import React from 'react';
import styled, { css } from 'styled-components';

// Helper function to convert Material UI spacing values to CSS values
const getSpacingValue = (value: number): string => {
  // Material UI uses 8px as base unit, so factor * 8 = pixels
  return `${value * 8}px`;
};

// Interface for transient props (prefixed with $)
interface StyledBoxProps {
  // Layout
  $display?: 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'none';
  $position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  $top?: string | number;
  $right?: string | number;
  $bottom?: string | number;
  $left?: string | number;
  
  // Flexbox
  $flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  $justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  $alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  $alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  $flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  $flexGrow?: number;
  $flexShrink?: number;
  $flexBasis?: string | number;
  $gap?: string | number;
  
  // Grid
  $gridTemplateColumns?: string;
  $gridTemplateRows?: string;
  $gridColumn?: string;
  $gridRow?: string;
  $gridArea?: string;
  
  // Sizing
  $width?: string | number;
  $height?: string | number;
  $minWidth?: string | number;
  $minHeight?: string | number;
  $maxWidth?: string | number;
  $maxHeight?: string | number;
  
  // Spacing
  $margin?: string | number;
  $marginTop?: string | number;
  $marginRight?: string | number;
  $marginBottom?: string | number;
  $marginLeft?: string | number;
  $padding?: string | number;
  $paddingTop?: string | number;
  $paddingRight?: string | number;
  $paddingBottom?: string | number;
  $paddingLeft?: string | number;
  
  // Colors
  $backgroundColor?: string;
  $color?: string;
  $border?: string;
  $borderTop?: string;
  $borderRight?: string;
  $borderBottom?: string;
  $borderLeft?: string;
  $borderRadius?: string | number;
  
  // Typography
  $fontSize?: string | number;
  $fontWeight?: string | number;
  $lineHeight?: string | number;
  $textAlign?: 'left' | 'center' | 'right' | 'justify';
  $textDecoration?: string;
  
  // Other
  $overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  $cursor?: string;
  $zIndex?: string | number;
  $boxShadow?: string;
  $opacity?: number;
  $transform?: string;
  $transition?: string;
  
  // Material UI style shorthand props
  $m?: number;
  $mt?: number;
  $mr?: number;
  $mb?: number;
  $ml?: number;
  $mx?: number;
  $my?: number;
  $p?: number;
  $pt?: number;
  $pr?: number;
  $pb?: number;
  $pl?: number;
  $px?: number;
  $py?: number;
}

// Public interface for the Box component (without $ prefix)
export interface BoxProps {
  // Layout
  display?: 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  
  // Flexbox
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  gap?: string | number;
  
  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  gridArea?: string;
  
  // Sizing
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;
  
  // Spacing
  margin?: string | number;
  marginTop?: string | number;
  marginRight?: string | number;
  marginBottom?: string | number;
  marginLeft?: string | number;
  padding?: string | number;
  paddingTop?: string | number;
  paddingRight?: string | number;
  paddingBottom?: string | number;
  paddingLeft?: string | number;
  
  // Colors
  backgroundColor?: string;
  color?: string;
  border?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  borderRadius?: string | number;
  
  // Typography
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textDecoration?: string;
  
  // Other
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  cursor?: string;
  zIndex?: string | number;
  boxShadow?: string;
  opacity?: number;
  transform?: string;
  transition?: string;
  
  // React props
  children?: React.ReactNode;
  className?: string;
  ref?: React.RefObject<HTMLDivElement>;
  onClick?: () => void;
  style?: React.CSSProperties;
  
  // Semantic props
  as?: keyof JSX.IntrinsicElements;
  
  // Material UI style shorthand props
  m?: number;
  mt?: number;
  mr?: number;
  mb?: number;
  ml?: number;
  mx?: number;
  my?: number;
  p?: number;
  pt?: number;
  pr?: number;
  pb?: number;
  pl?: number;
  px?: number;
  py?: number;
}

const StyledBox = styled.div<StyledBoxProps>`
  /* Layout */
  display: ${({ $display = 'block' }) => $display};
  position: ${({ $position = 'static' }) => $position};
  ${({ $top }) => $top && `top: ${typeof $top === 'number' ? `${$top}px` : $top};`}
  ${({ $right }) => $right && `right: ${typeof $right === 'number' ? `${$right}px` : $right};`}
  ${({ $bottom }) => $bottom && `bottom: ${typeof $bottom === 'number' ? `${$bottom}px` : $bottom};`}
  ${({ $left }) => $left && `left: ${typeof $left === 'number' ? `${$left}px` : $left};`}
  
  /* Flexbox */
  ${({ $flexDirection }) => $flexDirection && `flex-direction: ${$flexDirection};`}
  ${({ $justifyContent }) => $justifyContent && `justify-content: ${$justifyContent};`}
  ${({ $alignItems }) => $alignItems && `align-items: ${$alignItems};`}
  ${({ $alignSelf }) => $alignSelf && `align-self: ${$alignSelf};`}
  ${({ $flexWrap }) => $flexWrap && `flex-wrap: ${$flexWrap};`}
  ${({ $flexGrow }) => $flexGrow !== undefined && `flex-grow: ${$flexGrow};`}
  ${({ $flexShrink }) => $flexShrink !== undefined && `flex-shrink: ${$flexShrink};`}
  ${({ $flexBasis }) => $flexBasis && `flex-basis: ${typeof $flexBasis === 'number' ? `${$flexBasis}px` : $flexBasis};`}
  ${({ $gap }) => $gap && `gap: ${typeof $gap === 'number' ? `${$gap}px` : $gap};`}
  
  /* Grid */
  ${({ $gridTemplateColumns }) => $gridTemplateColumns && `grid-template-columns: ${$gridTemplateColumns};`}
  ${({ $gridTemplateRows }) => $gridTemplateRows && `grid-template-rows: ${$gridTemplateRows};`}
  ${({ $gridColumn }) => $gridColumn && `grid-column: ${$gridColumn};`}
  ${({ $gridRow }) => $gridRow && `grid-row: ${$gridRow};`}
  ${({ $gridArea }) => $gridArea && `grid-area: ${$gridArea};`}
  
  /* Sizing */
  ${({ $width }) => $width && `width: ${typeof $width === 'number' ? `${$width}px` : $width};`}
  ${({ $height }) => $height && `height: ${typeof $height === 'number' ? `${$height}px` : $height};`}
  ${({ $minWidth }) => $minWidth && `min-width: ${typeof $minWidth === 'number' ? `${$minWidth}px` : $minWidth};`}
  ${({ $minHeight }) => $minHeight && `min-height: ${typeof $minHeight === 'number' ? `${$minHeight}px` : $minHeight};`}
  ${({ $maxWidth }) => $maxWidth && `max-width: ${typeof $maxWidth === 'number' ? `${$maxWidth}px` : $maxWidth};`}
  ${({ $maxHeight }) => $maxHeight && `max-height: ${typeof $maxHeight === 'number' ? `${$maxHeight}px` : $maxHeight};`}
  
  /* Spacing */
  ${({ $margin }) => $margin && `margin: ${typeof $margin === 'number' ? `${$margin}px` : $margin};`}
  ${({ $marginTop }) => $marginTop && `margin-top: ${typeof $marginTop === 'number' ? `${$marginTop}px` : $marginTop};`}
  ${({ $marginRight }) => $marginRight && `margin-right: ${typeof $marginRight === 'number' ? `${$marginRight}px` : $marginRight};`}
  ${({ $marginBottom }) => $marginBottom && `margin-bottom: ${typeof $marginBottom === 'number' ? `${$marginBottom}px` : $marginBottom};`}
  ${({ $marginLeft }) => $marginLeft && `margin-left: ${typeof $marginLeft === 'number' ? `${$marginLeft}px` : $marginLeft};`}
  ${({ $padding }) => $padding && `padding: ${typeof $padding === 'number' ? `${$padding}px` : $padding};`}
  ${({ $paddingTop }) => $paddingTop && `padding-top: ${typeof $paddingTop === 'number' ? `${$paddingTop}px` : $paddingTop};`}
  ${({ $paddingRight }) => $paddingRight && `padding-right: ${typeof $paddingRight === 'number' ? `${$paddingRight}px` : $paddingRight};`}
  ${({ $paddingBottom }) => $paddingBottom && `padding-bottom: ${typeof $paddingBottom === 'number' ? `${$paddingBottom}px` : $paddingBottom};`}
  ${({ $paddingLeft }) => $paddingLeft && `padding-left: ${typeof $paddingLeft === 'number' ? `${$paddingLeft}px` : $paddingLeft};`}
  
  /* Material UI style shorthand spacing */
  ${({ $m }) => $m !== undefined && `margin: ${getSpacingValue($m)};`}
  ${({ $mt }) => $mt !== undefined && `margin-top: ${getSpacingValue($mt)};`}
  ${({ $mr }) => $mr !== undefined && `margin-right: ${getSpacingValue($mr)};`}
  ${({ $mb }) => $mb !== undefined && `margin-bottom: ${getSpacingValue($mb)};`}
  ${({ $ml }) => $ml !== undefined && `margin-left: ${getSpacingValue($ml)};`}
  ${({ $mx }) => $mx !== undefined && css`
    margin-left: ${getSpacingValue($mx)};
    margin-right: ${getSpacingValue($mx)};
  `}
  ${({ $my }) => $my !== undefined && css`
    margin-top: ${getSpacingValue($my)};
    margin-bottom: ${getSpacingValue($my)};
  `}
  ${({ $p }) => $p !== undefined && `padding: ${getSpacingValue($p)};`}
  ${({ $pt }) => $pt !== undefined && `padding-top: ${getSpacingValue($pt)};`}
  ${({ $pr }) => $pr !== undefined && `padding-right: ${getSpacingValue($pr)};`}
  ${({ $pb }) => $pb !== undefined && `padding-bottom: ${getSpacingValue($pb)};`}
  ${({ $pl }) => $pl !== undefined && `padding-left: ${getSpacingValue($pl)};`}
  ${({ $px }) => $px !== undefined && css`
    padding-left: ${getSpacingValue($px)};
    padding-right: ${getSpacingValue($px)};
  `}
  ${({ $py }) => $py !== undefined && css`
    padding-top: ${getSpacingValue($py)};
    padding-bottom: ${getSpacingValue($py)};
  `}
  
  /* Colors */
  ${({ $backgroundColor }) => $backgroundColor && `background-color: ${$backgroundColor};`}
  ${({ $color }) => $color && `color: ${$color};`}
  
  /* Borders */
  ${({ $border }) => $border && `border: ${$border};`}
  ${({ $borderTop }) => $borderTop && `border-top: ${$borderTop};`}
  ${({ $borderRight }) => $borderRight && `border-right: ${$borderRight};`}
  ${({ $borderBottom }) => $borderBottom && `border-bottom: ${$borderBottom};`}
  ${({ $borderLeft }) => $borderLeft && `border-left: ${$borderLeft};`}
  ${({ $borderRadius }) => $borderRadius && `border-radius: ${typeof $borderRadius === 'number' ? `${$borderRadius}px` : $borderRadius};`}
  
  /* Typography */
  ${({ $fontSize }) => $fontSize && `font-size: ${typeof $fontSize === 'number' ? `${$fontSize}px` : $fontSize};`}
  ${({ $fontWeight }) => $fontWeight && `font-weight: ${$fontWeight};`}
  ${({ $lineHeight }) => $lineHeight && `line-height: ${$lineHeight};`}
  ${({ $textAlign }) => $textAlign && `text-align: ${$textAlign};`}
  ${({ $textDecoration }) => $textDecoration && `text-decoration: ${$textDecoration};`}
  
  /* Other */
  ${({ $overflow }) => $overflow && `overflow: ${$overflow};`}
  ${({ $cursor }) => $cursor && `cursor: ${$cursor};`}
  ${({ $zIndex }) => $zIndex && `z-index: ${$zIndex};`}
  ${({ $boxShadow }) => $boxShadow && `box-shadow: ${$boxShadow};`}
  ${({ $opacity }) => $opacity !== undefined && `opacity: ${$opacity};`}
  ${({ $transform }) => $transform && `transform: ${$transform};`}
  ${({ $transition }) => $transition && `transition: ${$transition};`}
`;

export const Box: React.FC<BoxProps> = ({ 
  children, 
  as = 'div',
  // Layout props
  display,
  position,
  top,
  right,
  bottom,
  left,
  // Flexbox props
  flexDirection,
  justifyContent,
  alignItems,
  alignSelf,
  flexWrap,
  flexGrow,
  flexShrink,
  flexBasis,
  gap,
  // Grid props
  gridTemplateColumns,
  gridTemplateRows,
  gridColumn,
  gridRow,
  gridArea,
  // Sizing props
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  // Spacing props
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
  padding,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  // Colors props
  backgroundColor,
  color,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderRadius,
  // Typography props
  fontSize,
  fontWeight,
  lineHeight,
  textAlign,
  textDecoration,
  // Other props
  overflow,
  cursor,
  zIndex,
  boxShadow,
  opacity,
  transform,
  transition,
  // Shorthand props
  m,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  p,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  // React props (these should be passed through)
  className,
  ref,
  onClick,
  style,
  ...restProps
}) => {
  const transientProps: StyledBoxProps = {
    // Layout
    $display: display,
    $position: position,
    $top: top,
    $right: right,
    $bottom: bottom,
    $left: left,
    // Flexbox
    $flexDirection: flexDirection,
    $justifyContent: justifyContent,
    $alignItems: alignItems,
    $alignSelf: alignSelf,
    $flexWrap: flexWrap,
    $flexGrow: flexGrow,
    $flexShrink: flexShrink,
    $flexBasis: flexBasis,
    $gap: gap,
    // Grid
    $gridTemplateColumns: gridTemplateColumns,
    $gridTemplateRows: gridTemplateRows,
    $gridColumn: gridColumn,
    $gridRow: gridRow,
    $gridArea: gridArea,
    // Sizing
    $width: width,
    $height: height,
    $minWidth: minWidth,
    $minHeight: minHeight,
    $maxWidth: maxWidth,
    $maxHeight: maxHeight,
    // Spacing
    $margin: margin,
    $marginTop: marginTop,
    $marginRight: marginRight,
    $marginBottom: marginBottom,
    $marginLeft: marginLeft,
    $padding: padding,
    $paddingTop: paddingTop,
    $paddingRight: paddingRight,
    $paddingBottom: paddingBottom,
    $paddingLeft: paddingLeft,
    // Colors
    $backgroundColor: backgroundColor,
    $color: color,
    $border: border,
    $borderTop: borderTop,
    $borderRight: borderRight,
    $borderBottom: borderBottom,
    $borderLeft: borderLeft,
    $borderRadius: borderRadius,
    // Typography
    $fontSize: fontSize,
    $fontWeight: fontWeight,
    $lineHeight: lineHeight,
    $textAlign: textAlign,
    $textDecoration: textDecoration,
    // Other
    $overflow: overflow,
    $cursor: cursor,
    $zIndex: zIndex,
    $boxShadow: boxShadow,
    $opacity: opacity,
    $transform: transform,
    $transition: transition,
    // Shorthand props
    $m: m,
    $mt: mt,
    $mr: mr,
    $mb: mb,
    $ml: ml,
    $mx: mx,
    $my: my,
    $p: p,
    $pt: pt,
    $pr: pr,
    $pb: pb,
    $pl: pl,
    $px: px,
    $py: py,
  };

  return (
    <StyledBox 
      as={as} 
      {...transientProps}
      className={className}
      ref={ref}
      onClick={onClick}
      style={style}
      {...restProps}
    >
      {children}
    </StyledBox>
  );
};

// Convenience components with common patterns
export const FlexBox = (props: Omit<BoxProps, 'display'>) => (
  <Box {...props} display="flex" />
);

export const GridBox = (props: Omit<BoxProps, 'display'>) => (
  <Box {...props} display="grid" />
);

export const CenteredBox = (props: Omit<BoxProps, 'display' | 'justifyContent' | 'alignItems'>) => (
  <Box 
    {...props} 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
  />
);
