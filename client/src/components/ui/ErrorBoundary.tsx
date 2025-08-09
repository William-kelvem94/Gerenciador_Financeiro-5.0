import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-black p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <AlertTriangle className="w-16 h-16 text-cyber-warning mx-auto mb-4" />
              <h1 className="text-2xl font-cyber text-cyber-primary mb-2">
                System Error
              </h1>
              <p className="text-white-secondary mb-6">
                Something went wrong in the financial matrix
              </p>
            </div>

            <div className="bg-black-secondary border border-cyber-border rounded-lg p-4 mb-6 text-left">
              <h3 className="text-sm font-mono text-cyber-accent mb-2">Error Details:</h3>
              <code className="text-xs text-white-muted break-all">
                {this.state.error?.message || 'Unknown error occurred'}
              </code>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-cyber-primary text-cyber-dark rounded-lg hover:bg-cyber-secondary transition-colors font-medium"
              >
                Reload Application
              </button>
              
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="w-full px-4 py-2 border border-cyber-border text-white hover:bg-black-secondary transition-colors rounded-lg"
              >
                Try Again
              </button>
            </div>

            <p className="text-xs text-white-muted mt-6">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
