import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ShoppingCart, Target, FileText, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Programmes Neuropathiques",
    description: "Protocoles personnalisés pour la neuropathie avec adaptation des nutriments essentiels (vitamine B12, magnésium).",
    badge: "Médical"
  },
  {
    icon: ShoppingCart,
    title: "Listes de Courses Intelligentes",
    description: "Comparaison automatique des prix sur 10+ supermarchés pour optimiser votre budget santé.",
    badge: "Économie"
  },
  {
    icon: Target,
    title: "IA Nutritionnelle",
    description: "Analyse avancée de vos besoins avec détection des conflits alimentaires et suggestions personnalisées.",
    badge: "Intelligence"
  },
  {
    icon: FileText,
    title: "Import de Protocoles",
    description: "Importez vos protocoles médicaux (PDF/Excel) et laissez l'IA adapter vos repas automatiquement.",
    badge: "Flexibilité"
  },
  {
    icon: TrendingUp,
    title: "Suivi Nutritionnel",
    description: "Tableau de bord complet avec visualisation de vos apports en nutriments clés.",
    badge: "Suivi"
  },
  {
    icon: Users,
    title: "Version Professionnelle",
    description: "Outils dédiés aux nutritionnistes et professionnels de santé pour gérer leurs patients.",
    badge: "Pro"
  }
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-background-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="border-primary/30 text-primary">
            Fonctionnalités Avancées
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold">
            Nutrition <span className="bg-gradient-primary bg-clip-text text-transparent">Intelligente</span> et Personnalisée
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Une plateforme complète qui s'adapte à vos besoins médicaux spécifiques tout en optimisant votre budget.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-medium transition-smooth bg-gradient-card border-border/50">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};