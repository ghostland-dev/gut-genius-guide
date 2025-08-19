import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, ShoppingCart, Zap, Shield } from "lucide-react";
import heroImage from "@/assets/hero-nutrition.jpg";

export const HeroSection = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Zap className="h-4 w-4 text-primary mr-2" />
                <span className="text-primary font-medium text-sm">IA Nutritionnelle Avancée</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Nutrition
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Personnalisée</span>
                <br />
                pour Votre Santé
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Des programmes alimentaires adaptés à vos besoins médicaux spécifiques avec des listes de courses optimisées économiquement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Commencer Gratuitement
              </Button>
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                Voir la Démo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-sm text-muted-foreground">Conforme RGPD</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">IA Médicale</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-strong">
              <img 
                src={heroImage} 
                alt="Nutrition personnalisée et planification intelligente des repas"
                className="w-full h-full object-cover"
              />
            </Card>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/30 rounded-full blur-lg animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};