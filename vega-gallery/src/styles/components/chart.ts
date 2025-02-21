import styled from 'styled-components';

export const ChartContainer = styled.div`
  background: ${props => props.theme.colors.surface.raised};
  border-radius: ${props => props.theme.borders.radius.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: ${props => props.theme.spacing.lg};
  
  .vega-embed {
    background: transparent;
    
    .vega-actions {
      font-family: ${props => props.theme.typography.fontFamily.primary};
      background: ${props => props.theme.colors.surface.overlay};
      border-radius: ${props => props.theme.borders.radius.md};
      box-shadow: ${props => props.theme.shadows.md};
    }
  }
`;

export const ChartControls = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface.default};
  border-radius: ${props => props.theme.borders.radius.md};
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const ChartTitle = styled.h3`
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: ${props => props.theme.spacing.sm};
`; 