import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center bg-surface text-foreground rounded-lg border border-border">
          <p className="text-xs font-bold tracking-widest text-primary mono uppercase mb-2">
            CREATIVE VISUAL
          </p>
          <p className="text-sm text-muted-foreground">
            3D model fallback active.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
