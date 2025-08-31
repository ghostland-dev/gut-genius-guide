import { useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
}

export const useAnalytics = () => {
  useEffect(() => {
    // Track page view on mount
    trackPageView();
  }, []);

  const trackPageView = (page?: string) => {
    const currentPage = page || window.location.pathname;
    console.log('Page View:', currentPage);
    
    // Replace with your analytics service (Google Analytics, Mixpanel, etc.)
    // Example: gtag('event', 'page_view', { page_title: document.title, page_location: window.location.href });
  };

  const trackEvent = ({ event, properties }: AnalyticsEvent) => {
    console.log('Analytics Event:', event, properties);
    
    // Replace with your analytics service
    // Example: gtag('event', event, properties);
    // Example: mixpanel.track(event, properties);
  };

  const trackUserAction = (action: string, category?: string, label?: string, value?: number) => {
    trackEvent({
      event: 'user_action',
      properties: {
        action,
        category: category || 'general',
        label,
        value,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      }
    });
  };

  const trackMealPlanAction = (action: string, planType?: string) => {
    trackEvent({
      event: 'meal_plan_interaction',
      properties: {
        action,
        plan_type: planType,
        timestamp: new Date().toISOString()
      }
    });
  };

  const trackNutritionGoal = (goalType: string, value: number) => {
    trackEvent({
      event: 'nutrition_goal_set',
      properties: {
        goal_type: goalType,
        value,
        timestamp: new Date().toISOString()
      }
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackUserAction,
    trackMealPlanAction,
    trackNutritionGoal
  };
};