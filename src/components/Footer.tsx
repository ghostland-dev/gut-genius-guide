import { Heart, Mail, Shield, FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-background-secondary/50 border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SmartMealPlanner
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nutrition personnalisée et intelligente pour votre santé. Des programmes adaptés à vos besoins médicaux spécifiques.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Produit</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-smooth">Fonctionnalités</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-smooth">Tarifs</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Démo</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">API</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Status</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Légal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-smooth flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Confidentialité</span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-smooth flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>CGU</span>
                </a>
              </li>
              <li><a href="#" className="hover:text-primary transition-smooth">RGPD</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Mentions légales</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 SmartMealPlanner. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-success" />
              <span>Conforme RGPD</span>
            </span>
            <span className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>contact@smartmealplanner.fr</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};