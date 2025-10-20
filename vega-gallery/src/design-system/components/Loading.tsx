/**
 * Loading Components
 * Spinner and loading indicators built with design tokens
 */

import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

interface CircularProgressProps {
  size?: number;
  color?: string;
  thickness?: number;
}

const CircularProgressContainer = styled.div<CircularProgressProps>`
  display: inline-block;
  width: ${({ size = 24 }) => size}px;
  height: ${({ size = 24 }) => size}px;
  border: ${({ thickness = 4 }) => thickness}px solid var(--color-border-light);
  border-top: ${({ thickness = 4 }) => thickness}px solid ${({ color = 'var(--color-primary)' }) => color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 24,
  color = 'var(--color-primary)',
  thickness = 4,
}) => {
  return (
    <CircularProgressContainer
      size={size}
      color={color}
      thickness={thickness}
      role="progressbar"
      aria-label="Loading"
    />
  );
};

interface LinearProgressProps {
  value?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: string;
}

const LinearProgressTrack = styled.div<LinearProgressProps>`
  width: 100%;
  height: 4px;
  background-color: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
`;

const LinearProgressBar = styled.div<LinearProgressProps>`
  height: 100%;
  background-color: ${({ color = 'var(--color-primary)' }) => color};
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
  
  ${({ variant, value = 0 }) => variant === 'determinate' 
    ? `width: ${value}%;`
    : `
      width: 100%;
      animation: ${pulse} 1.5s ease-in-out infinite;
    `
  }
`;

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value = 0,
  variant = 'indeterminate',
  color = 'var(--color-primary)',
}) => {
  return (
    <LinearProgressTrack variant={variant}>
      <LinearProgressBar
        value={value}
        variant={variant}
        color={color}
        role="progressbar"
        aria-valuenow={variant === 'determinate' ? value : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Loading"
      />
    </LinearProgressTrack>
  );
};

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | false;
}

const SkeletonBase = styled.div<SkeletonProps>`
  background-color: var(--color-surface-secondary);
  border-radius: ${({ variant }) => 
    variant === 'circular' ? '50%' : 
    variant === 'text' ? 'var(--radius-sm)' : 
    'var(--radius-sm)'
  };
  display: block;
  
  ${({ animation }) => animation !== false && css`
    animation: ${pulse} 1.5s ease-in-out infinite;
  `}
`;

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
  animation = 'pulse',
}) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <SkeletonBase
      variant={variant}
      animation={animation}
      style={style}
      aria-label="Loading content"
    />
  );
};

// Loading overlay component
const LoadingOverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  backdrop-filter: blur(2px);
`;

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-6);
  background-color: var(--color-surface-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
`;

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children?: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  children,
}) => {
  if (!isLoading) return null;

  return (
    <LoadingOverlayContainer>
      <LoadingContent>
        <CircularProgress size={32} />
        {message && (
          <span style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: 'var(--typography-fontSize-sm)' 
          }}>
            {message}
          </span>
        )}
        {children}
      </LoadingContent>
    </LoadingOverlayContainer>
  );
};
