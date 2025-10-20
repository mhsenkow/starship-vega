import React from 'react';
import styles from './ButtonSystem.module.css';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'ghostOutline' 
  | 'ghost' 
  | 'icon'
  | 'danger'
  | 'success';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonStyle = 'floating' | 'embedded';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  buttonStyle?: ButtonStyle;
  loading?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  children?: React.ReactNode;
  as?: React.ElementType;
  to?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  buttonStyle = 'floating',
  loading = false,
  fullWidth = false,
  iconOnly = false,
  children,
  className = '',
  disabled,
  as: Component = 'button',
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    styles[buttonStyle],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </Component>
  );
};

export interface ButtonGroupProps {
  children: React.ReactNode;
  buttonStyle?: ButtonStyle;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  buttonStyle = 'floating',
  className = ''
}) => {
  const groupClasses = [
    styles.buttonGroup,
    styles[buttonStyle],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {children}
    </div>
  );
};

export default Button;
