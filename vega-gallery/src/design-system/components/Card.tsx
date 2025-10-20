/**
 * Card Component
 * Flexible card container built with design tokens
 */

import React from 'react';
import styled, { css } from 'styled-components';

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverable?: boolean;
  clickable?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface CardActionsProps {
  children: React.ReactNode;
  className?: string;
}

// Base card styles
const BaseCard = styled.div<CardProps>`
  display: flex;
  flex-direction: column;
  border-radius: var(--component-card-borderRadius);
  overflow: hidden;
  transition: all var(--transition-duration-normal) var(--transition-easing-standard);
  
  /* Variant styles */
  ${({ variant = 'elevated' }) => {
    switch (variant) {
      case 'outlined':
        return css`
          border: 1px solid var(--color-border-light);
          background-color: var(--color-surface-primary);
        `;
      case 'filled':
        return css`
          border: none;
          background-color: var(--color-surface-secondary);
        `;
      case 'elevated':
      default:
        return css`
          border: none;
          background-color: var(--color-surface-primary);
          box-shadow: var(--component-card-boxShadow);
        `;
    }
  }}
  
  /* Padding variants */
  ${({ padding = 'medium' }) => {
    switch (padding) {
      case 'none':
        return css`padding: 0;`;
      case 'small':
        return css`padding: var(--spacing-4);`;
      case 'large':
        return css`padding: var(--spacing-8);`;
      case 'medium':
      default:
        return css`padding: var(--component-card-padding);`;
    }
  }}
  
  /* Interactive states */
  ${({ hoverable, clickable }) => {
    if (hoverable || clickable) {
      return css`
        cursor: ${clickable ? 'pointer' : 'default'};
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        
        &:active {
          transform: translateY(0);
        }
      `;
    }
  }}
`;

// Card header styles
const CardHeaderContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--color-border-light);
`;

const CardHeaderContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CardTitle = styled.h3`
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--typography-fontSize-lg);
  font-weight: var(--typography-fontWeight-semibold);
  color: var(--color-text-primary);
  line-height: var(--typography-lineHeight-tight);
`;

const CardSubtitle = styled.p`
  margin: 0;
  font-size: var(--typography-fontSize-sm);
  color: var(--color-text-secondary);
  line-height: var(--typography-lineHeight-normal);
`;

const CardHeaderAction = styled.div`
  margin-left: var(--spacing-4);
  flex-shrink: 0;
`;

// Card content styles
const CardContentContainer = styled.div`
  flex: 1;
  color: var(--color-text-primary);
  
  &:not(:last-child) {
    margin-bottom: var(--spacing-4);
  }
`;

// Card actions styles
const CardActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-2);
  margin-top: auto;
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border-light);
`;

// Main Card component
export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'medium',
  hoverable = false,
  clickable = false,
  className,
  children,
  onClick,
}) => {
  return (
    <BaseCard
      variant={variant}
      padding={padding}
      hoverable={hoverable}
      clickable={clickable}
      className={className}
      onClick={onClick}
    >
      {children}
    </BaseCard>
  );
};

// Card header component
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <CardHeaderContainer className={className}>
      <CardHeaderContent>
        {title && <CardTitle>{title}</CardTitle>}
        {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      </CardHeaderContent>
      {action && <CardHeaderAction>{action}</CardHeaderAction>}
    </CardHeaderContainer>
  );
};

// Card content component
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return (
    <CardContentContainer className={className}>
      {children}
    </CardContentContainer>
  );
};

// Card actions component
export const CardActions: React.FC<CardActionsProps> = ({
  children,
  className,
}) => {
  return (
    <CardActionsContainer className={className}>
      {children}
    </CardActionsContainer>
  );
};

// Specialized card variants
export const MediaCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const MediaImage = styled.div<{ src?: string; alt?: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  background-color: var(--color-surface-secondary);
`;

const MediaContent = styled(CardContent)`
  padding: var(--spacing-6);
`;

export const MediaCardWrapper: React.FC<{
  src?: string;
  alt?: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}> = ({ src, alt, children, title, subtitle, action, onClick }) => (
  <MediaCard clickable={!!onClick} onClick={onClick}>
    {src && <MediaImage src={src} alt={alt} />}
    {(title || subtitle || action) && (
      <CardHeader title={title} subtitle={subtitle} action={action} />
    )}
    <MediaContent>{children}</MediaContent>
  </MediaCard>
);

// Stats card for dashboards
export const StatsCard = styled(Card)`
  text-align: center;
  min-height: 120px;
  justify-content: center;
`;

const StatNumber = styled.div`
  font-size: var(--typography-fontSize-3xl);
  font-weight: var(--typography-fontWeight-bold);
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--spacing-2);
`;

const StatLabel = styled.div`
  font-size: var(--typography-fontSize-sm);
  color: var(--color-text-secondary);
  font-weight: var(--typography-fontWeight-medium);
`;

export const StatsCardContent: React.FC<{
  value: string | number;
  label: string;
}> = ({ value, label }) => (
  <>
    <StatNumber>{value}</StatNumber>
    <StatLabel>{label}</StatLabel>
  </>
);
