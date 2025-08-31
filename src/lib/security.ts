// Security utilities for production app

// Input sanitization
export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

// XSS Prevention
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Content Security Policy helpers
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

// Rate limiting (client-side)
class RateLimit {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }
  
  getRemainingAttempts(key: string, limit: number, windowMs: number): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < windowMs);
    
    return Math.max(0, limit - validRequests.length);
  }
  
  getTimeUntilReset(key: string, windowMs: number): number {
    const requests = this.requests.get(key) || [];
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    const resetTime = oldestRequest + windowMs;
    
    return Math.max(0, resetTime - Date.now());
  }
}

export const rateLimiter = new RateLimit();

// Common rate limits
export const RATE_LIMITS = {
  LOGIN: { limit: 5, window: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  PASSWORD_RESET: { limit: 3, window: 60 * 60 * 1000 }, // 3 attempts per hour
  API_CALLS: { limit: 100, window: 60 * 1000 }, // 100 calls per minute
  FORM_SUBMISSION: { limit: 10, window: 60 * 1000 } // 10 submissions per minute
};

// Password strength checker
export interface PasswordStrength {
  score: number; // 0-100
  level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
  feedback: string[];
  passed: boolean;
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length >= 8) {
    score += 25;
  } else {
    feedback.push('Au moins 8 caractères requis');
  }
  
  // Complexity checks
  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Ajouter des lettres minuscules');
  }
  
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Ajouter des lettres majuscules');
  }
  
  if (/\d/.test(password)) {
    score += 15;
  } else {
    feedback.push('Ajouter des chiffres');
  }
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Ajouter des caractères spéciaux');
  }
  
  // Additional length bonus
  if (password.length >= 12) {
    score += 10;
  }
  
  // Common patterns penalty
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /azerty/i,
    /admin/i,
    /(.)\1{2,}/, // Repeated characters
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score -= 20;
      feedback.push('Éviter les motifs courants');
      break;
    }
  }
  
  score = Math.max(0, Math.min(100, score));
  
  let level: PasswordStrength['level'];
  if (score < 30) level = 'very-weak';
  else if (score < 50) level = 'weak';
  else if (score < 70) level = 'fair';
  else if (score < 90) level = 'good';
  else level = 'strong';
  
  return {
    score,
    level,
    feedback,
    passed: score >= 70
  };
};

// Session management
export class SecureSession {
  private static readonly SESSION_KEY = 'app_session';
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
  
  static create(userData: any): string {
    const sessionData = {
      user: userData,
      created: Date.now(),
      expires: Date.now() + this.MAX_AGE,
      id: crypto.randomUUID()
    };
    
    const sessionString = JSON.stringify(sessionData);
    localStorage.setItem(this.SESSION_KEY, sessionString);
    
    return sessionData.id;
  }
  
  static get(): any {
    try {
      const sessionString = localStorage.getItem(this.SESSION_KEY);
      if (!sessionString) return null;
      
      const session = JSON.parse(sessionString);
      
      // Check expiration
      if (Date.now() > session.expires) {
        this.destroy();
        return null;
      }
      
      return session.user;
    } catch (error) {
      console.error('Session error:', error);
      this.destroy();
      return null;
    }
  }
  
  static extend(): void {
    const session = this.getRaw();
    if (session) {
      session.expires = Date.now() + this.MAX_AGE;
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }
  
  static destroy(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
  
  private static getRaw(): any {
    try {
      const sessionString = localStorage.getItem(this.SESSION_KEY);
      return sessionString ? JSON.parse(sessionString) : null;
    } catch {
      return null;
    }
  }
  
  static isValid(): boolean {
    return this.get() !== null;
  }
  
  static getTimeUntilExpiry(): number {
    const session = this.getRaw();
    if (!session) return 0;
    
    return Math.max(0, session.expires - Date.now());
  }
}

// CSRF Protection (for form submissions)
export const generateCSRFToken = (): string => {
  return crypto.randomUUID();
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
};

// Secure headers helper
export const getSecureHeaders = (): Record<string, string> => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

// Data validation for API calls
export const validateApiResponse = (response: any): boolean => {
  try {
    // Basic structure validation
    if (typeof response !== 'object' || response === null) {
      return false;
    }
    
    // Check for required fields based on expected structure
    // This should be customized based on your API contract
    
    return true;
  } catch (error) {
    console.error('API response validation error:', error);
    return false;
  }
};

// Environment detection
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

// Secure logging
export const secureLog = (message: string, data?: any): void => {
  if (isDevelopment()) {
    console.log(message, data);
  }
  // In production, you might want to send to a logging service
};

export const secureError = (message: string, error?: any): void => {
  if (isDevelopment()) {
    console.error(message, error);
  }
  // In production, send to error tracking service without sensitive data
};