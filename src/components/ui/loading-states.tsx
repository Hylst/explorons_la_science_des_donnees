import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

/**
 * Reusable loading spinner component with customizable size and text
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin', sizeClasses[size])} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

// Page Loading Component
interface PageLoadingProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

/**
 * Full page loading component with optional progress indicator
 */
export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = 'Chargement en cours...', 
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <p className="text-lg font-medium">{message}</p>
          {showProgress && (
            <div className="w-64 mx-auto">
              <div className="bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.round(progress)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Card Loading Skeleton
interface CardLoadingProps {
  count?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * Loading skeleton for card components
 */
export const CardLoading: React.FC<CardLoadingProps> = ({ 
  count = 1, 
  showHeader = true,
  className 
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index}>
          {showHeader && (
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          )}
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Table Loading Skeleton
interface TableLoadingProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * Loading skeleton for table components
 */
export const TableLoading: React.FC<TableLoadingProps> = ({ 
  rows = 5, 
  columns = 4,
  showHeader = true,
  className 
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {showHeader && (
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} className="h-6 flex-1" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

// Error State Component
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  showIcon?: boolean;
  className?: string;
}

/**
 * Error state component with retry functionality
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Une erreur s\'est produite',
  message = 'Impossible de charger les données. Veuillez réessayer.',
  onRetry,
  retryText = 'Réessayer',
  showIcon = true,
  className
}) => {
  return (
    <div className={cn('text-center py-8 px-4', className)}>
      {showIcon && (
        <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {retryText}
        </Button>
      )}
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Empty state component for when no data is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Aucune donnée disponible',
  message = 'Il n\'y a rien à afficher pour le moment.',
  action,
  icon,
  className
}) => {
  return (
    <div className={cn('text-center py-12 px-4', className)}>
      {icon && (
        <div className="mx-auto mb-4 w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

// Network Status Component
interface NetworkStatusProps {
  isOnline?: boolean;
  onRetry?: () => void;
  className?: string;
}

/**
 * Network status indicator component
 */
export const NetworkStatus: React.FC<NetworkStatusProps> = ({
  isOnline = navigator.onLine,
  onRetry,
  className
}) => {
  if (isOnline) return null;

  return (
    <Alert className={cn('border-destructive', className)}>
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Connexion Internet indisponible</span>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry}>
            <Wifi className="w-4 h-4 mr-1" />
            Réessayer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

// Async Component Wrapper
interface AsyncComponentProps {
  loading: boolean;
  error?: Error | null;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  onRetry?: () => void;
}

/**
 * Wrapper component that handles loading and error states for async operations
 */
export const AsyncComponent: React.FC<AsyncComponentProps> = ({
  loading,
  error,
  children,
  loadingComponent,
  errorComponent,
  onRetry
}) => {
  if (loading) {
    return loadingComponent || <LoadingSpinner text="Chargement..." />;
  }

  if (error) {
    return errorComponent || (
      <ErrorState 
        message={error.message || 'Une erreur s\'est produite'}
        onRetry={onRetry}
      />
    );
  }

  return <>{children}</>;
};

// Hook for managing async states
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsyncState<T>(initialData: T | null = null): [
  AsyncState<T>,
  {
    setLoading: (loading: boolean) => void;
    setData: (data: T) => void;
    setError: (error: Error | null) => void;
    reset: () => void;
  }
] {
  const [state, setState] = React.useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const setLoading = React.useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setData = React.useCallback((data: T) => {
    setState({ data, loading: false, error: null });
  }, []);

  const setError = React.useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = React.useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return [state, { setLoading, setData, setError, reset }];
}