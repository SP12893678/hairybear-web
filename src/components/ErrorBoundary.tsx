/**
 * ErrorBoundary Component
 * Catches and displays errors gracefully
 * Feature: 001-3d-bear-web-app - FR-014
 */

import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
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
    console.error('ErrorBoundary caught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error);
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI (T033)
      return (
        <div className="flex items-center justify-center h-full text-white text-center p-8">
          <div className="max-w-md">
            <div className="text-4xl mb-4">🐻</div>
            <h2 className="text-2xl font-bold mb-2">Unable to Load 3D Bear</h2>
            <p className="text-gray-300 mb-6">
              Something went wrong while loading the 3D model.
              This might be due to network issues or browser compatibility.
            </p>
            {this.state.error.message && (
              <p className="text-sm text-gray-400 mb-6 font-mono">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              aria-label="Reload page to retry"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
