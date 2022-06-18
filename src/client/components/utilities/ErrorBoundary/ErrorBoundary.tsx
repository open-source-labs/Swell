/**
 * @file Defines a generic error boundary component for catching and containing
 * errors in a React app. This is basically a try/catch for React apps; if this
 * catches an error, it gracefully breaks just a specific part of the app,
 * instead of the whole thing.
 *
 * As of 6/14/22, error boundaries can still only be implemented in class
 * components. A hooks version is in the works, but don't try to convert this
 * until that hook is actually available.
 *
 * {@link https://reactjs.org/docs/error-boundaries.html}
 */

import React, { Component, ReactNode } from 'react';

interface Props {
  /** Component children. */
  children?: ReactNode;
}

interface State {
  /** Indicates whether the boundary has caught an error. */
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  /**
   * Returns new state slice to merge into the component state, in the event
   * that an error happens. This must be a static method.
   */
  static getDerivedStateFromError(): Partial<State> & { hasError: true } {
    return { hasError: true };
  }

  /**
   * Defines functionality to run if an error boundary's children run into an
   * error.
   *
   * @todo If this app ever gets big enough (in terms of users), this function
   * should be beefed up to do more than just log an error.
   */
  componentDidCatch(error, info): void {
    console.error('ErrorBoundary caught an error', error, info);
  }

  /**
   * Conditionally renders children based on whether the error boundary itself
   * caught an error.
   */
  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <h2>
        There was an error with this component. The error has been logged.
      </h2>
    );
  }
}

export default ErrorBoundary;

