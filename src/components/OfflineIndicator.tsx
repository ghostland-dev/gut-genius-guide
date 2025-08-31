import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator = () => {
  const isOnline = useOfflineStatus();

  if (isOnline) return null;

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 bg-warning/20 border-warning">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="font-medium">
        Mode hors ligne - Certaines fonctionnalités peuvent être limitées
      </AlertDescription>
    </Alert>
  );
};