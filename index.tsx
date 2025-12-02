
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Disable React DevTools completely to prevent initialization errors
// This must be done before any React code runs
if (typeof window !== 'undefined') {
  // @ts-ignore - Completely disable React DevTools
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    isDisabled: true,
    supportsFiber: true,
    supportsFlight: true,
    supportsStrictMode: true,
    supportsTimeline: true,
    inject() {},
    onCommitFiberRoot() {},
    onCommitFiberUnmount() {},
    onPostCommitFiberRoot() {},
    setStrictMode() {},
    checkDCE() {},
    resolveRNStyle() {},
    getInternalModuleRanges() { return null; },
    registerInternalModuleStart() {},
    registerInternalModuleStop() {},
  };

  // Suppress all console errors related to React DevTools and Activity
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const message = String(args[0] || '');
    if (
      message.includes('Cannot set properties of undefined') ||
      message.includes('Activity') ||
      message.includes('__REACT_DEVTOOLS') ||
      message.includes('DevTools')
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = String(args[0] || '');
    if (
      message.includes('Cannot set properties of undefined') ||
      message.includes('Activity') ||
      message.includes('__REACT_DEVTOOLS') ||
      message.includes('DevTools')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // Catch and suppress any uncaught errors from React DevTools
  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (
      message.includes('Cannot set properties of undefined') ||
      message.includes('Activity') ||
      message.includes('__REACT_DEVTOOLS')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }, true);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Error boundary for better error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Don't log React DevTools errors
    const message = error.message || '';
    if (
      !message.includes('Cannot set properties of undefined') &&
      !message.includes('Activity') &&
      !message.includes('__REACT_DEVTOOLS')
    ) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Algo deu errado</h1>
            <p className="text-gray-600 mb-4">Por favor, recarregue a página.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
