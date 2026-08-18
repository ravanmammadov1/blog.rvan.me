import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTemplateId?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TemplateErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[TEMPLATE ERROR BOUNDARY CAUGHT]", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-neutral-900 border border-red-500/20 rounded-2xl text-center space-y-4 text-white">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold font-sans">Template Display Error</h3>
            <p className="text-xs text-neutral-400 max-w-md">
              The selected resume template encountered a rendering issue. Your resume data is completely safe.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-black font-bold text-xs font-mono transition-all hover:bg-primary/90 cursor-pointer shadow-lg"
          >
            <RefreshCw size={14} />
            <span>Reload Template</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default TemplateErrorBoundary;
