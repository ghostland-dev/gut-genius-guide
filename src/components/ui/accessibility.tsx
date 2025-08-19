import { useEffect } from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export const SkipLink = ({ href, children }: SkipLinkProps) => (
  <a
    href={href}
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium transition-smooth"
  >
    {children}
  </a>
);

interface ScreenReaderTextProps {
  children: React.ReactNode;
}

export const ScreenReaderText = ({ children }: ScreenReaderTextProps) => (
  <span className="sr-only">{children}</span>
);

// Hook pour annoncer les changements de page aux lecteurs d'écran
export const usePageAnnouncement = (pageTitle: string) => {
  useEffect(() => {
    document.title = `${pageTitle} | SmartMealPlanner`;
    
    // Créer un élément pour annoncer le changement de page
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Navigation vers ${pageTitle}`;
    
    document.body.appendChild(announcement);
    
    // Nettoyer après l'annonce
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [pageTitle]);
};

// Composant pour les régions de contenu principal
interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export const MainContent = ({ children, className = "" }: MainContentProps) => (
  <main 
    id="main-content"
    role="main" 
    tabIndex={-1}
    className={className}
  >
    {children}
  </main>
);