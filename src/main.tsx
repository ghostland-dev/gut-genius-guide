import { createRoot } from 'react-dom/client';
import { AppStateProvider } from '@/hooks/useAppState';
import { logger, performanceLogger } from '@/lib/logger';
import App from './App.tsx';
import './index.css';

// Initialize performance logging
performanceLogger.logPageLoad();

// Global error handling
window.addEventListener('error', (event) => {
  logger.error('Global Error', event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise Rejection', new Error(event.reason), {
    reason: event.reason
  });
});

createRoot(document.getElementById("root")!).render(
  <AppStateProvider>
    <App />
  </AppStateProvider>
);
