import styled from 'styled-components';
import { Theme } from '../theme';

// Common card component
export const Card = styled.div`
  background: ${props => props.theme.components.card.background};
  border: ${props => props.theme.borders.width.thin} solid ${props => props.theme.components.card.borderColor};
  border-radius: ${props => props.theme.components.card.borderRadius};
  transition: all ${props => props.theme.transitions.duration.normal} ${props => props.theme.transitions.timing.easeInOut};
  
  &:hover {
    box-shadow: ${props => props.theme.components.card.hoverShadow};
    transform: translateY(-2px);
  }
`;

// Button variants
export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${props => `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  border-radius: ${props => props.theme.borders.radius.md};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.duration.fast} ${props => props.theme.transitions.timing.easeInOut};
  cursor: pointer;
  border: none;
  
  ${props => {
    const style = props.variant === 'secondary' ? props.theme.components.button.secondary : props.theme.components.button.primary;
    return `
      background: ${style.background};
      color: ${style.color};
      
      &:hover {
        background: ${style.hoverBackground};
      }
      
      &:active {
        border: ${props.theme.borders.width.thin} solid ${style.activeBorder};
      }
    `;
  }}
`;

// Input component
export const Input = styled.input`
  padding: ${props => props.theme.spacing.sm};
  border: ${props => props.theme.borders.width.thin} solid ${props => props.theme.components.input.borderColor};
  border-radius: ${props => props.theme.borders.radius.md};
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  background: ${props => props.theme.components.input.background};
  transition: all ${props => props.theme.transitions.duration.fast} ${props => props.theme.transitions.timing.easeInOut};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.components.input.focusBorderColor};
  }
  
  &::placeholder {
    color: ${props => props.theme.components.input.placeholderColor};
  }
`;

// Section container
export const Section = styled.section`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.neutral[50]};
  border-radius: ${props => props.theme.borders.radius.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// Typography components
export const Title = styled.h1`
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.xxl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.neutral[900]};
  margin-bottom: ${props => props.theme.spacing.md};
`;

export const Subtitle = styled.h2`
  font-family: ${props => props.theme.typography.fontFamily.primary};
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.neutral[800]};
  margin-bottom: ${props => props.theme.spacing.sm};
`; 