import styled from 'styled-components';

export const Card = styled.button`
  background: var(--color-surface);
  border-radius: var(--radius-base);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

export const ChartPreview = styled.div`
  aspect-ratio: 1/1;
  min-height: 200px;
  padding: var(--spacing-4);
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .vega-embed {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    
    .marks {
      width: 100% !important;
      height: 100% !important;
    }
    
    svg {
      width: 100% !important;
      height: 100% !important;
      max-width: 100%;
      max-height: 100%;
    }
  }
`;

export const Content = styled.div`
  padding: var(--spacing-6);
`;

export const Title = styled.h3`
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--typography-fontSize-lg);
  color: var(--color-text-primary);
  font-weight: var(--typography-fontWeight-semibold);
`;

export const Description = styled.p`
  margin: 0 0 var(--spacing-6) 0;
  color: var(--color-text-secondary);
  font-size: var(--typography-fontSize-sm);
  line-height: var(--typography-lineHeight-relaxed);
`;

export const BadgeContainer = styled.div`
  display: flex;
  gap: var(--spacing-2);
`;

export const Badge = styled.span`
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: var(--typography-fontSize-xs);
  font-weight: var(--typography-fontWeight-medium);
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
`; 