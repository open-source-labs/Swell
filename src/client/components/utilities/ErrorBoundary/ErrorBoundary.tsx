/**
 * @file Defines a generic error boundary component for catching and containing
 * errors in a React app. This is basically a try/catch for React apps; if this
 * catches an error, it gracefully breaks just a specific part of the app,
 * instead of the whole thing.
 *
 * As of 8/31/23, error boundaries can still only be implemented in class
 * components. A non-class boundary version is in the works (whether that will
 * use a hook or a custom component remains to be seen), but don't try to
 * convert this until something is actually available.
 *
 * {@link https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary}
 */

import React, { type ReactNode, type ErrorInfo, Component } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
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
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    const { children, fallback } = this.props;
    const { hasError } = this.state;

    if (!hasError) {
      return children;
    }

    if (fallback !== undefined) {
      return fallback;
    }

    return (
      <h2>
        There was an error with this component. The error has been logged.
      </h2>
    );
  }
}

