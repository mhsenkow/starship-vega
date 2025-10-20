import React, { Component, ErrorInfo, ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });
    
    // You can also log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className={styles.errorContainer}>
          <h2 className={styles.errorTitle}>Something went wrong rendering this component.</h2>
          <p className={styles.errorMessage}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {this.state.errorInfo && (
            <pre className={styles.errorDetails}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button className={styles.reloadButton} onClick={this.handleReload}>
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 