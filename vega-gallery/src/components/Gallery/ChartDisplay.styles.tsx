import styled from 'styled-components';

export const ChartContainer = styled.div`
  background: var(--color-surface);
  border-radius: var(--radius-base);
  overflow: hidden;
  border: 1px solid var(--color-border);
`;

export const ChartControls = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--color-background);
  border-radius: var(--radius-sm);
  
  button {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-text-primary);
    font-size: var(--typography-fontSize-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    
    &:hover {
      background: var(--color-surface-hover);
      border-color: var(--color-text-tertiary);
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--color-focus-ring);
    }
    
    &:active {
      transform: translateY(0px);
    }
  }
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  overflow: hidden;
`; 