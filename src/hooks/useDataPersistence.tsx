import { useState, useEffect, useCallback } from 'react';
import { storage, STORAGE_KEYS, cacheManager } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

interface PersistenceOptions {
  key: string;
  defaultValue: any;
  syncOnMount?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  cacheTimeout?: number; // minutes
}

export function useDataPersistence<T>({
  key,
  defaultValue,
  syncOnMount = true,
  autoSave = true,
  autoSaveDelay = 2000,
  cacheTimeout = 60
}: PersistenceOptions) {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const isOnline = useOfflineStatus();

  // Load data from storage
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to get fresh data from cache first
      let cachedData = cacheManager.getCache<T>(key);
      
      if (!cachedData) {
        // Fallback to local storage
        cachedData = storage.get<T>(key);
      }
      
      if (cachedData) {
        setData(cachedData);
        setLastSaved(new Date());
      } else {
        setData(defaultValue);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger les données sauvegardées',
        variant: 'destructive'
      });
      setData(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue, toast]);

  // Save data to storage
  const saveData = useCallback(async (dataToSave?: T) => {
    const saveTarget = dataToSave || data;
    
    try {
      // Save to local storage
      storage.set(key, saveTarget);
      
      // Update cache with TTL
      cacheManager.setCache(key, saveTarget, cacheTimeout);
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      
      if (isOnline) {
        toast({
          title: 'Données sauvegardées',
          description: 'Vos modifications ont été enregistrées',
        });
      } else {
        toast({
          title: 'Sauvegarde locale',
          description: 'Données sauvegardées localement, synchronisation en attente',
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Erreur de sauvegarde',
        description: 'Impossible de sauvegarder les données',
        variant: 'destructive'
      });
      return false;
    }
  }, [data, key, cacheTimeout, isOnline, toast]);

  // Update data with auto-save
  const updateData = useCallback((newData: T | ((prev: T) => T)) => {
    setData(prevData => {
      const updatedData = typeof newData === 'function' 
        ? (newData as (prev: T) => T)(prevData)
        : newData;
      
      setHasUnsavedChanges(true);
      
      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set new auto-save timer
      if (autoSave) {
        const timer = setTimeout(() => {
          saveData(updatedData);
        }, autoSaveDelay);
        
        setAutoSaveTimer(timer);
      }
      
      return updatedData;
    });
  }, [autoSave, autoSaveDelay, autoSaveTimer, saveData]);

  // Force save
  const forceSave = useCallback(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      setAutoSaveTimer(null);
    }
    return saveData();
  }, [autoSaveTimer, saveData]);

  // Reset to default
  const resetData = useCallback(() => {
    setData(defaultValue);
    setHasUnsavedChanges(true);
    
    if (autoSave) {
      const timer = setTimeout(() => {
        saveData(defaultValue);
      }, autoSaveDelay);
      
      setAutoSaveTimer(timer);
    }
  }, [defaultValue, autoSave, autoSaveDelay, saveData]);

  // Clear data
  const clearData = useCallback(() => {
    storage.remove(key);
    cacheManager.setCache(key, null, 0); // Clear cache
    setData(defaultValue);
    setLastSaved(null);
    setHasUnsavedChanges(false);
    
    toast({
      title: 'Données supprimées',
      description: 'Toutes les données ont été effacées',
    });
  }, [key, defaultValue, toast]);

  // Load on mount
  useEffect(() => {
    if (syncOnMount) {
      loadData();
    }
  }, [loadData, syncOnMount]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  // Auto-save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Vous avez des modifications non sauvegardées';
        return 'Vous avez des modifications non sauvegardées';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  return {
    data,
    setData: updateData,
    isLoading,
    lastSaved,
    hasUnsavedChanges,
    
    // Actions
    save: forceSave,
    load: loadData,
    reset: resetData,
    clear: clearData,
    
    // Status
    isAutoSaving: Boolean(autoSaveTimer),
  };
}

// Specialized hooks for common data types
export const useMealPlanPersistence = () => {
  return useDataPersistence({
    key: STORAGE_KEYS.MEAL_PLANS,
    defaultValue: [],
    cacheTimeout: 120 // 2 hours for meal plans
  });
};

export const useShoppingListPersistence = () => {
  return useDataPersistence({
    key: STORAGE_KEYS.SHOPPING_LISTS,
    defaultValue: [],
    cacheTimeout: 30 // 30 minutes for shopping lists
  });
};

export const useUserProfilePersistence = () => {
  return useDataPersistence({
    key: STORAGE_KEYS.USER_PROFILE,
    defaultValue: null,
    cacheTimeout: 1440, // 24 hours for profile
    autoSaveDelay: 5000 // Longer delay for profile changes
  });
};

export const useNutritionDataPersistence = () => {
  return useDataPersistence({
    key: STORAGE_KEYS.NUTRITION_DATA,
    defaultValue: {},
    cacheTimeout: 60 // 1 hour for nutrition data
  });
};