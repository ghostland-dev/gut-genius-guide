import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
});

export const signupSchema = loginSchema.extend({
  firstName: z.string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  lastName: z.string()
    .min(1, 'Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Profile schemas
export const profileSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  age: z.number().min(16, 'Âge minimum 16 ans').max(120, 'Âge invalide'),
  gender: z.enum(['male', 'female', 'other']),
  height: z.number().min(100, 'Taille minimum 100cm').max(250, 'Taille maximum 250cm'),
  weight: z.number().min(30, 'Poids minimum 30kg').max(300, 'Poids maximum 300kg'),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});

// Meal planning schemas
export const mealSchema = z.object({
  name: z.string().min(1, 'Nom du repas requis').max(100, 'Nom trop long'),
  type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  calories: z.number().min(0, 'Calories invalides').max(2000, 'Calories trop élevées pour un repas'),
  protein: z.number().min(0, 'Protéines invalides'),
  carbs: z.number().min(0, 'Glucides invalides'), 
  fats: z.number().min(0, 'Lipides invalides'),
  ingredients: z.array(z.string().min(1, 'Ingrédient requis')).min(1, 'Au moins un ingrédient requis'),
  cookingTime: z.number().min(0, 'Temps de cuisson invalide').max(480, 'Temps de cuisson trop long'),
  servings: z.number().min(1, 'Au moins 1 portion').max(20, 'Trop de portions')
});

// Shopping list schemas
export const shoppingItemSchema = z.object({
  name: z.string().min(1, 'Nom de l\'article requis').max(100, 'Nom trop long'),
  quantity: z.string().min(1, 'Quantité requise'),
  category: z.enum(['fruits', 'vegetables', 'meat', 'fish', 'dairy', 'grains', 'other']),
  essential: z.boolean().default(false)
});

// Utility validation functions
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Au moins 8 caractères');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins une minuscule');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins une majuscule');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type ProfileData = z.infer<typeof profileSchema>;
export type MealData = z.infer<typeof mealSchema>;
export type ShoppingItemData = z.infer<typeof shoppingItemSchema>;