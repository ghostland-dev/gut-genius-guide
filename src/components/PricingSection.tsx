import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap } from "lucide-react";

const plans = [
  {
    name: "Gratuit",
    price: "0",
    description: "Parfait pour commencer",
    features: [
      "1 programme par semaine",
      "2 supermarchés comparés",
      "Profils basiques",
      "Support communautaire"
    ],
    variant: "outline" as const,
    badge: null
  },
  {
    name: "Essentiel",
    price: "4,90",
    description: "Pour un usage régulier",
    features: [
      "3 programmes personnalisés",
      "5 supermarchés comparés",
      "Export PDF des listes",
      "Support par email",
      "Alertes nutritionnelles"
    ],
    variant: "default" as const,
    badge: null
  },
  {
    name: "Premium",
    price: "9,90",
    description: "Solution complète",
    features: [
      "Programmes illimités",
      "10+ supermarchés comparés",
      "IA nutritionnelle avancée",
      "Profils multiples",
      "Suivi nutritionnel complet",
      "Support prioritaire"
    ],
    variant: "premium" as const,
    badge: "Populaire"
  },
  {
    name: "Neuro+",
    price: "14,90",
    description: "Spécialisé médical",
    features: [
      "Tout Premium inclus",
      "Protocoles neuropathiques",
      "Analyse médicale avancée",
      "Import de protocoles PDF",
      "Consultation IA médicale",
      "Rapports détaillés"
    ],
    variant: "success" as const,
    badge: "Médical"
  }
];

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="border-primary/30 text-primary">
            Tarification Transparente
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold">
            Choisissez Votre <span className="bg-gradient-primary bg-clip-text text-transparent">Formule</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Des plans adaptés à tous les besoins, de l'usage personnel aux protocoles médicaux spécialisés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative group hover:shadow-medium transition-smooth ${
                plan.badge === "Populaire" ? "border-primary/50 shadow-medium" : "bg-gradient-card border-border/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge 
                    variant={plan.badge === "Populaire" ? "default" : "secondary"}
                    className="bg-gradient-primary text-primary-foreground"
                  >
                    {plan.badge === "Populaire" && <Star className="h-3 w-3 mr-1" />}
                    {plan.badge === "Médical" && <Zap className="h-3 w-3 mr-1" />}
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center space-y-4 pt-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="text-4xl font-bold">
                    {plan.price}€
                    <span className="text-lg font-normal text-muted-foreground">/mois</span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.variant} 
                  className="w-full" 
                  size="lg"
                >
                  {plan.price === "0" ? "Commencer" : "Choisir ce plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Besoin d'une solution sur mesure pour votre clinique ?
          </p>
          <Button variant="outline" size="lg">
            Contactez-nous pour la version Pro Clinic
          </Button>
        </div>
      </div>
    </section>
  );
};