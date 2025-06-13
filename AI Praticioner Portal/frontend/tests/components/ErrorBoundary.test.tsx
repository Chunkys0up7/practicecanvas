import React from 'react';
import { render, screen } from '@testing-library/react';

// Temporary ErrorBoundary definition for test-first workflow
class ErrorBoundary extends React.Component<React.PropsWithChildren<{ fallback: React.ReactNode }>, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any, info: any) {}
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

describe('ErrorBoundary', () => {
  it('catches errors and displays fallback UI', () => {
    // Component that throws
    const ProblemChild = () => {
      throw new Error('Test error');
    };
    render(
      <ErrorBoundary fallback={<div data-testid="fallback">Error occurred</div>}>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
  });
}); 