import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // eslint-disable-next-line
  componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError) {
      return <h1 className="error">Coś poszło nie tak.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
