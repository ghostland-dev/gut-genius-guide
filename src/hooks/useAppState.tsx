import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface AppState {
  user: User | null;
  theme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  notifications: Notification[];
  preferences: UserPreferences;
  appVersion: string;
  featureFlags: Record<string, boolean>;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'premium' | 'enterprise';
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive';
}

interface UserPreferences {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  autoSave: boolean;
  compactView: boolean;
}

interface AppStateContextType {
  state: AppState;
  updateUser: (user: Partial<User>) => void;
  setTheme: (theme: AppState['theme']) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  toggleFeatureFlag: (flag: string) => void;
  reset: () => void;
}

const defaultState: AppState = {
  user: null,
  theme: 'system',
  isOnline: navigator.onLine,
  notifications: [],
  preferences: {
    language: 'fr',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    emailNotifications: true,
    pushNotifications: false,
    autoSave: true,
    compactView: false
  },
  appVersion: '1.0.0',
  featureFlags: {
    betaFeatures: false,
    advancedAnalytics: true,
    experimentalUI: false,
    aiRecommendations: true
  }
};

const AppStateContext = createContext<AppStateContextType | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    // Load from localStorage
    try {
      const saved = localStorage.getItem('app-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultState, ...parsed };
      }
    } catch (error) {
      logger.error('Failed to load app state from localStorage', error);
    }
    return defaultState;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('app-state', JSON.stringify(state));
    } catch (error) {
      logger.error('Failed to save app state to localStorage', error);
    }
  }, [state]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ ...prev, isOnline: true }));
      logger.info('App came online');
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isOnline: false }));
      logger.warn('App went offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme system detection
  useEffect(() => {
    if (state.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      document.documentElement.classList.toggle('dark', mediaQuery.matches);

      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      document.documentElement.classList.toggle('dark', state.theme === 'dark');
    }
  }, [state.theme]);

  const updateUser = useCallback((user: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...user } : null
    }));
    logger.info('User updated', { userId: user.id });
  }, []);

  const setTheme = useCallback((theme: AppState['theme']) => {
    setState(prev => ({ ...prev, theme }));
    logger.info('Theme changed', { theme });
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications.slice(0, 99)] // Keep max 100
    }));

    logger.info('Notification added', { type: notification.type, title: notification.title });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState(prev => ({ ...prev, notifications: [] }));
    logger.info('Notifications cleared');
  }, []);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences }
    }));
    logger.info('Preferences updated', preferences);
  }, []);

  const toggleFeatureFlag = useCallback((flag: string) => {
    setState(prev => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        [flag]: !prev.featureFlags[flag]
      }
    }));
    logger.info('Feature flag toggled', { flag });
  }, []);

  const reset = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem('app-state');
    logger.info('App state reset');
  }, []);

  const value: AppStateContextType = {
    state,
    updateUser,
    setTheme,
    addNotification,
    markNotificationRead,
    clearNotifications,
    updatePreferences,
    toggleFeatureFlag,
    reset
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

// Specialized hooks
export const useUser = () => {
  const { state, updateUser } = useAppState();
  return { user: state.user, updateUser };
};

export const useNotifications = () => {
  const { state, addNotification, markNotificationRead, clearNotifications } = useAppState();
  
  const unreadCount = state.notifications.filter(n => !n.read).length;
  
  return {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markNotificationRead,
    clearNotifications
  };
};

export const useFeatureFlags = () => {
  const { state, toggleFeatureFlag } = useAppState();
  
  const isEnabled = (flag: string) => state.featureFlags[flag] || false;
  
  return {
    featureFlags: state.featureFlags,
    isEnabled,
    toggleFeatureFlag
  };
};

export const useTheme = () => {
  const { state, setTheme } = useAppState();
  return { theme: state.theme, setTheme };
};