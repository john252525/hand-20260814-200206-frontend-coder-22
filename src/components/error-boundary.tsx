'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('UI Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Что-то пошло не так</h1>
            <p className="text-neutral-500 mb-6">Произошла критическая ошибка</p>
            <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}