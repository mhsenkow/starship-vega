import styled from 'styled-components';

export const breakpoints = {
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px'
} as const;

export const theme = {
  colors: {
    primary: '#4dabf7',
    border: '#e9ecef',
    surface: '#ffffff',
    background: '#f8f9fa'
  },
  text: {
    primary: '#2c3e50',
    secondary: '#6c757d'
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px'
  },
  media: {
    sm: `@media (min-width: ${breakpoints.sm})`,
    md: `@media (min-width: ${breakpoints.md})`,
    lg: `@media (min-width: ${breakpoints.lg})`,
    xl: `@media (min-width: ${breakpoints.xl})`
  }
}

export type Theme = typeof theme

// Add mobile layout for smaller screens
const Container = styled.div`
  ${props => props.theme.media.sm} {
    display: flex;
    flex-direction: column;
    height: auto;
  }

  ${props => props.theme.media.md} {
    display: grid;
    grid-template-columns: minmax(320px, 400px) 1fr;
    height: calc(100vh - 80px);
  }
`;
