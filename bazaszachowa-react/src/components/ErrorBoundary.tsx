import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProperties {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<
  ErrorBoundaryProperties,
  ErrorBoundaryState
> {
  public constructor(properties: ErrorBoundaryProperties) {
    super(properties);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(_: Error, _2: ErrorInfo): void {}

  // eslint-disable-next-line sonarjs/function-return-type
  public render() {
    if (this.state.hasError) {
      return <h1 className="error">Coś poszło nie tak.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
