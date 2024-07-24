// src/components/ErrorBoundary.tsx
import { useState, ErrorInfo, useCallback } from 'react';

const ErrorBoundary = ({ children }: any) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback((error: Error, errorInfo: ErrorInfo) => {
    console.error("Uncaught error:", error, errorInfo);
    setHasError(true);
  }, []);

  if (hasError) {
    return <h1>Something went wrong.</h1>;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
