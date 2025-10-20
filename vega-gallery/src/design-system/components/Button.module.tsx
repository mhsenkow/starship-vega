/**
 * Button Component - CSS Modules Version
 * A foundational button component built with design tokens
 */

import React from 'react';
import styles from './Button.module.css';

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
  loading?: boolean;
  iconOnly?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className = '',
  loading = false,
  iconOnly = false
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    iconOnly ? styles.iconOnly : '',
    loading ? styles.loading : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {children}
    </button>
  );
};

// Specific button variants
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const TertiaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="tertiary" />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="danger" />
);

export const SuccessButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="success" />
);

// Icon Button
export const IconButton: React.FC<Omit<ButtonProps, 'iconOnly'> & { icon: React.ReactNode }> = ({ 
  icon, 
  children, 
  ...props 
}) => (
  <Button {...props} iconOnly>
    {icon || children}
  </Button>
);

// Toggle Button
interface ToggleButtonProps extends Omit<ButtonProps, 'variant'> {
  selected?: boolean;
  value?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  selected = false,
  value,
  children,
  className = '',
  ...props
}) => {
  const toggleClasses = [
    styles.button,
    styles.toggle,
    selected ? styles.selected : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={toggleClasses}
      data-value={value}
      {...props}
    >
      {children}
    </button>
  );
};

// Toggle Button Group
interface ToggleButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  children,
  className = ''
}) => (
  <div className={`${styles.toggleButtonGroup} ${className}`}>
    {children}
  </div>
);

// Loading Button
export const LoadingButton: React.FC<ButtonProps> = (props) => (
  <Button {...props} loading />
);

export default Button;
