/**
 * Input Component
 * Text input, textarea, and select components built with design tokens
 */

import React from 'react';
import styled, { css } from 'styled-components';

export type InputSize = 'small' | 'medium' | 'large';
export type InputVariant = 'default' | 'filled' | 'outlined';

interface BaseInputProps {
  size?: InputSize;
  variant?: InputVariant;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
}

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>, BaseInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>, BaseInputProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  children: React.ReactNode;
}

// Base input styles
const baseInputStyles = css<BaseInputProps>`
  font-family: var(--font-family-primary);
  border-radius: var(--component-input-borderRadius);
  border: var(--component-input-borderWidth) solid var(--color-border-light);
  background-color: var(--color-surface-primary);
  color: var(--color-text-primary);
  transition: all var(--transition-duration-normal) var(--transition-easing-standard);
  
  &::placeholder {
    color: var(--color-text-tertiary);
  }
  
  /* Size variants */
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return css`
          height: 32px;
          padding: 0 var(--spacing-2);
          font-size: var(--typography-fontSize-sm);
        `;
      case 'large':
        return css`
          height: 48px;
          padding: 0 var(--spacing-4);
          font-size: var(--typography-fontSize-lg);
        `;
      default: // medium
        return css`
          height: var(--component-input-height);
          padding: 0 var(--spacing-3);
          font-size: var(--component-input-fontSize);
        `;
    }
  }}
  
  /* Variant styles */
  ${({ variant = 'outlined' }) => {
    switch (variant) {
      case 'filled':
        return css`
          border: none;
          border-bottom: 2px solid var(--color-border-light);
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
          background-color: var(--color-surface-secondary);
        `;
      case 'outlined':
      default:
        return css`
          border: 1px solid var(--color-border-light);
          background-color: var(--color-surface-primary);
        `;
    }
  }}
  
  /* Error state */
  ${({ error }) => error && css`
    border-color: var(--color-error);
    &:focus {
      border-color: var(--color-error);
      box-shadow: 0 0 0 2px rgba(var(--color-error-rgb), 0.2);
    }
  `}
  
  /* Focus state */
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
  }
  
  /* Disabled state */
  &:disabled {
    background-color: var(--color-surface-disabled);
    color: var(--color-text-disabled);
    border-color: var(--color-border-light);
    cursor: not-allowed;
  }
  
  /* Width */
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
`;

const StyledInput = styled.input<BaseInputProps>`
  ${baseInputStyles}
`;

const StyledTextarea = styled.textarea<BaseInputProps>`
  ${baseInputStyles}
  min-height: 80px;
  padding-top: var(--spacing-3);
  padding-bottom: var(--spacing-3);
  resize: vertical;
  font-family: var(--font-family-primary);
  line-height: var(--typography-lineHeight-normal);
`;

const StyledSelect = styled.select<BaseInputProps>`
  ${baseInputStyles}
  cursor: pointer;
  
  option {
    background-color: var(--color-surface-primary);
    color: var(--color-text-primary);
  }
`;

// Label and helper text styles
const Label = styled.label`
  display: block;
  font-size: var(--typography-fontSize-sm);
  font-weight: var(--typography-fontWeight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
`;

const HelperText = styled.span<{ error?: boolean }>`
  display: block;
  font-size: var(--typography-fontSize-xs);
  color: ${({ error }) => error ? 'var(--color-error)' : 'var(--color-text-secondary)'};
  margin-top: var(--spacing-1);
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// Input component
export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  errorText,
  error = !!errorText,
  ...props
}) => {
  const displayHelperText = error ? errorText : helperText;
  const hasError = error || !!errorText;
  
  return (
    <InputContainer>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledInput {...props} error={hasError} />
      {displayHelperText && (
        <HelperText error={hasError}>{displayHelperText}</HelperText>
      )}
    </InputContainer>
  );
};

// Textarea component
export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  errorText,
  error = !!errorText,
  ...props
}) => {
  const displayHelperText = error ? errorText : helperText;
  const hasError = error || !!errorText;
  
  return (
    <InputContainer>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledTextarea {...props} error={hasError} />
      {displayHelperText && (
        <HelperText error={hasError}>{displayHelperText}</HelperText>
      )}
    </InputContainer>
  );
};

// Select component
export const Select: React.FC<SelectProps> = ({
  label,
  helperText,
  errorText,
  error = !!errorText,
  children,
  ...props
}) => {
  const displayHelperText = error ? errorText : helperText;
  const hasError = error || !!errorText;
  
  return (
    <InputContainer>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledSelect {...props} error={hasError}>
        {children}
      </StyledSelect>
      {displayHelperText && (
        <HelperText error={hasError}>{displayHelperText}</HelperText>
      )}
    </InputContainer>
  );
};

// Search input with icon
export const SearchInput = styled(Input)`
  padding-left: 40px;
  position: relative;
`;

// Number input
export const NumberInput = styled(Input)`
  -moz-appearance: textfield;
  
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
