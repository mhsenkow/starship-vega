/**
 * Button Component
 * A foundational button component built with design tokens
 */

import React from 'react';
import styled, { css } from 'styled-components';

// Button variants
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;
}

// Base button styles using design tokens
const BaseButton = styled.button<ButtonProps>`
  /* Reset default button styles */
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  
  /* Base button styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-family-primary);
  font-weight: var(--component-button-fontWeight);
  border-radius: var(--component-button-borderRadius);
  cursor: pointer;
  transition: all var(--transition-duration-normal) var(--transition-easing-standard);
  text-decoration: none;
  outline: none;
  user-select: none;
  
  /* Size variants */
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return css`
          height: var(--component-button-height-small);
          padding: var(--component-button-padding-small);
          font-size: var(--typography-fontSize-xs);
        `;
      case 'large':
        return css`
          height: var(--component-button-height-large);
          padding: var(--component-button-padding-large);
          font-size: var(--typography-fontSize-lg);
        `;
      default: // medium
        return css`
          height: var(--component-button-height-medium);
          padding: var(--component-button-padding-medium);
          font-size: var(--component-button-fontSize);
        `;
    }
  }}
  
  /* Width variant */
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  /* Variant styles */
  ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'primary':
        return css`
          background-color: var(--color-primary);
          color: var(--color-text-inverse);
          border: 1px solid var(--color-primary);
          
          &:hover:not(:disabled) {
            background-color: var(--color-primary-dark);
            border-color: var(--color-primary-dark);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background-color: var(--color-primary-dark);
            transform: translateY(0);
            box-shadow: var(--shadow-sm);
          }
        `;
        
      case 'secondary':
        return css`
          background-color: var(--color-surface-primary);
          color: var(--color-primary);
          border: 1px solid var(--color-border-medium);
          
          &:hover:not(:disabled) {
            background-color: var(--color-secondary-dark);
            color: var(--color-text-inverse);
            border-color: var(--color-secondary-dark);
            box-shadow: var(--shadow-md);
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background-color: var(--color-secondary-dark);
            transform: translateY(0);
            box-shadow: var(--shadow-sm);
          }
        `;
        
      case 'tertiary':
        return css`
          background-color: var(--color-tertiary-light);
          color: var(--color-tertiary-dark);
          border: 1px solid var(--color-tertiary);
          
          &:hover:not(:disabled) {
            background-color: var(--color-tertiary);
            color: var(--color-text-inverse);
            border-color: var(--color-tertiary-dark);
            box-shadow: var(--shadow-sm);
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background-color: var(--color-tertiary-dark);
            color: var(--color-text-inverse);
            transform: translateY(0);
          }
        `;
        
      case 'danger':
        return css`
          background-color: var(--color-error);
          color: var(--color-text-inverse);
          border: 1px solid var(--color-error);
          
          &:hover:not(:disabled) {
            background-color: var(--color-error-700);
            border-color: var(--color-error-700);
            box-shadow: var(--shadow-md);
          }
          
          &:active:not(:disabled) {
            background-color: var(--color-error-700);
            transform: translateY(1px);
          }
        `;
        
      case 'success':
        return css`
          background-color: var(--color-success);
          color: var(--color-text-inverse);
          border: 1px solid var(--color-success);
          
          &:hover:not(:disabled) {
            background-color: var(--color-success-700);
            border-color: var(--color-success-700);
            box-shadow: var(--shadow-md);
          }
          
          &:active:not(:disabled) {
            background-color: var(--color-success-700);
            transform: translateY(1px);
          }
        `;
    }
  }}
  
  /* Focus styles */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  /* Disabled styles */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: var(--color-surface-disabled) !important;
    color: var(--color-text-disabled) !important;
    border-color: var(--color-border-light) !important;
    box-shadow: none !important;
    transform: none !important;
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className,
  style,
  ...props
}) => {
  return (
    <BaseButton
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

// Convenience exports for common button combinations
export const PrimaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="secondary" />
);

export const DangerButton = (props: Omit<ButtonProps, 'variant'>) => (
  <Button {...props} variant="danger" />
);

interface IconButtonProps {
  iconOnly?: boolean;
  style?: React.CSSProperties;
}

const StyledIconButton = styled(Button)<{ $iconOnly?: boolean }>`
  ${({ $iconOnly }) => $iconOnly && css`
    width: var(--component-button-height-medium);
    padding: 0;
    border-radius: var(--radius-full);
  `}
`;

export const IconButton: React.FC<IconButtonProps & Omit<ButtonProps, 'variant'>> = ({ 
  iconOnly, 
  ...props 
}) => {
  return <StyledIconButton {...props} $iconOnly={iconOnly} />;
};

// ToggleButton components
interface ToggleButtonProps {
  value: string;
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  size?: ButtonSize;
  disabled?: boolean;
}

const ToggleButton = styled.button<ToggleButtonProps>`
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  background-color: ${props => props.selected ? 'var(--color-primary)' : 'var(--color-background)'};
  color: ${props => props.selected ? 'var(--color-text-on-primary)' : 'var(--color-text-primary)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border-radius: var(--radius-sm);
  margin: 0;
  
  &:hover {
    background-color: ${props => props.selected ? 'var(--color-primary-hover)' : 'var(--color-background-hover)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:first-of-type {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  
  &:not(:first-of-type):not(:last-of-type) {
    border-radius: 0;
  }
  
  &:last-of-type {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  
  &:not(:last-of-type) {
    border-right: none;
  }
`;

interface ToggleButtonGroupProps {
  exclusive?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const StyledToggleButtonGroup = styled.div<{ $size?: 'small' | 'medium' | 'large' }>`
  display: inline-flex;
  border-radius: var(--radius-sm);
  overflow: hidden;
  gap: var(--spacing-1);
  
  ${({ $size = 'medium' }) => {
    switch ($size) {
      case 'small':
        return css`
          gap: var(--spacing-0-5);
        `;
      case 'large':
        return css`
          gap: var(--spacing-2);
        `;
      default:
        return css`
          gap: var(--spacing-1);
        `;
    }
  }}
`;

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  exclusive,
  value,
  onChange,
  size,
  className,
  style,
  children,
  ...props
}) => {
  return (
    <StyledToggleButtonGroup
      $size={size}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </StyledToggleButtonGroup>
  );
};

export { ToggleButton };
