import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';
import { useToast } from '@/hooks/use-toast';

interface ValidationOptions<T> {
  schema: ZodSchema<T>;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (errors: Record<string, string[]>) => void;
  showToast?: boolean;
}

interface ValidationResult<T> {
  data: T | null;
  errors: Record<string, string[]>;
  isValid: boolean;
}

export function useFormValidation<T extends Record<string, any>>({
  schema,
  onSuccess,
  onError,
  showToast = true
}: ValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateField = useCallback((name: string, value: any): string[] => {
    try {
      // Validate single field by creating a test object
      const testData = { [name]: value } as Partial<T>;
      schema.parse(testData);
      return [];
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.errors
          .filter(err => err.path[0] === name)
          .map(err => err.message);
        return fieldErrors;
      }
      return [];
    }
  }, [schema]);

  const validateForm = useCallback(async (data: T): Promise<ValidationResult<T>> => {
    setIsValidating(true);
    
    try {
      const validData = schema.parse(data);
      setErrors({});
      
      if (onSuccess) {
        await onSuccess(validData);
      }
      
      if (showToast) {
        toast({
          title: "Validation réussie",
          description: "Toutes les données sont valides",
        });
      }
      
      return {
        data: validData,
        errors: {},
        isValid: true
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const formErrors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.');
          if (!acc[path]) {
            acc[path] = [];
          }
          acc[path].push(err.message);
          return acc;
        }, {} as Record<string, string[]>);
        
        setErrors(formErrors);
        
        if (onError) {
          onError(formErrors);
        }
        
        if (showToast) {
          const firstError = Object.values(formErrors)[0]?.[0];
          toast({
            title: "Erreur de validation",
            description: firstError || "Veuillez corriger les erreurs dans le formulaire",
            variant: "destructive"
          });
        }
        
        return {
          data: null,
          errors: formErrors,
          isValid: false
        };
      }
      
      // Handle unexpected errors
      const unexpectedError = { general: ['Une erreur inattendue est survenue'] };
      setErrors(unexpectedError);
      
      if (showToast) {
        toast({
          title: "Erreur",
          description: "Une erreur inattendue est survenue",
          variant: "destructive"
        });
      }
      
      return {
        data: null,
        errors: unexpectedError,
        isValid: false
      };
    } finally {
      setIsValidating(false);
    }
  }, [schema, onSuccess, onError, showToast, toast]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((fieldName: string, errorMessages: string[]) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: errorMessages
    }));
  }, []);

  const getFieldError = useCallback((fieldName: string): string | undefined => {
    return errors[fieldName]?.[0];
  }, [errors]);

  const hasFieldError = useCallback((fieldName: string): boolean => {
    return Boolean(errors[fieldName]?.length);
  }, [errors]);

  const hasAnyError = Object.keys(errors).length > 0;

  return {
    // Validation functions
    validateForm,
    validateField,
    
    // Error management
    errors,
    clearErrors,
    clearFieldError,
    setFieldError,
    getFieldError,
    hasFieldError,
    hasAnyError,
    
    // State
    isValidating
  };
}

// Hook for real-time field validation
export function useFieldValidation<T extends Record<string, any>>(
  schema: ZodSchema<T>,
  fieldName: keyof T
) {
  const [error, setError] = useState<string | undefined>();
  const [isValid, setIsValid] = useState(true);

  const validate = useCallback((value: any) => {
    try {
      // Validate single field with partial data
      const testData = { [fieldName]: value } as Partial<T>;
      schema.parse(testData);
      
      setError(undefined);
      setIsValid(true);
      return true;
    } catch (validationError) {
      if (validationError instanceof ZodError) {
        const fieldError = validationError.errors
          .find(err => err.path[0] === fieldName);
        
        setError(fieldError?.message);
        setIsValid(false);
        return false;
      }
      return false;
    }
  }, [schema, fieldName]);

  const clear = useCallback(() => {
    setError(undefined);
    setIsValid(true);
  }, []);

  return {
    error,
    isValid,
    validate,
    clear
  };
}