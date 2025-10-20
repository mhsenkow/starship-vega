/**
 * Typography Components
 * Consistent text components built with design tokens
 */

import React from 'react';
import styled, { css } from 'styled-components';

export type TextVariant = 
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body' | 'body1' | 'body2' | 'caption' | 'overline' | 'subtitle1' | 'subtitle2';

export type TextColor = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse' | 'error' | 'success' | 'warning' | 'text.primary' | 'text.secondary' | 'text.disabled';

// Interface for transient props (prefixed with $)
interface StyledTypographyProps {
  $variant?: TextVariant;
  $color?: TextColor;
  $align?: 'left' | 'center' | 'right' | 'justify';
  $gutterBottom?: boolean;
  $noWrap?: boolean;
}

interface TypographyProps {
  variant?: TextVariant;
  color?: TextColor;
  align?: 'left' | 'center' | 'right' | 'justify';
  gutterBottom?: boolean;
  noWrap?: boolean;
  children?: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

// Base typography styles
const getVariantStyles = (variant: TextVariant) => {
  switch (variant) {
    case 'h1':
      return css`
        font-size: var(--typography-fontSize-4xl);
        font-weight: var(--typography-fontWeight-bold);
        line-height: var(--typography-lineHeight-tight);
        letter-spacing: var(--typography-letterSpacing-tight);
      `;
    case 'h2':
      return css`
        font-size: var(--typography-fontSize-3xl);
        font-weight: var(--typography-fontWeight-bold);
        line-height: var(--typography-lineHeight-tight);
        letter-spacing: var(--typography-letterSpacing-tight);
      `;
    case 'h3':
      return css`
        font-size: var(--typography-fontSize-2xl);
        font-weight: var(--typography-fontWeight-semibold);
        line-height: var(--typography-lineHeight-snug);
        letter-spacing: var(--typography-letterSpacing-normal);
      `;
    case 'h4':
      return css`
        font-size: var(--typography-fontSize-xl);
        font-weight: var(--typography-fontWeight-semibold);
        line-height: var(--typography-lineHeight-snug);
        letter-spacing: var(--typography-letterSpacing-normal);
      `;
    case 'h5':
      return css`
        font-size: var(--typography-fontSize-lg);
        font-weight: var(--typography-fontWeight-medium);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-normal);
      `;
    case 'h6':
      return css`
        font-size: var(--typography-fontSize-base);
        font-weight: var(--typography-fontWeight-medium);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-wide);
      `;
    case 'body':
      return css`
        font-size: var(--typography-fontSize-base);
        font-weight: var(--typography-fontWeight-regular);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-normal);
      `;
    case 'body2':
      return css`
        font-size: var(--typography-fontSize-sm);
        font-weight: var(--typography-fontWeight-regular);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-normal);
      `;
    case 'caption':
      return css`
        font-size: var(--typography-fontSize-xs);
        font-weight: var(--typography-fontWeight-regular);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-wide);
      `;
    case 'overline':
      return css`
        font-size: var(--typography-fontSize-xs);
        font-weight: var(--typography-fontWeight-medium);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-wider);
        text-transform: uppercase;
      `;
    case 'body1':
      return css`
        font-size: var(--typography-fontSize-base);
        font-weight: var(--typography-fontWeight-regular);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-normal);
      `;
    case 'subtitle1':
      return css`
        font-size: var(--typography-fontSize-lg);
        font-weight: var(--typography-fontWeight-medium);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-normal);
      `;
    case 'subtitle2':
      return css`
        font-size: var(--typography-fontSize-base);
        font-weight: var(--typography-fontWeight-medium);
        line-height: var(--typography-lineHeight-normal);
        letter-spacing: var(--typography-letterSpacing-wide);
      `;
    default:
      return css`
        font-size: var(--typography-fontSize-base);
        font-weight: var(--typography-fontWeight-regular);
        line-height: var(--typography-lineHeight-normal);
      `;
  }
};

const getColorStyles = (color: TextColor) => {
  switch (color) {
    case 'primary':
    case 'text.primary':
      return css`color: var(--color-text-primary);`;
    case 'secondary':
    case 'text.secondary':
      return css`color: var(--color-text-secondary);`;
    case 'tertiary':
      return css`color: var(--color-text-tertiary);`;
    case 'disabled':
    case 'text.disabled':
      return css`color: var(--color-text-disabled);`;
    case 'inverse':
      return css`color: var(--color-text-inverse);`;
    case 'error':
      return css`color: var(--color-error);`;
    case 'success':
      return css`color: var(--color-success);`;
    case 'warning':
      return css`color: var(--color-warning);`;
    default:
      return css`color: var(--color-text-primary);`;
  }
};

// Base typography component
const BaseTypography = styled.span<StyledTypographyProps>`
  font-family: var(--font-family-primary);
  margin: 0;
  
  /* Variant styles */
  ${({ $variant = 'body' }) => getVariantStyles($variant)}
  
  /* Color styles */
  ${({ $color = 'primary' }) => getColorStyles($color)}
  
  /* Text alignment */
  ${({ $align }) => $align && css`
    text-align: ${$align};
  `}
  
  /* Gutter bottom */
  ${({ $gutterBottom }) => $gutterBottom && css`
    margin-bottom: var(--spacing-4);
  `}
  
  /* No wrap */
  ${({ $noWrap }) => $noWrap && css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

// Default HTML element mapping for variants
const getDefaultElement = (variant: TextVariant): keyof JSX.IntrinsicElements => {
  if (variant.startsWith('h')) return variant as keyof JSX.IntrinsicElements;
  if (variant === 'body' || variant === 'body1' || variant === 'body2') return 'p';
  return 'span';
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = 'primary',
  align,
  gutterBottom = false,
  noWrap = false,
  children,
  className,
  as,
  style,
  ...props
}) => {
  const element = as || getDefaultElement(variant);
  
  return (
    <BaseTypography
      as={element}
      $variant={variant}
      $color={color}
      $align={align}
      $gutterBottom={gutterBottom}
      $noWrap={noWrap}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </BaseTypography>
  );
};

// Convenience components
export const Heading1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="h1" />
);

export const Heading2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="h2" />
);

export const Heading3 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="h3" />
);

export const Heading4 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="h4" />
);

export const Heading5 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="h5" />
);

export const Heading6 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="h6" />
);

export const Body1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="body1" />
);

export const Body2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="body2" />
);

export const Caption = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="caption" />
);

export const Overline = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="overline" />
);

export const Subtitle1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="subtitle1" />
);

export const Subtitle2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography {...props} variant="subtitle2" />
);

// Specialized text components
export const Code = styled.code`
  font-family: var(--font-family-mono);
  font-size: 0.875em;
  background-color: var(--color-surface-secondary);
  padding: 0.125em 0.25em;
  border-radius: var(--radius-sm);
  color: var(--color-primary);
`;

export const Pre = styled.pre`
  font-family: var(--font-family-mono);
  font-size: var(--typography-fontSize-sm);
  background-color: var(--color-surface-secondary);
  padding: var(--spacing-4);
  border-radius: var(--radius-base);
  overflow-x: auto;
  color: var(--color-text-primary);
  line-height: var(--typography-lineHeight-relaxed);
`;

export const Link = styled.a`
  color: var(--color-text-link);
  text-decoration: none;
  transition: color var(--transition-duration-fast) var(--transition-easing-standard);
  
  &:hover {
    color: var(--color-text-linkHover);
    text-decoration: underline;
  }
  
  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
`;
