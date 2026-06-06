import React from 'react';
import { captureException } from '../../lib/monitoring/sentry';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  scope?: 'global' | 'admin' | 'public';
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    captureException(error, {
      scope: this.props.scope ?? 'global',
      componentStack: info.componentStack,
    });
    if (import.meta.env.DEV) {
      console.error(`[ErrorBoundary:${this.props.scope ?? 'global'}]`, error, info.componentStack);
    }
  }

  reset = () => {
    this.setState({ error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.error) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        role="alert"
        className="min-h-screen flex items-center justify-center bg-cosmos-night px-6"
      >
        <div className="max-w-md text-center">
          <div className="font-cormorant text-7xl text-cosmos-gold/30 font-light mb-4">!</div>
          <h1 className="font-cormorant text-3xl text-cosmos-cream font-light mb-3">
            Une erreur est survenue
          </h1>
          <p className="text-cosmos-cream/60 font-inter font-light mb-8">
            Désolé pour la gêne. Notre équipe a été notifiée.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={this.reset}
              className="px-5 py-2.5 border border-cosmos-gold/40 text-cosmos-gold hover:bg-cosmos-gold/10 transition rounded font-inter text-sm"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="px-5 py-2.5 bg-cosmos-gold text-cosmos-night hover:bg-cosmos-gold/90 transition rounded font-inter text-sm"
            >
              Retour à l'accueil
            </a>
          </div>
          {import.meta.env.DEV && this.state.error?.message && (
            <pre className="mt-8 p-3 bg-black/40 text-left text-xs text-red-300 overflow-auto rounded">
              {this.state.error.stack ?? this.state.error.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
