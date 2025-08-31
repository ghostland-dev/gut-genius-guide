// Local storage utilities for offline functionality

interface StorageItem<T> {
  data: T;
  timestamp: number;
  version: string;
}

class SecureStorage {
  private readonly version = '1.0.0';

  set<T>(key: string, data: T, expirationHours?: number): void {
    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        version: this.version
      };

      if (expirationHours) {
        const expiration = Date.now() + (expirationHours * 60 * 60 * 1000);
        localStorage.setItem(`${key}_exp`, expiration.toString());
      }

      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      // Check expiration
      const expiration = localStorage.getItem(`${key}_exp`);
      if (expiration && Date.now() > parseInt(expiration)) {
        this.remove(key);
        return null;
      }

      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item: StorageItem<T> = JSON.parse(itemStr);

      // Version check
      if (item.version !== this.version) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_exp`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  }

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }

  // Get storage usage info
  getUsage(): { used: number; available: number; percentage: number } {
    let used = 0;
    const available = 5 * 1024 * 1024; // 5MB typical limit

    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error('Erreur calcul usage:', error);
    }

    return {
      used,
      available,
      percentage: Math.round((used / available) * 100)
    };
  }
}

// Create singleton instance
export const storage = new SecureStorage();

// Predefined keys for type safety
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  MEAL_PLANS: 'meal_plans',
  SHOPPING_LISTS: 'shopping_lists',
  NUTRITION_DATA: 'nutrition_data',
  APP_SETTINGS: 'app_settings',
  CACHE_RECIPES: 'cache_recipes',
  OFFLINE_QUEUE: 'offline_queue'
} as const;

// Offline queue for actions to sync when online
export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retries: number;
}

export class OfflineQueue {
  private queueKey = STORAGE_KEYS.OFFLINE_QUEUE;

  add(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retries'>): void {
    const queue = this.getQueue();
    const newAction: OfflineAction = {
      ...action,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retries: 0
    };
    
    queue.push(newAction);
    storage.set(this.queueKey, queue);
  }

  getQueue(): OfflineAction[] {
    return storage.get<OfflineAction[]>(this.queueKey) || [];
  }

  remove(actionId: string): void {
    const queue = this.getQueue().filter(action => action.id !== actionId);
    storage.set(this.queueKey, queue);
  }

  clear(): void {
    storage.remove(this.queueKey);
  }

  incrementRetry(actionId: string): void {
    const queue = this.getQueue();
    const action = queue.find(a => a.id === actionId);
    if (action) {
      action.retries += 1;
      storage.set(this.queueKey, queue);
    }
  }
}

export const offlineQueue = new OfflineQueue();

// Cache management
export const cacheManager = {
  // Cache with TTL
  setCache<T>(key: string, data: T, ttlMinutes: number = 60): void {
    storage.set(`cache_${key}`, data, ttlMinutes / 60);
  },

  getCache<T>(key: string): T | null {
    return storage.get<T>(`cache_${key}`);
  },

  clearCache(): void {
    // Clear all cache items
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    }
  },

  // Clean expired cache items
  cleanExpiredCache(): void {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        // Try to access - if expired, will be automatically removed
        storage.get(key);
      }
    }
  }
};