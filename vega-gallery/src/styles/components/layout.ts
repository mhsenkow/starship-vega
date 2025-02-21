import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: ${props => props.theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${props => props.theme.spacing.lg};
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.theme.layout.sidebarWidth} 1fr;
  gap: ${props => props.theme.spacing.xl};
`;

export const Stack = styled.div<{ spacing?: keyof Theme['spacing'] }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing[props.spacing || 'md']};
`;

export const Row = styled.div<{ spacing?: keyof Theme['spacing'] }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing[props.spacing || 'md']};
`; 