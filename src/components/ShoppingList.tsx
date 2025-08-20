import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Plus, Trash2, Store, TrendingDown, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  prices: {
    store: string;
    price: number;
    unit: string;
  }[];
  essential: boolean;
}

interface Store {
  name: string;
  logo: string;
  totalPrice: number;
  savings: number;
}

export const ShoppingList = () => {
  const { toast } = useToast();
  const [newItem, setNewItem] = useState('');
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    {
      id: '1',
      name: 'Flocons de sarrasin',
      quantity: '500g',
      category: 'Céréales',
      checked: false,
      prices: [
        { store: 'Carrefour', price: 3.45, unit: '€/kg' },
        { store: 'Leclerc', price: 3.20, unit: '€/kg' },
        { store: 'Auchan', price: 3.60, unit: '€/kg' }
      ],
      essential: true
    },
    {
      id: '2',
      name: 'Graines de courge bio',
      quantity: '200g',
      category: 'Graines & Noix',
      checked: false,
      prices: [
        { store: 'Carrefour', price: 8.90, unit: '€/kg' },
        { store: 'Leclerc', price: 8.50, unit: '€/kg' },
        { store: 'Auchan', price: 9.20, unit: '€/kg' }
      ],
      essential: true
    },
    {
      id: '3',
      name: 'Filet de saumon',
      quantity: '400g',
      category: 'Poisson',
      checked: false,
      prices: [
        { store: 'Carrefour', price: 24.90, unit: '€/kg' },
        { store: 'Leclerc', price: 23.50, unit: '€/kg' },
        { store: 'Auchan', price: 25.80, unit: '€/kg' }
      ],
      essential: false
    },
    {
      id: '4',
      name: 'Brocolis frais',
      quantity: '500g',
      category: 'Légumes',
      checked: false,
      prices: [
        { store: 'Carrefour', price: 2.80, unit: '€/kg' },
        { store: 'Leclerc', price: 2.90, unit: '€/kg' },
        { store: 'Auchan', price: 2.70, unit: '€/kg' }
      ],
      essential: false
    },
    {
      id: '5',
      name: 'Quinoa tricolore',
      quantity: '300g',
      category: 'Céréales',
      checked: true,
      prices: [
        { store: 'Carrefour', price: 12.50, unit: '€/kg' },
        { store: 'Leclerc', price: 11.90, unit: '€/kg' },
        { store: 'Auchan', price: 13.20, unit: '€/kg' }
      ],
      essential: false
    }
  ]);

  const stores: Store[] = [
    {
      name: 'Leclerc',
      logo: '🏪',
      totalPrice: calculateStoreTotal('Leclerc'),
      savings: calculateStoreSavings('Leclerc')
    },
    {
      name: 'Carrefour', 
      logo: '🛒',
      totalPrice: calculateStoreTotal('Carrefour'),
      savings: calculateStoreSavings('Carrefour')
    },
    {
      name: 'Auchan',
      logo: '🏬',
      totalPrice: calculateStoreTotal('Auchan'),
      savings: calculateStoreSavings('Auchan')
    }
  ];

  function calculateStoreTotal(storeName: string): number {
    return shoppingList.reduce((total, item) => {
      if (item.checked) return total;
      const storePrice = item.prices.find(p => p.store === storeName);
      if (storePrice) {
        const quantity = parseFloat(item.quantity.replace(/[^\d.]/g, '')) / 1000; // Convert to kg
        return total + (storePrice.price * quantity);
      }
      return total;
    }, 0);
  }

  function calculateStoreSavings(storeName: string): number {
    const allTotals = stores.map(store => calculateStoreTotal(store.name));
    const maxPrice = Math.max(...allTotals);
    const storePrice = calculateStoreTotal(storeName);
    return maxPrice - storePrice;
  }

  const addItem = () => {
    if (!newItem.trim()) return;
    
    const item: ShoppingItem = {
      id: Date.now().toString(),
      name: newItem,
      quantity: '1 unité',
      category: 'Autre',
      checked: false,
      prices: [
        { store: 'Carrefour', price: 0, unit: '€' },
        { store: 'Leclerc', price: 0, unit: '€' },
        { store: 'Auchan', price: 0, unit: '€' }
      ],
      essential: false
    };
    
    setShoppingList(prev => [...prev, item]);
    setNewItem('');
    toast({
      title: "Produit ajouté",
      description: `${newItem} a été ajouté à votre liste de courses.`
    });
  };

  const toggleItem = (id: string) => {
    setShoppingList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Produit supprimé",
      description: "Le produit a été retiré de votre liste."
    });
  };

  const categories = [...new Set(shoppingList.map(item => item.category))];
  const completedItems = shoppingList.filter(item => item.checked).length;
  const totalItems = shoppingList.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Liste de Courses Intelligente</h2>
          <p className="text-muted-foreground">
            {completedItems}/{totalItems} produits achetés • Économisez jusqu'à {stores[0].savings.toFixed(2)}€
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Ajouter un produit..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addItem()}
          className="flex-1"
        />
        <Button onClick={addItem}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Ma Liste</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison Prix</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {categories.map(category => {
            const categoryItems = shoppingList.filter(item => item.category === category);
            
            return (
              <Card key={category} className="shadow-gentle">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {category}
                    <Badge variant="secondary" className="ml-auto">
                      {categoryItems.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    {categoryItems.map(item => (
                      <div key={item.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        item.checked ? 'bg-muted/50 opacity-60' : 'bg-card'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(item.id)}
                          />
                          <div>
                            <div className={`font-medium ${item.checked ? 'line-through' : ''}`}>
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{item.quantity}</span>
                              {item.essential && (
                                <Badge variant="destructive" className="text-xs">
                                  Essentiel
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm">
                            <div className="font-semibold">
                              {Math.min(...item.prices.map(p => p.price)).toFixed(2)}€
                            </div>
                            <div className="text-muted-foreground text-xs">
                              Meilleur prix
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {stores.sort((a, b) => a.totalPrice - b.totalPrice).map((store, index) => (
              <Card key={store.name} className={`shadow-gentle ${
                index === 0 ? 'ring-2 ring-primary' : ''
              }`}>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{store.logo}</div>
                  <CardTitle className="flex items-center justify-center gap-2">
                    {store.name}
                    {index === 0 && (
                      <Badge variant="default" className="text-xs">
                        Meilleur prix
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Total: <span className="font-bold text-lg text-foreground">{store.totalPrice.toFixed(2)}€</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {store.savings > 0 && (
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                      <TrendingDown className="h-4 w-4" />
                      Économie: {store.savings.toFixed(2)}€
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {shoppingList.filter(item => !item.checked).slice(0, 3).map(item => {
                      const storePrice = item.prices.find(p => p.store === store.name);
                      return (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="truncate mr-2">{item.name}</span>
                          <span className="font-medium">{storePrice?.price.toFixed(2)}€</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <Button className="w-full" variant={index === 0 ? "default" : "outline"}>
                    <Store className="h-4 w-4 mr-2" />
                    {index === 0 ? "Choisir ce magasin" : "Voir détails"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="shadow-gentle">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Récapitulatif Économies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stores[0].savings.toFixed(2)}€</div>
                  <div className="text-sm text-muted-foreground">Économie maximale</div>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold">{totalItems - completedItems}</div>
                  <div className="text-sm text-muted-foreground">Produits restants</div>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold">{stores[0].totalPrice.toFixed(2)}€</div>
                  <div className="text-sm text-muted-foreground">Meilleur total</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};