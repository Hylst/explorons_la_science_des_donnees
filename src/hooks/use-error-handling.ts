import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorState {
  error: Error | null;
  hasError: boolean;
  errorId: string | null;
  retryCount: number;
}

interface ErrorHandlingOptions {
  maxRetries?: number;
  showToast?: boolean;
  logToConsole?: boolean;
  onError?: (error: Error, errorInfo?: Record<string, unknown>) => void;
  onRetry?: () => void;
  onMaxRetriesReached?: (error: Error) => void;
}

/**
 * Custom hook for comprehensive error handling in React components
 * Provides error state management, retry logic, and user feedback
 */
export function useErrorHandling(options: ErrorHandlingOptions = {}) {
  const {
    maxRetries = 3,
    showToast = true,
    logToConsole = true,
    onError,
    onRetry,
    onMaxRetriesReached
  } = options;

  const { toast } = useToast();
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
    errorId: null,
    retryCount: 0
  });

  /**
   * Handle an error with comprehensive logging and user feedback
   */
  const handleError = useCallback((error: Error | string, errorInfo?: Record<string, unknown>) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log to console if enabled
    if (logToConsole) {
      console.error(`[${errorId}] Error occurred:`, errorObj);
      if (errorInfo) {
        console.error(`[${errorId}] Error info:`, errorInfo);
      }
    }

    // Update error state
    setErrorState(prev => ({
      error: errorObj,
      hasError: true,
      errorId,
      retryCount: prev.retryCount
    }));

    // Show toast notification if enabled
    if (showToast) {
      toast({
        title: 'Erreur',
        description: getErrorMessage(errorObj),
        variant: 'destructive',
      });
    }

    // Call custom error handler
    onError?.(errorObj, errorInfo);
  }, [logToConsole, showToast, toast, onError]);

  /**
   * Clear the current error state
   */
  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
      errorId: null,
      retryCount: 0
    });
  }, []);

  /**
   * Retry the failed operation
   */
  const retry = useCallback(() => {
    if (errorState.retryCount >= maxRetries) {
      if (errorState.error) {
        onMaxRetriesReached?.(errorState.error);
      }
      return false;
    }

    setErrorState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      hasError: false,
      error: null
    }));

    onRetry?.();
    return true;
  }, [errorState.retryCount, errorState.error, maxRetries, onMaxRetriesReached, onRetry]);

  /**
   * Wrap an async function with error handling
   */
  const withErrorHandling = useCallback(
    <T extends unknown[], R>(
      fn: (...args: T) => Promise<R>
    ) => {
      return async (...args: T): Promise<R | null> => {
        try {
          const result = await fn(...args);
          // Clear error on success
          if (errorState.hasError) {
            clearError();
          }
          return result;
        } catch (error) {
          handleError(error as Error);
          return null;
        }
      };
    },
    [errorState.hasError, clearError, handleError]
  );

  /**
   * Wrap a synchronous function with error handling
   */
  const withSyncErrorHandling = useCallback(
    <T extends unknown[], R>(
      fn: (...args: T) => R
    ) => {
      return (...args: T): R | null => {
        try {
          const result = fn(...args);
          // Clear error on success
          if (errorState.hasError) {
            clearError();
          }
          return result;
        } catch (error) {
          handleError(error as Error);
          return null;
        }
      };
    },
    [errorState.hasError, clearError, handleError]
  );

  return {
    error: errorState.error,
    hasError: errorState.hasError,
    errorId: errorState.errorId,
    retryCount: errorState.retryCount,
    canRetry: errorState.retryCount < maxRetries,
    handleError,
    clearError,
    retry,
    withErrorHandling,
    withSyncErrorHandling
  };
}

/**
 * Get a user-friendly error message from an Error object
 */
function getErrorMessage(error: Error): string {
  // Network errors
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return 'Erreur de connexion. Vérifiez votre connexion Internet.';
  }

  // Timeout errors
  if (error.message.includes('timeout') || error.name === 'TimeoutError') {
    return 'La requête a expiré. Veuillez réessayer.';
  }

  // Permission errors
  if (error.message.includes('permission') || error.message.includes('unauthorized')) {
    return 'Vous n\'avez pas les permissions nécessaires pour cette action.';
  }

  // Validation errors
  if (error.message.includes('validation') || error.message.includes('invalid')) {
    return 'Les données fournies ne sont pas valides.';
  }

  // Server errors
  if (error.message.includes('500') || error.message.includes('server')) {
    return 'Erreur du serveur. Veuillez réessayer plus tard.';
  }

  // Client errors
  if (error.message.includes('400') || error.message.includes('bad request')) {
    return 'Requête invalide. Vérifiez les données saisies.';
  }

  // Not found errors
  if (error.message.includes('404') || error.message.includes('not found')) {
    return 'Ressource non trouvée.';
  }

  // Default to original message if it's user-friendly, otherwise generic message
  return error.message.length > 100 || error.message.includes('Error:') 
    ? 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
    : error.message;
}

/**
 * Hook for handling form validation errors
 */
export function useFormErrorHandling() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  /**
   * Set error for a specific field
   */
  const setFieldError = useCallback((field: string, error: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Clear all field errors
   */
  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  /**
   * Set general form error
   */
  const setFormError = useCallback((error: string) => {
    setGeneralError(error);
  }, []);

  /**
   * Clear general form error
   */
  const clearFormError = useCallback(() => {
    setGeneralError(null);
  }, []);

  /**
   * Clear all errors (field and general)
   */
  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setGeneralError(null);
  }, []);

  /**
   * Handle validation errors from API responses
   */
  const handleValidationErrors = useCallback((errors: Record<string, unknown> | string) => {
    if (typeof errors === 'object' && errors !== null) {
      // Handle field-specific errors
      Object.entries(errors).forEach(([field, error]) => {
        if (typeof error === 'string') {
          setFieldError(field, error);
        } else if (Array.isArray(error) && error.length > 0) {
          setFieldError(field, error[0]);
        }
      });
    } else if (typeof errors === 'string') {
      setFormError(errors);
    }
  }, [setFieldError, setFormError]);

  return {
    fieldErrors,
    generalError,
    hasFieldErrors: Object.keys(fieldErrors).length > 0,
    hasGeneralError: generalError !== null,
    hasAnyError: Object.keys(fieldErrors).length > 0 || generalError !== null,
    setFieldError,
    clearFieldError,
    clearAllFieldErrors,
    setFormError,
    clearFormError,
    clearAllErrors,
    handleValidationErrors,
    getFieldError: (field: string) => fieldErrors[field] || null
  };
}
