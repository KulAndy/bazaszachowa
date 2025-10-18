import { Component, type ErrorInfo, type ReactNode } from "react";

import { I18nContext } from "../context/I18nContext";

interface ErrorBoundaryProperties {
  readonly children: ReactNode;
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

  public render() {
    return (
      <I18nContext.Consumer>
        {({ t }) =>
          this.state.hasError ? (
            <h1 className="error">{t("sth_went_wong")}.</h1>
          ) : (
            this.props.children
          )
        }
      </I18nContext.Consumer>
    );
  }
}

export default ErrorBoundary;
