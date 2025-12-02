import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabase';
import type { DailyGoal, MealAnalysis, WeeklyPlan, GoalsHistoryItem, DayPlan, Meal, SavedPlan, Recipe, CalorieRecord, FastingState, ChatMessage, ShoppingList, ActivityRecord, ShoppingItem, UserProfile, NutrientGoal, GamificationState, MoodRecord, WeightRecord, MoodType, Achievement, ChallengeState, ChallengeTask, AppPreferences, SleepRecord, SleepQuality } from '../types';
import { MOCK_DAILY_GOALS, MOCK_CALORIE_HISTORY, MOCK_FREQUENT_FOODS, MOCK_RECIPES, MOCK_USER_PROFILE, MOCK_WEIGHT_HISTORY, ACHIEVEMENTS_LIST } from '../constants';
import { getRecipeImageUrl } from '../utils/imageHelper';

interface UserDataContextType {
    dailyGoals: DailyGoal;
    calorieHistory: CalorieRecord[];
    frequentFoods: string[];
    lastGeneratedPlan: WeeklyPlan | null;
    recipes: Recipe[];
    savedRecipes: number[];
    goalsHistory: GoalsHistoryItem[];
    savedPlans: SavedPlan[];
    fastingState: FastingState;
    chatHistory: ChatMessage[];
    shoppingList: ShoppingList | null;
    activityLog: ActivityRecord[];
    assistantName: string;
    userProfile: UserProfile;
    gamification: GamificationState;
    moodHistory: MoodRecord[];
    weightHistory: WeightRecord[];
    challenge: ChallengeState;
    preferences: AppPreferences;
    sleepHistory: SleepRecord[];
    logMeal: (meal: MealAnalysis) => void;
    logWater: (amount: number) => void;
    updateDailyGoals: (newGoals: DailyGoal) => void;
    setHealthPlan: (plan: WeeklyPlan | null) => void;
    addRecipe: (recipe: Recipe) => void;
    updateRecipeImage: (recipeId: number, newImageUrl: string) => void;
    toggleSaveRecipe: (recipeId: number) => void;
    replaceMealInPlan: (day: keyof WeeklyPlan, mealType: keyof DayPlan, newMeal: Meal) => void;
    saveCurrentPlan: () => void;
    deleteSavedPlan: (timestamp: number) => void;
    loadSavedPlan: (plan: WeeklyPlan) => void;
    startFasting: (duration: number, protocol: string) => void;
    stopFasting: () => void;
    addChatMessage: (role: 'user' | 'model', text: string) => void;
    setShoppingList: (items: ShoppingItem[]) => void;
    toggleShoppingItem: (index: number) => void;
    logActivity: (name: string, calories: number, duration: number) => void;
    clearChat: () => void;
    setAssistantName: (name: string) => void;
    updateUserProfile: (profile: UserProfile) => void;
    updateGoals: (goals: { primaryGoal: string; activityLevel: string }) => void;
    updateProfile: (profile: Partial<UserProfile>) => void;
    logSupplement: () => void;
    toggleDailySupplement: () => void;
    logMood: (mood: MoodType) => void;
    logWeight: (weight: number) => void;
    addXP: (amount: number) => void;
    startChallenge: (tasks: ChallengeTask[]) => void;
    completeChallengeTask: (day: number) => void;
    togglePreference: (key: keyof AppPreferences) => void;
    logSleep: (duration: number, quality: SleepQuality) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
            const parsedItem = JSON.parse(item);
            if (Array.isArray(defaultValue) && !Array.isArray(parsedItem.data)) return defaultValue;
            if (typeof defaultValue === 'object' && defaultValue !== null && !Array.isArray(defaultValue) && (typeof parsedItem.data !== 'object' || Array.isArray(parsedItem.data))) return defaultValue;

            if (key === 'dailyGoals') {
                const storedGoals = parsedItem.data;
                return {
                    ...defaultValue, ...storedGoals,
                    supplementTaken: storedGoals.supplementTaken || false,
                    vitaminA: storedGoals.vitaminA || (defaultValue as any).vitaminA,
                    vitaminB12: storedGoals.vitaminB12 || (defaultValue as any).vitaminB12,
                    potassium: storedGoals.potassium || (defaultValue as any).potassium,
                    sodium: storedGoals.sodium || (defaultValue as any).sodium,
                    zinc: storedGoals.zinc || (defaultValue as any).zinc
                };
            }

            if (key === 'userProfile') {
                let updatedProfile = { ...defaultValue, ...parsedItem.data };
                if (!parsedItem.data.dietaryPreference) {
                    updatedProfile = { ...updatedProfile, dietaryPreference: 'Omnivore', gender: 'male', activityLevel: 'moderate', objective: 'maintain' };
                }
                if (!parsedItem.data.gender) {
                    updatedProfile = { ...updatedProfile, gender: 'male', activityLevel: 'moderate', objective: 'maintain' };
                }
                if (parsedItem.data.takesMultivitamin === undefined) {
                    updatedProfile = { ...updatedProfile, takesMultivitamin: false };
                }
                return updatedProfile;
            }

            return parsedItem.data;
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
    }
    return defaultValue;
};

const BROKEN_IMAGE_DOMAINS = ['source.unsplash.com', 'via.placeholder.com'];
const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476718406336-bb5a98c095ea?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop'
];

const calculateAutoGoals = (profile: UserProfile, currentGoals: DailyGoal): DailyGoal => {
    let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age);
    if (profile.gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    const activityMultipliers: Record<string, number> = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    };

    const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.2);

    let targetCalories = tdee;
    if (profile.objective === 'lose_weight') targetCalories -= 500;
    else if (profile.objective === 'gain_muscle') targetCalories += 300;

    targetCalories = Math.max(1200, Math.round(targetCalories));

    let pRatio = 0.3;
    let cRatio = 0.4;
    let fRatio = 0.3;

    if (profile.objective === 'gain_muscle') {
        pRatio = 0.3; cRatio = 0.5; fRatio = 0.2;
    }
    if (profile.objective === 'lose_weight') {
        pRatio = 0.4; cRatio = 0.3; fRatio = 0.3;
    }

    const protein = Math.round((targetCalories * pRatio) / 4);
    const carbs = Math.round((targetCalories * cRatio) / 4);
    const fat = Math.round((targetCalories * fRatio) / 9);
    const water = Math.round(profile.weight * 35);

    return {
        ...currentGoals,
        calories: { ...currentGoals.calories, target: targetCalories },
        protein: { ...currentGoals.protein, target: protein },
        carbs: { ...currentGoals.carbs, target: carbs },
        fat: { ...currentGoals.fat, target: fat },
        water: { ...currentGoals.water, target: water },
    };
};


export const UserDataProvider = ({ children }: React.PropsWithChildren<{}>) => {
    const { user } = useAuth();
    const [dailyGoals, setDailyGoals] = useState<DailyGoal>(() => getInitialState('dailyGoals', MOCK_DAILY_GOALS));
    const [calorieHistory, setCalorieHistory] = useState<CalorieRecord[]>(() => getInitialState('calorieHistory', MOCK_CALORIE_HISTORY));
    const [frequentFoods, setFrequentFoods] = useState<string[]>(() => getInitialState('frequentFoods', MOCK_FREQUENT_FOODS));
    const [lastGeneratedPlan, setLastGeneratedPlan] = useState<WeeklyPlan | null>(() => getInitialState('lastGeneratedPlan', null));
    const [recipes, setRecipes] = useState<Recipe[]>(() => getInitialState('recipes', MOCK_RECIPES));
    const [savedRecipes, setSavedRecipes] = useState<number[]>(() => getInitialState('savedRecipes', []));
    const [goalsHistory, setGoalsHistory] = useState<GoalsHistoryItem[]>(() => getInitialState('goalsHistory', []));
    const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => getInitialState('savedPlans', []));
    const [fastingState, setFastingState] = useState<FastingState>(() => getInitialState('fastingState', {
        isFasting: false,
        startTime: null,
        targetDuration: 16,
        protocol: '16:8'
    }));
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => getInitialState('chatHistory', []));
    const [shoppingList, setShoppingListState] = useState<ShoppingList | null>(() => getInitialState('shoppingList', null));
    const [activityLog, setActivityLog] = useState<ActivityRecord[]>(() => getInitialState('activityLog', []));
    const [assistantName, setAssistantName] = useState<string>(() => getInitialState('assistantName', 'Lia'));
    const [userProfile, setUserProfile] = useState<UserProfile>(() => getInitialState('userProfile', MOCK_USER_PROFILE));

    // NEW STATES
    const [gamification, setGamification] = useState<GamificationState>(() => getInitialState('gamification', { xp: 0, level: 1, unlockedAchievements: [] }));
    const [moodHistory, setMoodHistory] = useState<MoodRecord[]>(() => getInitialState('moodHistory', []));
    const [weightHistory, setWeightHistory] = useState<WeightRecord[]>(() => getInitialState('weightHistory', MOCK_WEIGHT_HISTORY));
    const [challenge, setChallenge] = useState<ChallengeState>(() => getInitialState('challenge', { isActive: false, tasks: [], startDate: null }));
    const [preferences, setPreferences] = useState<AppPreferences>(() => getInitialState('preferences', { showGamification: true, showChallenges: true }));
    const [sleepHistory, setSleepHistory] = useState<SleepRecord[]>(() => getInitialState('sleepHistory', []));

    useEffect(() => {
        setRecipes(prevRecipes => {
            let hasChanges = false;
            const repairedRecipes = prevRecipes.map(recipe => {
                // Enhanced check for broken images (empty string, null, known bad domains)
                const isBroken = !recipe.image || recipe.image.trim() === '' || BROKEN_IMAGE_DOMAINS.some(domain => recipe.image.includes(domain));
                const missingTags = !recipe.tags;

                if (isBroken || missingTags) {
                    hasChanges = true;
                    let newRecipe = { ...recipe };
                    if (isBroken) {
                        // Use the helper function to get a better image based on recipe name and type
                        newRecipe.image = getRecipeImageUrl(recipe.name, recipe.type, recipe.image);
                    }
                    if (missingTags) {
                        const mockRecipe = MOCK_RECIPES.find(r => r.id === recipe.id);
                        newRecipe.tags = mockRecipe ? mockRecipe.tags : [];
                    }
                    return newRecipe;
                }
                return recipe;
            });

            const currentIds = new Set(prevRecipes.map(r => r.id));
            const missingRecipes = MOCK_RECIPES.filter(r => !currentIds.has(r.id));

            if (missingRecipes.length > 0) {
                hasChanges = true;
                return [...repairedRecipes, ...missingRecipes];
            }

            return hasChanges ? repairedRecipes : prevRecipes;
        });

        const storedGoalsRaw = window.localStorage.getItem('dailyGoals');
        if (!storedGoalsRaw) return;

        try {
            const storedGoals = JSON.parse(storedGoalsRaw);
            const today = new Date().toDateString();

            if (storedGoals.date !== today) {
                const yesterdayGoals = storedGoals.data as DailyGoal;
                const totalProgress = yesterdayGoals.calories.current + yesterdayGoals.water.current;
                if (totalProgress > 0) {
                    setGoalsHistory(prevHistory => {
                        const alreadyArchived = prevHistory.some(item => item.date === storedGoals.date);
                        if (!alreadyArchived) {
                            const newHistoryEntry: GoalsHistoryItem = {
                                date: storedGoals.date,
                                goals: yesterdayGoals,
                            };
                            return [newHistoryEntry, ...prevHistory];
                        }
                        return prevHistory;
                    });
                }

                setDailyGoals(prevGoals => {
                    const resetGoals = { ...prevGoals };
                    resetGoals.supplementTaken = false;
                    Object.keys(resetGoals).forEach(key => {
                        const k = key as keyof DailyGoal;
                        if (resetGoals[k] && typeof resetGoals[k] === 'object') {
                            resetGoals[k] = { ...resetGoals[k], current: 0 };
                        }
                    });
                    return resetGoals;
                });

                setActivityLog([]);
            }
        } catch (error) {
            console.error('Error handling daily reset logic:', error);
        }
    }, []);

    // Sync from Cloud on Login
    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                const { data, error } = await supabase
                    .from('user_data')
                    .select('data')
                    .eq('user_id', user.id)
                    .single();

                if (data && data.data) {
                    const cloudData = data.data;
                    if (cloudData.profile) setUserProfile(cloudData.profile);
                    if (cloudData.goals) setDailyGoals(cloudData.goals);
                    if (cloudData.preferences) setPreferences(cloudData.preferences);
                    if (cloudData.gamification) setGamification(cloudData.gamification);
                    if (cloudData.recipes) setRecipes(cloudData.recipes);
                    if (cloudData.savedRecipes) setSavedRecipes(cloudData.savedRecipes);
                    if (cloudData.lastGeneratedPlan) setLastGeneratedPlan(cloudData.lastGeneratedPlan);
                    if (cloudData.savedPlans) setSavedPlans(cloudData.savedPlans);
                    if (cloudData.calorieHistory) setCalorieHistory(cloudData.calorieHistory);
                    if (cloudData.goalsHistory) setGoalsHistory(cloudData.goalsHistory);
                    if (cloudData.fastingState) setFastingState(cloudData.fastingState);
                    if (cloudData.chatHistory) setChatHistory(cloudData.chatHistory);
                    if (cloudData.shoppingList) setShoppingListState(cloudData.shoppingList);
                    if (cloudData.activityLog) setActivityLog(cloudData.activityLog);
                    if (cloudData.assistantName) setAssistantName(cloudData.assistantName);
                    if (cloudData.moodHistory) setMoodHistory(cloudData.moodHistory);
                    if (cloudData.weightHistory) setWeightHistory(cloudData.weightHistory);
                    if (cloudData.challenge) setChallenge(cloudData.challenge);
                    if (cloudData.sleepHistory) setSleepHistory(cloudData.sleepHistory);
                }
            };
            fetchUserData();
        }
    }, [user]);

    // Sync to Cloud Helper
    const syncToCloud = async (fullData: any) => {
        if (user) {
            await supabase
                .from('user_data')
                .upsert({
                    user_id: user.id,
                    data: fullData,
                    updated_at: new Date().toISOString()
                });
        }
    };

    // Persistence Effect
    useEffect(() => {
        try {
            const fullData = {
                dailyGoals, calorieHistory, frequentFoods, lastGeneratedPlan, recipes, savedRecipes, goalsHistory, savedPlans, fastingState, chatHistory, shoppingList, activityLog, assistantName, userProfile, gamification, moodHistory, weightHistory, challenge, preferences, sleepHistory
            };

            window.localStorage.setItem('dailyGoals', JSON.stringify({ date: new Date().toDateString(), data: dailyGoals }));
            window.localStorage.setItem('calorieHistory', JSON.stringify({ data: calorieHistory }));
            window.localStorage.setItem('frequentFoods', JSON.stringify({ data: frequentFoods }));
            window.localStorage.setItem('lastGeneratedPlan', JSON.stringify({ data: lastGeneratedPlan }));
            window.localStorage.setItem('recipes', JSON.stringify({ data: recipes }));
            window.localStorage.setItem('savedRecipes', JSON.stringify({ data: savedRecipes }));
            window.localStorage.setItem('goalsHistory', JSON.stringify({ data: goalsHistory }));
            window.localStorage.setItem('savedPlans', JSON.stringify({ data: savedPlans }));
            window.localStorage.setItem('fastingState', JSON.stringify({ data: fastingState }));
            window.localStorage.setItem('chatHistory', JSON.stringify({ data: chatHistory }));
            window.localStorage.setItem('shoppingList', JSON.stringify({ data: shoppingList }));
            window.localStorage.setItem('activityLog', JSON.stringify({ data: activityLog }));
            window.localStorage.setItem('assistantName', JSON.stringify({ data: assistantName }));
            window.localStorage.setItem('userProfile', JSON.stringify({ data: userProfile }));
            window.localStorage.setItem('gamification', JSON.stringify({ data: gamification }));
            window.localStorage.setItem('moodHistory', JSON.stringify({ data: moodHistory }));
            window.localStorage.setItem('weightHistory', JSON.stringify({ data: weightHistory }));
            window.localStorage.setItem('challenge', JSON.stringify({ data: challenge }));
            window.localStorage.setItem('preferences', JSON.stringify({ data: preferences }));
            window.localStorage.setItem('sleepHistory', JSON.stringify({ data: sleepHistory }));

            // Debounced sync to cloud
            const timeoutId = setTimeout(() => {
                syncToCloud(fullData);
            }, 2000);

            return () => clearTimeout(timeoutId);

        } catch (error) {
            console.error('Error saving user data to localStorage:', error);
        }
    }, [dailyGoals, calorieHistory, frequentFoods, lastGeneratedPlan, recipes, savedRecipes, goalsHistory, savedPlans, fastingState, chatHistory, shoppingList, activityLog, assistantName, userProfile, gamification, moodHistory, weightHistory, challenge, preferences, sleepHistory]);

    // --- Gamification Logic ---

    const addXP = (amount: number) => {
        if (!preferences.showGamification) return; // Respect preference
        setGamification(prev => {
            const newXP = prev.xp + amount;
            // Simple level formula: Level = 1 + sqrt(XP / 100)
            const newLevel = Math.floor(1 + Math.sqrt(newXP / 100));
            return { ...prev, xp: newXP, level: newLevel };
        });
    };

    const checkAchievements = () => {
        if (!preferences.showGamification) return; // Respect preference
        setGamification(prev => {
            const unlockedIds = new Set(prev.unlockedAchievements.map(u => u.id));
            const newUnlocks = [];

            for (const achievement of ACHIEVEMENTS_LIST) {
                if (!unlockedIds.has(achievement.id)) {
                    // We pass necessary data to condition. Extending condition params as needed.
                    // Simplified for this example to usually rely on goals
                    if (achievement.condition(dailyGoals, activityLog.length)) {
                        newUnlocks.push({ id: achievement.id, unlockedAt: Date.now() });
                    }
                }
            }

            if (newUnlocks.length > 0) {
                return { ...prev, unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocks] };
            }
            return prev;
        });
    };

    // Check achievements whenever goals or activity changes
    useEffect(() => {
        checkAchievements();
    }, [dailyGoals, activityLog]);


    // --- Action Handlers ---

    const logMeal = (meal: MealAnalysis) => {
        setDailyGoals(prev => ({
            ...prev,
            calories: { ...prev.calories, current: prev.calories.current + meal.calories },
            protein: { ...prev.protein, current: prev.protein.current + meal.macros.protein },
            carbs: { ...prev.carbs, current: prev.carbs.current + meal.macros.carbs },
            fat: { ...prev.fat, current: prev.fat.current + meal.macros.fat },
            vitaminC: { ...prev.vitaminC, current: prev.vitaminC.current + (meal.micros?.vitaminC || 0) },
            vitaminD: { ...prev.vitaminD, current: prev.vitaminD.current + (meal.micros?.vitaminD || 0) },
            iron: { ...prev.iron, current: prev.iron.current + (meal.micros?.iron || 0) },
            calcium: { ...prev.calcium, current: prev.calcium.current + (meal.micros?.calcium || 0) },
            magnesium: { ...prev.magnesium, current: prev.magnesium.current + (meal.micros?.magnesium || 0) },
            vitaminA: { ...prev.vitaminA, current: prev.vitaminA.current + (meal.micros?.vitaminA || 0) },
            vitaminB12: { ...prev.vitaminB12, current: prev.vitaminB12.current + (meal.micros?.vitaminB12 || 0) },
            potassium: { ...prev.potassium, current: prev.potassium.current + (meal.micros?.potassium || 0) },
            sodium: { ...prev.sodium, current: prev.sodium.current + (meal.micros?.sodium || 0) },
            zinc: { ...prev.zinc, current: prev.zinc.current + (meal.micros?.zinc || 0) },
        }));

        setCalorieHistory(prev => {
            const todayStr = new Date().toISOString().split('T')[0];
            const todayRecordIndex = prev.findIndex(record => record.date === todayStr);
            const newHistory = [...prev];

            if (todayRecordIndex > -1) {
                newHistory[todayRecordIndex] = {
                    ...newHistory[todayRecordIndex],
                    kcal: newHistory[todayRecordIndex].kcal + meal.calories
                };
            } else {
                newHistory.push({ date: todayStr, kcal: meal.calories });
            }
            return newHistory;
        });

        setFrequentFoods(prev => {
            const newFoods = new Set([...prev, ...meal.identifiedFoods]);
            return Array.from(newFoods).slice(0, 5);
        });

        addXP(50); // XP for logging meal
    };

    const logWater = (amount: number) => {
        setDailyGoals(prev => ({
            ...prev,
            water: { ...prev.water, current: prev.water.current + amount },
        }));
        addXP(10); // XP for water
    };

    const logSupplement = () => {
        setDailyGoals(prev => ({
            ...prev,
            vitaminC: { ...prev.vitaminC, current: prev.vitaminC.current + 90 },
            vitaminD: { ...prev.vitaminD, current: prev.vitaminD.current + 600 },
            iron: { ...prev.iron, current: prev.iron.current + 14 },
            calcium: { ...prev.calcium, current: prev.calcium.current + 200 },
            magnesium: { ...prev.magnesium, current: prev.magnesium.current + 100 },
            vitaminA: { ...prev.vitaminA, current: prev.vitaminA.current + 900 },
            vitaminB12: { ...prev.vitaminB12, current: prev.vitaminB12.current + 2.4 },
            zinc: { ...prev.zinc, current: prev.zinc.current + 11 },
        }));
        addXP(20);
    };

    const toggleDailySupplement = () => {
        setDailyGoals(prev => {
            const taken = !prev.supplementTaken;
            if (taken) addXP(20);
            return { ...prev, supplementTaken: taken };
        });
    };

    const updateDailyGoals = (newGoals: DailyGoal) => {
        setDailyGoals(prev => {
            const updated = { ...prev };
            Object.keys(newGoals).forEach(key => {
                const k = key as keyof DailyGoal;
                const newVal = newGoals[k];
                if (typeof newVal === 'object' && newVal !== null && 'target' in newVal) {
                    const prevVal = updated[k] as NutrientGoal;
                    (updated as any)[k] = { ...prevVal, target: newVal.target };
                }
            });
            return updated;
        });
    };

    const setHealthPlan = (plan: WeeklyPlan | null) => {
        setLastGeneratedPlan(plan);
        if (plan) addXP(100);
    };

    const addRecipe = (newRecipe: Recipe) => {
        setRecipes(prevRecipes => {
            if (prevRecipes.some(r => r.id === newRecipe.id)) {
                return prevRecipes;
            }
            return [newRecipe, ...prevRecipes];
        });
        addXP(30);
    };

    const updateRecipeImage = (recipeId: number, newImageUrl: string) => {
        setRecipes(prevRecipes =>
            prevRecipes.map(r =>
                r.id === recipeId ? { ...r, image: newImageUrl } : r
            )
        );
    };

    const toggleSaveRecipe = (recipeId: number) => {
        setSavedRecipes(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    const replaceMealInPlan = (day: keyof WeeklyPlan, mealType: keyof DayPlan, newMeal: Meal) => {
        setLastGeneratedPlan(prevPlan => {
            if (!prevPlan) return null;
            const updatedPlan = { ...prevPlan };
            const updatedDay = { ...updatedPlan[day] };
            updatedDay[mealType] = newMeal;
            updatedPlan[day] = updatedDay;
            return updatedPlan;
        });
    };

    const saveCurrentPlan = () => {
        if (!lastGeneratedPlan) return;
        const newSavedPlan: SavedPlan = {
            timestamp: Date.now(),
            plan: lastGeneratedPlan,
        };
        setSavedPlans(prev => [newSavedPlan, ...prev]);
        addXP(50);
    };

    const deleteSavedPlan = (timestamp: number) => {
        setSavedPlans(prev => prev.filter(p => p.timestamp !== timestamp));
    };

    const loadSavedPlan = (plan: WeeklyPlan) => {
        setLastGeneratedPlan(plan);
    };

    const startFasting = (duration: number, protocol: string) => {
        setFastingState({
            isFasting: true,
            startTime: Date.now(),
            targetDuration: duration,
            protocol: protocol
        });
        addXP(10);
    };

    const stopFasting = () => {
        setFastingState(prev => {
            if (prev.isFasting && prev.startTime) {
                const hours = (Date.now() - prev.startTime) / (1000 * 60 * 60);
                if (hours >= prev.targetDuration) addXP(100); // Bonus for completing fast
            }
            return { ...prev, isFasting: false, startTime: null };
        });
    };

    const addChatMessage = (role: 'user' | 'model', text: string) => {
        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            role,
            text,
            timestamp: Date.now(),
        };
        setChatHistory(prev => [...prev, newMessage]);
    };

    const clearChat = () => setChatHistory([]);

    const setShoppingList = (items: ShoppingItem[]) => {
        setShoppingListState({ id: Date.now().toString(), items });
    };

    const toggleShoppingItem = (index: number) => {
        setShoppingListState(prev => {
            if (!prev) return null;
            const newItems = [...prev.items];
            newItems[index].checked = !newItems[index].checked;
            return { ...prev, items: newItems };
        });
    };

    const logActivity = (name: string, calories: number, duration: number) => {
        const newRecord: ActivityRecord = {
            id: Date.now().toString(),
            name,
            caloriesBurned: calories,
            durationMinutes: duration,
            timestamp: Date.now()
        };
        setActivityLog(prev => [...prev, newRecord]);
        addXP(50);
    };

    const setAssistantNameState = (name: string) => {
        setAssistantName(name);
    };

    const updateUserProfile = (profile: UserProfile) => {
        setUserProfile(profile);
        const newGoals = calculateAutoGoals(profile, dailyGoals);
        updateDailyGoals(newGoals);
    };

    // New methods for onboarding
    const updateGoals = (goals: { primaryGoal: string; activityLevel: string }) => {
        setUserProfile(prev => {
            const updated = {
                ...prev,
                objective: goals.primaryGoal as any,
                activityLevel: goals.activityLevel as any
            };
            // Recalculate daily goals based on new profile
            const newDailyGoals = calculateAutoGoals(updated, dailyGoals);
            updateDailyGoals(newDailyGoals);
            return updated;
        });
    };

    const updateProfile = (profile: Partial<UserProfile>) => {
        setUserProfile(prev => {
            const updated = { ...prev, ...profile };
            return updated;
        });
    };

    // --- New Logging Functions ---

    const logMood = (mood: MoodType) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const newRecord: MoodRecord = { date: todayStr, mood };
        setMoodHistory(prev => {
            const existing = prev.findIndex(r => r.date === todayStr);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = newRecord;
                return updated;
            }
            return [...prev, newRecord];
        });
        addXP(15);
    };

    const logWeight = (weight: number) => {
        setUserProfile(prev => ({ ...prev, weight })); // Update current
        // Update history
        const todayStr = new Date().toISOString().split('T')[0];
        setWeightHistory(prev => {
            const existing = prev.findIndex(r => r.date === todayStr);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = { date: todayStr, weight };
                return updated;
            }
            // Keep sorted by date if appending new one
            return [...prev, { date: todayStr, weight }].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        });

        // Recalculate goals since weight changed
        updateUserProfile({ ...userProfile, weight });
        addXP(20);
    };

    // --- Challenge Logic ---

    const startChallenge = (tasks: ChallengeTask[]) => {
        setChallenge({
            isActive: true,
            startDate: Date.now(),
            tasks
        });
    };

    const completeChallengeTask = (day: number) => {
        setChallenge(prev => {
            const newTasks = prev.tasks.map(t => t.day === day ? { ...t, completed: true } : t);
            return { ...prev, tasks: newTasks };
        });
        addXP(50);
    };

    // --- Preference Logic ---

    const togglePreference = (key: keyof AppPreferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // --- Sleep Logic ---
    const logSleep = (durationHours: number, quality: SleepQuality) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const newRecord: SleepRecord = { date: todayStr, durationHours, quality };
        setSleepHistory(prev => {
            const existing = prev.findIndex(r => r.date === todayStr);
            if (existing >= 0) {
                const updated = [...prev];
                updated[existing] = newRecord;
                return updated;
            }
            return [...prev, newRecord];
        });
        addXP(20);
    };

    return (
        <UserDataContext.Provider value={{
            dailyGoals, calorieHistory, frequentFoods, goalsHistory, lastGeneratedPlan, recipes, savedRecipes, savedPlans, fastingState, chatHistory, shoppingList, activityLog, assistantName, userProfile,
            gamification, moodHistory, weightHistory, challenge, preferences, sleepHistory,
            logMeal, logWater, logSupplement, toggleDailySupplement, updateDailyGoals, setHealthPlan, addRecipe, updateRecipeImage, toggleSaveRecipe, replaceMealInPlan, saveCurrentPlan, deleteSavedPlan, loadSavedPlan, startFasting, stopFasting, addChatMessage, setShoppingList, toggleShoppingItem, logActivity, clearChat, setAssistantName: setAssistantNameState, updateUserProfile,
            logMood, logWeight, addXP, startChallenge, completeChallengeTask, togglePreference, logSleep,
            updateGoals, updateProfile
        }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};
