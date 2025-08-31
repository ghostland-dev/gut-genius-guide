import { useEffect } from "react";

interface PerformanceMetrics {
  pageLoadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
}

export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const metrics: PerformanceMetrics = {};
        
        // First Contentful Paint
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
        
        // Largest Contentful Paint
        if (entry.entryType === 'largest-contentful-paint') {
          metrics.largestContentfulPaint = entry.startTime;
        }
        
        // First Input Delay
        if (entry.entryType === 'first-input') {
          metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }

        // Log metrics (replace with your analytics service)
        if (Object.keys(metrics).length > 0) {
          console.log('Performance Metrics:', metrics);
          // Example: analytics.track('performance', metrics);
        }
      });
    });

    // Observe different performance entries
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input'] });
    } catch (error) {
      // Fallback for browsers that don't support some entry types
      console.warn('Some performance metrics not available');
    }

    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      console.log('Page Load Time:', loadTime);
      // Example: analytics.track('page_load_time', { duration: loadTime });
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Memory usage monitoring (optional)
  useEffect(() => {
    const checkMemoryUsage = () => {
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        const memoryUsage = {
          usedJSHeapSize: memInfo.usedJSHeapSize,
          totalJSHeapSize: memInfo.totalJSHeapSize,
          jsHeapSizeLimit: memInfo.jsHeapSizeLimit
        };
        
        // Log if memory usage is high (> 80% of limit)
        const usagePercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
        if (usagePercent > 80) {
          console.warn('High memory usage detected:', memoryUsage);
          // Example: analytics.track('memory_warning', memoryUsage);
        }
      }
    };

    const interval = setInterval(checkMemoryUsage, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
};