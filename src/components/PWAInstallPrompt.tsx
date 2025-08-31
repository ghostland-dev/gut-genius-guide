import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  useEffect(() => {
    // Check if user previously dismissed the prompt (within last 7 days)
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissTime = parseInt(dismissed);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (dismissTime > sevenDaysAgo) {
        setShowInstallPrompt(false);
      }
    }
  }, []);

  if (!showInstallPrompt || !deferredPrompt) return null;

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 bg-gradient-card border-border/50 shadow-strong">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Installer SmartMealPlanner</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription>
          Installez l'application pour un accès rapide et une expérience optimisée
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex space-x-2">
          <Button onClick={handleInstall} className="flex-1" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Installer
          </Button>
          <Button variant="outline" onClick={handleDismiss} size="sm">
            Plus tard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};