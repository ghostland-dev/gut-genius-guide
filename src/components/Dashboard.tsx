import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MealPlanner } from "@/components/MealPlanner";
import { ShoppingList } from "@/components/ShoppingList";
import { UserProfile } from "@/components/UserProfile";
import { 
  Brain, 
  ShoppingCart, 
  Target, 
  TrendingUp, 
  Calendar,
  FileText,
  Settings,
  Bell,
  Heart,
  Apple,
  Zap,
  User
} from "lucide-react";

const nutritionData = [
  { name: "Vitamine B12", current: 85, target: 100, unit: "µg", status: "good" },
  { name: "Magnésium", current: 320, target: 400, unit: "mg", status: "warning" },
  { name: "Oméga-3", current: 1.2, target: 2.0, unit: "g", status: "danger" },
  { name: "Vitamine D", current: 95, target: 100, unit: "µg", status: "good" }
];

const recentMealPlans = [
  {
    id: 1,
    name: "Programme Anti-Inflammatoire",
    type: "Neuropathique",
    duration: "7 jours",
    compliance: 92,
    status: "active"
  },
  {
    id: 2,
    name: "Menu Familial Équilibré",
    type: "Standard",
    duration: "14 jours", 
    compliance: 87,
    status: "completed"
  }
];

const shoppingLists = [
  {
    id: 1,
    name: "Liste Semaine 3",
    items: 24,
    estimatedCost: 67.50,
    savings: 12.30,
    supermarket: "Carrefour"
  },
  {
    id: 2,
    name: "Compléments Nutritionnels",
    items: 8,
    estimatedCost: 34.90,
    savings: 5.60,
    supermarket: "Leclerc"
  }
];

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background-secondary/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Tableau de Bord
                </h1>
                <p className="text-sm text-muted-foreground">Bon retour, Marie !</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="meals">Programmes</TabsTrigger>
            <TabsTrigger value="shopping">Courses</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Programmes Actifs</CardTitle>
                  <Brain className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+1 cette semaine</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Économies Réalisées</CardTitle>
                  <TrendingUp className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€47.20</div>
                  <p className="text-xs text-muted-foreground">Ce mois-ci</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Objectifs Atteints</CardTitle>
                  <Target className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">Moyenne hebdomadaire</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Score Santé</CardTitle>
                  <Zap className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92</div>
                  <p className="text-xs text-muted-foreground">Excellent</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Apple className="h-5 w-5 text-primary" />
                    <span>Programmes Récents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentMealPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div>
                        <h4 className="font-medium">{plan.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {plan.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{plan.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{plan.compliance}%</div>
                        <div className="text-xs text-muted-foreground">Suivi</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    <span>Listes de Courses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shoppingLists.map((list) => (
                    <div key={list.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <div>
                        <h4 className="font-medium">{list.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground">{list.items} articles</span>
                          <Badge variant="outline" className="text-xs">
                            {list.supermarket}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">€{list.estimatedCost}</div>
                        <div className="text-xs text-success">-€{list.savings}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-8">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Suivi Nutritionnel</CardTitle>
                <CardDescription>
                  Vos apports quotidiens en nutriments essentiels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {nutritionData.map((nutrient) => (
                  <div key={nutrient.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{nutrient.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {nutrient.current}/{nutrient.target} {nutrient.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(nutrient.current / nutrient.target) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs">
                      <span className={
                        nutrient.status === "good" ? "text-success" :
                        nutrient.status === "warning" ? "text-warning" : "text-danger"
                      }>
                        {Math.round((nutrient.current / nutrient.target) * 100)}% de l'objectif
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals" className="space-y-8">
            <MealPlanner />
          </TabsContent>

          <TabsContent value="shopping" className="space-y-8">
            <ShoppingList />
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};