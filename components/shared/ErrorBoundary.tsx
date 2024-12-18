'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="p-4 bg-red-50 border-red-100">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-sm font-medium">Something went wrong</h2>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}