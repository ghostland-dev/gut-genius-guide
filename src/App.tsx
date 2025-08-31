import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnhancedErrorBoundary } from "@/components/ui/enhanced-error-boundary";
import { AccessibilityPanel, SkipToContent } from "@/components/ui/accessibility";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useAppState } from "@/hooks/useAppState";
import { SEO } from "@/components/SEO";
import { errorBoundaryLogger } from "@/lib/logger";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const AppContent = () => {
  usePerformanceMonitor();
  const { state } = useAppState();
  
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <SEO />
      <SkipToContent />
      <main id="main-content" className="relative">
        <OfflineIndicator />
        <PWAInstallPrompt />
        <Routes>
          <Route 
            path="/" 
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="lg" /></div>}>
                <Index />
              </Suspense>
            } 
          />
          <Route 
            path="/auth" 
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="lg" /></div>}>
                <Auth />
              </Suspense>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="lg" /></div>}>
                <Dashboard />
              </Suspense>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route 
            path="*" 
            element={
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner size="lg" /></div>}>
                <NotFound />
              </Suspense>
            } 
          />
        </Routes>
      </main>
      
      {/* Global UI Components */}
      <AccessibilityPanel />
    </div>
  );
};

const App = () => (
  <EnhancedErrorBoundary 
    onError={(error, errorInfo) => {
      errorBoundaryLogger.logError(error, errorInfo);
    }}
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </EnhancedErrorBoundary>
);

export default App;
