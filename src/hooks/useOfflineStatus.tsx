import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connexion rétablie",
        description: "Vous êtes de nouveau en ligne",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connexion perdue",
        description: "Vous travaillez maintenant hors ligne",
        variant: "destructive",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};