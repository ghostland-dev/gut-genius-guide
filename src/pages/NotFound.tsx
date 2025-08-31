import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { Home, ArrowLeft, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEO 
        title="Page non trouvée - SmartMealPlanner"
        description="La page demandée n'existe pas. Retournez à l'accueil de SmartMealPlanner."
      />
      
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gradient-card border-border/50 shadow-strong">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Page non trouvée</CardTitle>
            <CardDescription>
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link to="/">
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Page précédente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default NotFound;