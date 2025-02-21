import React, { Component, ErrorInfo, ReactNode } from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  padding: 16px;
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: 8px;
  background: ${props => props.theme.colors.errorBg};
  color: ${props => props.theme.colors.error};
`;

const ErrorMessage = styled.p`
  margin: 0 0 8px 0;
  font-weight: 500;
`;

const ErrorDetails = styled.pre`
  margin: 0;
  font-size: 12px;
  white-space: pre-wrap;
`;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorMessage>Something went wrong</ErrorMessage>
          {this.state.error && (
            <ErrorDetails>{this.state.error.message}</ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
} 