import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Heart, AlertTriangle, Target, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  medicalConditions: string[];
  allergies: string[];
  dietaryGoals: string[];
  customProtocol: string;
}

interface HealthMetrics {
  bmi: number;
  bmr: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
}

export const UserProfile = () => {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData>({
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.com',
    age: 35,
    weight: 65,
    height: 165,
    activityLevel: 'moderate',
    medicalConditions: ['Neuropathie périphérique', 'Diabète type 2'],
    allergies: ['Gluten', 'Lactose'],
    dietaryGoals: ['Réduction inflammation', 'Contrôle glycémique'],
    customProtocol: 'Programme anti-inflammatoire avec supplémentation en vitamine B12 (400mcg/jour) et magnésium (400mg/jour). Éviter: gluten, sucres raffinés, aliments pro-inflammatoires.'
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    bmi: 23.9,
    bmr: 1420,
    targetCalories: 1850,
    targetProtein: 85,
    targetCarbs: 200,
    targetFats: 65
  });

  const [notifications, setNotifications] = useState({
    mealReminders: true,
    shoppingUpdates: false,
    priceAlerts: true,
    healthTips: true
  });

  const medicalConditionsList = [
    'Neuropathie périphérique',
    'Diabète type 1',
    'Diabète type 2',
    'Hypertension',
    'Cholestérol élevé',
    'Maladie cardiaque',
    'Thyroïde',
    'Arthrite',
    'Fibromyalgie'
  ];

  const allergiesList = [
    'Gluten',
    'Lactose',
    'Œufs',
    'Noix',
    'Arachides',
    'Soja',
    'Poisson',
    'Fruits de mer',
    'Sésame'
  ];

  const updateUserData = (field: keyof UserData, value: any) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    
    // Recalculate health metrics if physical data changes
    if (['age', 'weight', 'height', 'activityLevel'].includes(field)) {
      calculateHealthMetrics();
    }
  };

  const calculateHealthMetrics = () => {
    const bmi = userData.weight / Math.pow(userData.height / 100, 2);
    
    // Mifflin-St Jeor Equation for BMR (female)
    const bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age - 161;
    
    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    const targetCalories = bmr * (activityMultipliers[userData.activityLevel] || 1.55);
    
    setHealthMetrics({
      bmi: parseFloat(bmi.toFixed(1)),
      bmr: Math.round(bmr),
      targetCalories: Math.round(targetCalories),
      targetProtein: Math.round(userData.weight * 1.2), // 1.2g per kg
      targetCarbs: Math.round(targetCalories * 0.45 / 4), // 45% of calories
      targetFats: Math.round(targetCalories * 0.30 / 9) // 30% of calories
    });
  };

  const addMedicalCondition = (condition: string) => {
    if (!userData.medicalConditions.includes(condition)) {
      updateUserData('medicalConditions', [...userData.medicalConditions, condition]);
    }
  };

  const removeMedicalCondition = (condition: string) => {
    updateUserData('medicalConditions', userData.medicalConditions.filter(c => c !== condition));
  };

  const addAllergy = (allergy: string) => {
    if (!userData.allergies.includes(allergy)) {
      updateUserData('allergies', [...userData.allergies, allergy]);
    }
  };

  const removeAllergy = (allergy: string) => {
    updateUserData('allergies', userData.allergies.filter(a => a !== allergy));
  };

  const saveProfile = () => {
    toast({
      title: "Profil sauvegardé",
      description: "Vos modifications ont été enregistrées avec succès.",
    });
  };

  const exportProtocol = () => {
    const data = {
      userData,
      healthMetrics,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mon-protocole-medical.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Protocole exporté",
      description: "Votre protocole médical a été téléchargé.",
    });
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Sous-poids', color: 'text-blue-600' };
    if (bmi < 25) return { label: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { label: 'Surpoids', color: 'text-orange-600' };
    return { label: 'Obésité', color: 'text-red-600' };
  };

  const bmiCategory = getBMICategory(healthMetrics.bmi);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Mon Profil</h2>
          <p className="text-muted-foreground">Gérez vos informations personnelles et médicales</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportProtocol}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={saveProfile}>
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personnel</TabsTrigger>
          <TabsTrigger value="health">Santé</TabsTrigger>
          <TabsTrigger value="protocol">Protocole</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>
                Ces informations nous aident à personnaliser vos recommandations nutritionnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={userData.firstName}
                    onChange={(e) => updateUserData('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={userData.lastName}
                    onChange={(e) => updateUserData('lastName', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => updateUserData('email', e.target.value)}
                />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Âge</Label>
                  <Input
                    id="age"
                    type="number"
                    value={userData.age}
                    onChange={(e) => updateUserData('age', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={userData.weight}
                    onChange={(e) => updateUserData('weight', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Taille (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={userData.height}
                    onChange={(e) => updateUserData('height', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activity">Niveau d'activité</Label>
                <Select value={userData.activityLevel} onValueChange={(value) => updateUserData('activityLevel', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sédentaire (peu ou pas d'exercice)</SelectItem>
                    <SelectItem value="light">Léger (exercice léger 1-3 fois/semaine)</SelectItem>
                    <SelectItem value="moderate">Modéré (exercice modéré 3-5 fois/semaine)</SelectItem>
                    <SelectItem value="active">Actif (exercice intense 6-7 fois/semaine)</SelectItem>
                    <SelectItem value="very_active">Très actif (exercice intense 2x/jour)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Métriques de Santé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{healthMetrics.bmi}</div>
                  <div className="text-sm text-muted-foreground">IMC</div>
                  <div className={`text-xs font-medium ${bmiCategory.color}`}>
                    {bmiCategory.label}
                  </div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold">{healthMetrics.bmr}</div>
                  <div className="text-sm text-muted-foreground">Métabolisme de base</div>
                  <div className="text-xs text-muted-foreground">kcal/jour</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold">{healthMetrics.targetCalories}</div>
                  <div className="text-sm text-muted-foreground">Calories cibles</div>
                  <div className="text-xs text-muted-foreground">kcal/jour</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold">{healthMetrics.targetProtein}g</div>
                  <div className="text-sm text-muted-foreground">Protéines cibles</div>
                  <div className="text-xs text-muted-foreground">par jour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Conditions Médicales
              </CardTitle>
              <CardDescription>
                Informez-nous de vos conditions médicales pour des recommandations adaptées
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {userData.medicalConditions.map(condition => (
                  <Badge key={condition} variant="destructive" className="cursor-pointer hover:bg-destructive/80" 
                         onClick={() => removeMedicalCondition(condition)}>
                    {condition} ×
                  </Badge>
                ))}
              </div>
              
              <Select onValueChange={addMedicalCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter une condition médicale" />
                </SelectTrigger>
                <SelectContent>
                  {medicalConditionsList.filter(c => !userData.medicalConditions.includes(c)).map(condition => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Allergies et Intolérances
              </CardTitle>
              <CardDescription>
                Précisez vos allergies pour éviter les aliments problématiques
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {userData.allergies.map(allergy => (
                  <Badge key={allergy} variant="secondary" className="cursor-pointer hover:bg-secondary/80"
                         onClick={() => removeAllergy(allergy)}>
                    {allergy} ×
                  </Badge>
                ))}
              </div>
              
              <Select onValueChange={addAllergy}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter une allergie" />
                </SelectTrigger>
                <SelectContent>
                  {allergiesList.filter(a => !userData.allergies.includes(a)).map(allergy => (
                    <SelectItem key={allergy} value={allergy}>{allergy}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocol" className="space-y-6">
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Protocole Médical Personnalisé
              </CardTitle>
              <CardDescription>
                Importez ou définissez votre protocole alimentaire personnalisé (neuropathique, anti-inflammatoire, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="protocol">Description du protocole</Label>
                <Textarea
                  id="protocol"
                  value={userData.customProtocol}
                  onChange={(e) => updateUserData('customProtocol', e.target.value)}
                  rows={6}
                  placeholder="Décrivez votre protocole alimentaire personnalisé..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Importer PDF/Excel
                </Button>
                <Button variant="outline">
                  Protocole pré-défini
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Protocole Actuel: Anti-inflammatoire + Neuropathique
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Supplémentation B12: 400mcg/jour</li>
                  <li>• Magnésium: 400mg/jour</li>
                  <li>• Éviter: gluten, sucres raffinés</li>
                  <li>• Privilégier: aliments riches en oméga-3</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configurez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rappels de repas</Label>
                  <div className="text-sm text-muted-foreground">
                    Recevoir des rappels pour vos repas programmés
                  </div>
                </div>
                <Switch
                  checked={notifications.mealReminders}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, mealReminders: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alertes prix</Label>
                  <div className="text-sm text-muted-foreground">
                    Notifications quand les prix baissent
                  </div>
                </div>
                <Switch
                  checked={notifications.priceAlerts}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, priceAlerts: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mises à jour courses</Label>
                  <div className="text-sm text-muted-foreground">
                    Notifications sur vos listes de courses
                  </div>
                </div>
                <Switch
                  checked={notifications.shoppingUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, shoppingUpdates: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Conseils santé</Label>
                  <div className="text-sm text-muted-foreground">
                    Recevoir des conseils nutritionnels personnalisés
                  </div>
                </div>
                <Switch
                  checked={notifications.healthTips}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, healthTips: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};