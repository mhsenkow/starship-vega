/**
 * IconButton Component - CSS Modules Version
 */

import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'default' | 'inherit';
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  'aria-label'?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  size = 'medium',
  color = 'default',
  disabled = false,
  children,
  className = '',
  style = {},
  onClick,
  onMouseEnter,
  onMouseLeave,
  title,
  'aria-label': ariaLabel,
  ...props
}) => {
  const classNames = [
    styles.iconButton,
    styles[size],
    styles[`color-${color}`],
    disabled && styles.disabled,
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classNames}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
