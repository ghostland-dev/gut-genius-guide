interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  context?: Record<string, any>;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  userId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isProduction = import.meta.env.PROD;

  private createEntry(level: LogEntry['level'], message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      context,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('user_id') || undefined
    };
  }

  private addLog(entry: LogEntry) {
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Send to external service in production
    if (this.isProduction && (entry.level === 'error' || entry.level === 'warn')) {
      this.sendToService(entry);
    }
  }

  private async sendToService(entry: LogEntry) {
    try {
      // Replace with your logging service (e.g., Sentry, LogRocket, etc.)
      console.log('Would send to logging service:', entry);
    } catch (error) {
      console.error('Failed to send log to service:', error);
    }
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createEntry('info', message, context);
    this.addLog(entry);
    if (!this.isProduction) {
      console.log(`[INFO] ${message}`, context);
    }
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createEntry('warn', message, context);
    this.addLog(entry);
    console.warn(`[WARN] ${message}`, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createEntry('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    });
    this.addLog(entry);
    console.error(`[ERROR] ${message}`, error, context);
  }

  debug(message: string, context?: Record<string, any>) {
    if (!this.isProduction) {
      const entry = this.createEntry('debug', message, context);
      this.addLog(entry);
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  getLogs(level?: LogEntry['level']): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Performance logging utilities
export const performanceLogger = {
  measure: (name: string, fn: () => any) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    logger.debug(`Performance: ${name}`, { duration: end - start });
    return result;
  },

  measureAsync: async (name: string, fn: () => Promise<any>) => {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    logger.debug(`Performance: ${name}`, { duration: end - start });
    return result;
  },

  logPageLoad: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      logger.info('Page Load Performance', {
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
      });
    }
  }
};

// Error boundary logging
export const errorBoundaryLogger = {
  logError: (error: Error, errorInfo: { componentStack?: string }) => {
    logger.error('React Error Boundary', error, {
      componentStack: errorInfo.componentStack || 'Unknown',
      timestamp: new Date().toISOString()
    });
  }
};