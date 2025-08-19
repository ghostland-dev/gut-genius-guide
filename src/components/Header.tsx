import { Button } from "@/components/ui/button";
import { Heart, Menu, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SmartMealPlanner
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-smooth">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-smooth">
              Tarifs
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-smooth">
              À propos
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <a href="/auth">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                Connexion
              </Button>
            </a>
            <a href="/auth">
              <Button variant="hero" size="sm">
                Commencer
              </Button>
            </a>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};