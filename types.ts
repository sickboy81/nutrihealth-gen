
export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface MicroNutrients {
  vitaminC: number; // mg
  vitaminD: number; // IU
  iron: number; // mg
  calcium: number; // mg
  magnesium: number; // mg
  // New additions
  vitaminA: number; // mcg
  vitaminB12: number; // mcg
  potassium: number; // mg
  sodium: number; // mg
  zinc: number; // mg
}

export interface MealAnalysis {
  calories: number;
  macros: MacroNutrients;
  micros: MicroNutrients;
  identifiedFoods: string[];
  servingSize?: string; // Added serving size field
}

export type RecipeType = 'Salada' | 'Prato Principal' | 'Bebida' | 'Café da Manhã' | 'Sopa' | 'Lanche';

export interface Recipe {
  id: number;
  name: string;
  time: string;
  calories: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  type: RecipeType;
  image: string;
  ingredients: string[];
  steps: string[];
  tags?: string[]; // 'Vegan', 'Vegetarian', 'Gluten-Free', etc.
}

export type DietaryPreference = 'Omnivore' | 'Vegetarian' | 'Vegan';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Objective = 'lose_weight' | 'maintain' | 'gain_muscle';

export interface UserProfile {
    name: string;
    age: number;
    height: number;
    weight: number;
    bmi: number;
    dietaryPreference: DietaryPreference;
    gender: Gender;
    activityLevel: ActivityLevel;
    objective: Objective;
    takesMultivitamin: boolean; // New field for daily reminder preference
}

export interface NutrientGoal {
    current: number;
    target: number;
}

export interface DailyGoal {
    calories: NutrientGoal;
    protein: NutrientGoal;
    carbs: NutrientGoal;
    fat: NutrientGoal;
    water: NutrientGoal;
    supplementTaken: boolean; // New field to track if daily vitamin was taken
    // Micros
    vitaminC: NutrientGoal;
    vitaminD: NutrientGoal;
    iron: NutrientGoal;
    calcium: NutrientGoal;
    magnesium: NutrientGoal;
    // New Micros
    vitaminA: NutrientGoal;
    vitaminB12: NutrientGoal;
    potassium: NutrientGoal;
    sodium: NutrientGoal;
    zinc: NutrientGoal;
}

export interface GoalsHistoryItem {
    date: string;
    goals: DailyGoal;
}

export interface Meal {
    name: string;
    description: string;
    calories: number;
    ingredients: string[];
    steps: string[];
}

export interface DayPlan {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
}

export interface WeeklyPlan {
    monday: DayPlan;
    tuesday: DayPlan;
    wednesday: DayPlan;
    thursday: DayPlan;
    friday: DayPlan;
    saturday: DayPlan;
    sunday: DayPlan;
}

export interface SavedPlan {
    timestamp: number;
    plan: WeeklyPlan;
}

export interface CalorieRecord {
    date: string; // YYYY-MM-DD
    kcal: number;
}

export interface FastingState {
    isFasting: boolean;
    startTime: number | null; // timestamp
    targetDuration: number; // in hours
    protocol: string; // e.g., '16:8'
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

export interface ShoppingItem {
    item: string;
    category: string;
    checked: boolean;
}

export interface ShoppingList {
    id: string; // Usually linked to a plan timestamp or 'current'
    items: ShoppingItem[];
}

export interface ActivityRecord {
    id: string;
    name: string;
    caloriesBurned: number;
    durationMinutes: number;
    timestamp: number;
}

// --- NEW GAMIFICATION & TRACKING TYPES ---

export type MoodType = 'great' | 'good' | 'okay' | 'tired' | 'stressed';

export interface MoodRecord {
    date: string; // YYYY-MM-DD
    mood: MoodType;
}

export interface WeightRecord {
    date: string; // YYYY-MM-DD
    weight: number;
}

export interface Achievement {
    id: string;
    titleKey: string; // Key for translation
    descKey: string;  // Key for translation
    icon: string; // 'trophy', 'water', 'fire', 'chef'
    condition: (data: any, metric: number) => boolean;
}

export interface UnlockedAchievement {
    id: string;
    unlockedAt: number;
}

export interface GamificationState {
    xp: number;
    level: number;
    unlockedAchievements: UnlockedAchievement[];
}

// --- NEW CHALLENGE TYPES ---

export interface ChallengeTask {
    day: number;
    title: string;
    description: string;
    completed: boolean;
}

export interface ChallengeState {
    isActive: boolean;
    tasks: ChallengeTask[];
    startDate: number | null;
}

export interface AppPreferences {
    showGamification: boolean;
    showChallenges: boolean;
}

// --- NEW SLEEP TRACKER TYPES ---

export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';

export interface SleepRecord {
    date: string; // YYYY-MM-DD
    durationHours: number;
    quality: SleepQuality;
}
