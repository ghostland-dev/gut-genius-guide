import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Type, 
  Minus, 
  Plus,
  Palette,
  Moon,
  Sun
} from 'lucide-react';

interface AccessibilityState {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  darkMode: boolean;
  screenReader: boolean;
}

export const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityState>({
    fontSize: 16,
    highContrast: false,
    reduceMotion: false,
    darkMode: false,
    screenReader: false
  });

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    // Detect user preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setSettings(prev => ({
      ...prev,
      darkMode: prev.darkMode || prefersDark,
      reduceMotion: prev.reduceMotion || prefersReducedMotion
    }));
  }, []);

  useEffect(() => {
    // Apply settings
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = `${settings.fontSize}px`;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilityState>(
    key: K, 
    value: AccessibilityState[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 16,
      highContrast: false,
      reduceMotion: false,
      darkMode: false,
      screenReader: false
    });
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        aria-label="Ouvrir les options d'accessibilité"
      >
        <Accessibility className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 p-4 shadow-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            Accessibilité
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le panneau d'accessibilité"
          >
            ×
          </Button>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Taille du texte</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSetting('fontSize', Math.max(12, settings.fontSize - 2))}
              disabled={settings.fontSize <= 12}
              aria-label="Diminuer la taille du texte"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm min-w-[3ch] text-center">{settings.fontSize}px</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSetting('fontSize', Math.min(24, settings.fontSize + 2))}
              disabled={settings.fontSize >= 24}
              aria-label="Augmenter la taille du texte"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Contraste élevé</label>
          <Button
            variant={settings.highContrast ? "default" : "outline"}
            size="sm"
            onClick={() => updateSetting('highContrast', !settings.highContrast)}
            aria-pressed={settings.highContrast}
          >
            <Palette className="h-3 w-3 mr-1" />
            {settings.highContrast ? 'Activé' : 'Désactivé'}
          </Button>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Mode sombre</label>
          <Button
            variant={settings.darkMode ? "default" : "outline"}
            size="sm"
            onClick={() => updateSetting('darkMode', !settings.darkMode)}
            aria-pressed={settings.darkMode}
          >
            {settings.darkMode ? <Moon className="h-3 w-3 mr-1" /> : <Sun className="h-3 w-3 mr-1" />}
            {settings.darkMode ? 'Activé' : 'Désactivé'}
          </Button>
        </div>

        {/* Reduce Motion */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Réduire les animations</label>
          <Button
            variant={settings.reduceMotion ? "default" : "outline"}
            size="sm"
            onClick={() => updateSetting('reduceMotion', !settings.reduceMotion)}
            aria-pressed={settings.reduceMotion}
          >
            {settings.reduceMotion ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {settings.reduceMotion ? 'Activé' : 'Désactivé'}
          </Button>
        </div>

        {/* Screen Reader */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Mode lecteur d'écran</label>
          <Button
            variant={settings.screenReader ? "default" : "outline"}
            size="sm"
            onClick={() => updateSetting('screenReader', !settings.screenReader)}
            aria-pressed={settings.screenReader}
          >
            <Type className="h-3 w-3 mr-1" />
            {settings.screenReader ? 'Activé' : 'Désactivé'}
          </Button>
        </div>

        <div className="pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetSettings}
            className="w-full"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Skip to content link
export const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
               bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 
               focus:outline-none focus:ring-2 focus:ring-ring"
  >
    Aller au contenu principal
  </a>
);