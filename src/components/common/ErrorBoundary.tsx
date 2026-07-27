import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Nexus ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#080711] p-6 text-slate-100 cyber-grid-bg">
          <div className="max-w-xl w-full glass-panel p-8 rounded-2xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-600/10 rounded-full filter blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 glow-purple">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient-cyber">
                  System Malfunction Detected
                </h1>
                <p className="text-xs text-purple-300/70 uppercase tracking-widest font-mono">
                  Nexus AI OS Core Exception
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-purple-900/40 mb-6 font-mono text-xs text-purple-200/80 overflow-x-auto max-h-48">
              <div className="flex items-center gap-2 text-cyan-400 mb-2 font-semibold">
                <Terminal className="w-4 h-4" />
                <span>Exception Trace Log</span>
              </div>
              <p className="text-red-400 font-bold mb-2">
                {this.state.error?.toString() || 'Unknown Kernel Exception'}
              </p>
              {this.state.errorInfo?.componentStack && (
                <pre className="text-[11px] text-slate-400 leading-tight">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex items-center justify-end gap-4">
              <button
                onClick={this.handleReset}
                className="cyber-button px-6 py-2.5 rounded-xl font-medium text-sm text-white flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                Re-initialize Core Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
