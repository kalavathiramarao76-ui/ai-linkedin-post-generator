"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[320px] p-6">
          <div
            className="relative w-full max-w-lg rounded-2xl backdrop-blur-xl overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(239, 68, 68, 0.15)",
              boxShadow: "0 8px 32px rgba(239, 68, 68, 0.06)",
            }}
          >
            {/* Subtle red accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-red-500/60 via-red-400/40 to-transparent" />

            <div className="p-8">
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    Something went wrong
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {this.props.fallbackTitle || "This section encountered an error"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                An unexpected error occurred while rendering this component.
                You can try again or refresh the page.
              </p>

              {/* Collapsible error details */}
              <button
                onClick={this.toggleDetails}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-4"
              >
                {this.state.showDetails ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
                {this.state.showDetails ? "Hide" : "Show"} error details
              </button>

              {this.state.showDetails && this.state.error && (
                <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-4 mb-6 overflow-auto max-h-40">
                  <p className="text-xs font-mono text-red-300/80 break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.error.stack && (
                    <pre className="text-[10px] font-mono text-zinc-600 mt-2 whitespace-pre-wrap break-all">
                      {this.state.error.stack.split("\n").slice(1, 5).join("\n")}
                    </pre>
                  )}
                </div>
              )}

              {/* Try Again */}
              <button
                onClick={this.handleRetry}
                className="btn-primary w-full"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
