import { CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Enhanced toast variants with better UX
export const toastVariants = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      action: <CheckCircle className="h-5 w-5 text-success" />,
      duration: 3000,
    });
  },

  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      action: <XCircle className="h-5 w-5" />,
      duration: 5000,
    });
  },

  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      action: <AlertTriangle className="h-5 w-5 text-warning" />,
      duration: 4000,
    });
  },

  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      action: <Info className="h-5 w-5 text-primary" />,
      duration: 3000,
    });
  },

  loading: (title: string, description?: string) => {
    return toast({
      title,
      description,
      action: <Loader2 className="h-5 w-5 animate-spin" />,
      duration: Infinity, // Keep until dismissed
    });
  },

  // Special toasts for common scenarios
  saved: (itemName?: string) => {
    toastVariants.success(
      "Sauvegardé",
      itemName ? `${itemName} a été sauvegardé avec succès` : "Les modifications ont été sauvegardées"
    );
  },

  deleted: (itemName?: string) => {
    toastVariants.success(
      "Supprimé",
      itemName ? `${itemName} a été supprimé` : "L'élément a été supprimé"
    );
  },

  created: (itemName?: string) => {
    toastVariants.success(
      "Créé",
      itemName ? `${itemName} a été créé avec succès` : "Nouvel élément créé"
    );
  },

  networkError: () => {
    toastVariants.error(
      "Erreur de connexion",
      "Vérifiez votre connexion internet et réessayez"
    );
  },

  validationError: (field?: string) => {
    toastVariants.error(
      "Erreur de validation",
      field ? `Le champ ${field} contient des erreurs` : "Veuillez corriger les erreurs du formulaire"
    );
  },

  rateLimited: (retryMinutes?: number) => {
    toastVariants.warning(
      "Trop de tentatives",
      retryMinutes 
        ? `Réessayez dans ${retryMinutes} minute(s)`
        : "Vous avez effectué trop de tentatives, veuillez patienter"
    );
  },

  offline: () => {
    toastVariants.warning(
      "Mode hors ligne",
      "Certaines fonctionnalités peuvent être limitées"
    );
  },

  online: () => {
    toastVariants.success(
      "Connexion rétablie",
      "Toutes les fonctionnalités sont à nouveau disponibles"
    );
  },

  updateAvailable: () => {
    toastVariants.info(
      "Mise à jour disponible",
      "Une nouvelle version est disponible. Rechargez la page pour l'installer."
    );
  }
};

// Loading toast manager for async operations
export class LoadingToastManager {
  private activeToasts: Map<string, { dismiss: () => void }> = new Map();

  start(key: string, title: string, description?: string) {
    // Dismiss existing toast if any
    this.stop(key);
    
    const toastResult = toastVariants.loading(title, description);
    this.activeToasts.set(key, toastResult);
  }

  stop(key: string) {
    const existingToast = this.activeToasts.get(key);
    if (existingToast) {
      existingToast.dismiss();
      this.activeToasts.delete(key);
    }
  }

  success(key: string, title: string, description?: string) {
    this.stop(key);
    toastVariants.success(title, description);
  }

  error(key: string, title: string, description?: string) {
    this.stop(key);
    toastVariants.error(title, description);
  }

  stopAll() {
    for (const [key] of this.activeToasts) {
      this.stop(key);
    }
  }
}

export const loadingToasts = new LoadingToastManager();