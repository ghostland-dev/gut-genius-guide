import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Utensils, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  cookingTime: number;
  servings: number;
}

interface DayPlan {
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export const MealPlanner = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  
  const sampleMeals: Meal[] = [
    {
      type: 'breakfast',
      name: 'Porridge aux graines de courge',
      calories: 320,
      protein: 12,
      carbs: 45,
      fats: 8,
      ingredients: ['Flocons de sarrasin', 'Graines de courge', 'Lait d\'amande', 'Myrtilles'],
      cookingTime: 10,
      servings: 1
    },
    {
      type: 'lunch',
      name: 'Saumon aux légumes vapeur',
      calories: 450,
      protein: 35,
      carbs: 20,
      fats: 25,
      ingredients: ['Filet de saumon', 'Brocolis', 'Courgettes', 'Huile d\'olive'],
      cookingTime: 25,
      servings: 1
    },
    {
      type: 'dinner',
      name: 'Salade de quinoa aux légumes',
      calories: 380,
      protein: 15,
      carbs: 52,
      fats: 12,
      ingredients: ['Quinoa', 'Tomates cerises', 'Concombre', 'Avocat', 'Graines de tournesol'],
      cookingTime: 20,
      servings: 1
    }
  ];

  const generateWeekPlan = () => {
    const plan: DayPlan[] = [];
    const startDate = new Date(selectedDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayMeals = [
        sampleMeals[0], // breakfast
        sampleMeals[1], // lunch  
        sampleMeals[2]  // dinner
      ];
      
      const dayPlan: DayPlan = {
        date: date.toISOString().split('T')[0],
        meals: dayMeals,
        totalCalories: dayMeals.reduce((sum, meal) => sum + meal.calories, 0),
        totalProtein: dayMeals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCarbs: dayMeals.reduce((sum, meal) => sum + meal.carbs, 0),
        totalFats: dayMeals.reduce((sum, meal) => sum + meal.fats, 0)
      };
      
      plan.push(dayPlan);
    }
    
    setWeekPlan(plan);
    toast({
      title: "Programme généré",
      description: "Votre plan de repas pour la semaine a été créé avec succès."
    });
  };

  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: 'Petit-déjeuner',
      lunch: 'Déjeuner', 
      dinner: 'Dîner',
      snack: 'Collation'
    };
    return labels[type] || type;
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🥣';
      case 'lunch': return '🍽️';
      case 'dinner': return '🥗';
      case 'snack': return '🍎';
      default: return '🍴';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Planificateur de Repas</h2>
          <p className="text-muted-foreground">Créez vos programmes alimentaires personnalisés</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="date-select">Date de début</Label>
            <Input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-auto"
            />
          </div>
          <Button onClick={generateWeekPlan} className="h-10 self-end">
            <Calendar className="h-4 w-4 mr-2" />
            Générer Programme
          </Button>
        </div>
      </div>

      <Tabs defaultValue="week" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">Vue Semaine</TabsTrigger>
          <TabsTrigger value="recipes">Suggestions Recettes</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-4">
          {weekPlan.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun programme généré</h3>
                <p className="text-muted-foreground">Cliquez sur "Générer Programme" pour créer votre plan de repas</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {weekPlan.map((day, index) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' });
                const dateStr = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
                
                return (
                  <Card key={day.date} className="shadow-gentle">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="capitalize">{dayName}</CardTitle>
                          <CardDescription>{dateStr}</CardDescription>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-semibold text-primary">{day.totalCalories} kcal</div>
                          <div className="text-muted-foreground">
                            P: {day.totalProtein}g • G: {day.totalCarbs}g • L: {day.totalFats}g
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid gap-3">
                        {day.meals.map((meal, mealIndex) => (
                          <div key={mealIndex} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{getMealIcon(meal.type)}</span>
                              <div>
                                <div className="font-medium">{meal.name}</div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {meal.cookingTime}min
                                  </span>
                                  <span className="flex items-center">
                                    <Users className="h-3 w-3 mr-1" />
                                    {meal.servings} pers.
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold text-sm">{meal.calories} kcal</div>
                              <Badge variant="secondary" className="text-xs">
                                {getMealTypeLabel(meal.type)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleMeals.map((meal, index) => (
              <Card key={index} className="shadow-gentle hover:shadow-strong transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <Badge variant="outline">{getMealTypeLabel(meal.type)}</Badge>
                  </div>
                  <CardDescription>
                    {meal.calories} kcal • {meal.cookingTime} min • {meal.servings} pers.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center p-2 bg-primary/5 rounded">
                      <div className="font-semibold text-primary">{meal.protein}g</div>
                      <div className="text-muted-foreground">Protéines</div>
                    </div>
                    <div className="text-center p-2 bg-secondary/10 rounded">
                      <div className="font-semibold">{meal.carbs}g</div>
                      <div className="text-muted-foreground">Glucides</div>
                    </div>
                    <div className="text-center p-2 bg-accent/10 rounded">
                      <div className="font-semibold">{meal.fats}g</div>
                      <div className="text-muted-foreground">Lipides</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Ingrédients</h4>
                    <div className="flex flex-wrap gap-1">
                      {meal.ingredients.map((ingredient, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter au programme
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};