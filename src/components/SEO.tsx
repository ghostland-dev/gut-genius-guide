import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO = ({
  title = "SmartMealPlanner - Planification Nutritionnelle Intelligente",
  description = "Planifiez vos repas selon vos besoins médicaux spécifiques avec notre IA. Optimisez votre nutrition, économisez sur vos courses et améliorez votre santé.",
  keywords = "nutrition, planification repas, santé, régime médical, courses intelligentes, IA nutrition",
  image = "/hero-nutrition.jpg",
  url = "https://smartmealplanner.lovable.app"
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updatePropertyTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'SmartMealPlanner');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updatePropertyTag('og:title', title);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:url', url);
    updatePropertyTag('og:type', 'website');
    updatePropertyTag('og:locale', 'fr_FR');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Structured data for health and nutrition
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "SmartMealPlanner",
      "description": description,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      },
      "featureList": [
        "Planification de repas personnalisée",
        "Suivi nutritionnel médical",
        "Optimisation des courses",
        "Analyse IA des besoins"
      ]
    };

    let jsonLd = document.querySelector('#structured-data');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      jsonLd.setAttribute('id', 'structured-data');
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, image, url]);

  return null;
};