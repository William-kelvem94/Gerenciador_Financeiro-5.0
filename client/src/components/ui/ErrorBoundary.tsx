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
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-8">
              <AlertTriangle className="text-cyber-warning mx-auto mb-4 h-16 w-16" />
              <h1 className="font-cyber text-cyber-primary mb-2 text-2xl">System Error</h1>
              <p className="text-white-secondary mb-6">
                Something went wrong in the financial matrix
              </p>
            </div>

            <div className="bg-black-secondary border-cyber-border mb-6 rounded-lg border p-4 text-left">
              <h3 className="text-cyber-accent mb-2 font-mono text-sm">Error Details:</h3>
              <code className="text-white-muted text-xs break-all">
                {this.state.error?.message || 'Unknown error occurred'}
              </code>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-cyber-primary text-cyber-dark hover:bg-cyber-secondary w-full rounded-lg px-4 py-2 font-medium transition-colors"
              >
                Reload Application
              </button>

              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="border-cyber-border hover:bg-black-secondary w-full rounded-lg border px-4 py-2 text-white transition-colors"
              >
                Try Again
              </button>
            </div>

            <p className="text-white-muted mt-6 text-xs">
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
