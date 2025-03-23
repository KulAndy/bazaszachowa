import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(_: Error, _2: ErrorInfo): void {}

  public render() {
    if (this.state.hasError) {
      return <h1 className="error">Coś poszło nie tak.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
