import React from 'react';
import styles from './BadgeSystem.module.css';

export type BadgeVariant = 
  | 'numeric' 
  | 'categorical' 
  | 'temporal' 
  | 'geographical'
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info'
  | 'primary' 
  | 'secondary' 
  | 'neutral';

export type BadgeSize = 'small' | 'medium' | 'large';
export type BadgeStyle = 'outline' | 'ghost' | 'solid';

export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  badgeStyle?: BadgeStyle;
  inverted?: boolean;
  clickable?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'medium',
  badgeStyle = 'solid',
  inverted = false,
  clickable = false,
  disabled = false,
  icon,
  children,
  className = '',
  ...props
}) => {
  const badgeClasses = [
    styles.badge,
    styles[variant],
    styles[size],
    styles[badgeStyle],
    inverted && styles.inverted,
    clickable && styles.clickable,
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <span
      className={badgeClasses}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  );
};

export interface BadgeGroupProps {
  children: React.ReactNode;
  spacing?: 'compact' | 'spaced';
  className?: string;
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({
  children,
  spacing = 'compact',
  className = ''
}) => {
  const groupClasses = [
    styles.badgeGroup,
    styles[spacing],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={groupClasses}>
      {children}
    </div>
  );
};

export default Badge;
