
import React, { useState, useMemo } from 'react';
import Card from '../components/Card';
import type { Recipe, RecipeType } from '../types';
import { SearchIcon } from '../components/icons/SearchIcon';
import { XIcon } from '../components/icons/XIcon';
import { useI18n } from '../contexts/I18nContext';
import { generateRecipeFromIngredients, generateImageForRecipe } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { BookmarkIcon } from '../components/icons/BookmarkIcon';
import { FilterIcon } from '../components/icons/FilterIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { useUserData } from '../contexts/UserDataContext';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { FireIcon } from '../components/icons/FireIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';

// --- Helper Functions ---

const getWeekNumber = (d: Date): number => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
    return weekNo;
}

// --- Components ---

interface BadgeProps {
    children: React.ReactNode;
    color?: 'gray' | 'emerald' | 'orange' | 'red' | 'blue' | 'green';
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'gray' }) => {
    const colors = {
        gray: 'bg-gray-100 text-gray-700',
        emerald: 'bg-emerald-50 text-emerald-700',
        orange: 'bg-orange-50 text-orange-700',
        red: 'bg-red-50 text-red-700',
        blue: 'bg-blue-50 text-blue-700',
        green: 'bg-green-100 text-green-800'
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${colors[color]}`}>
            {children}
        </span>
    );
};

const RecipeModal = ({ recipe, onClose, isSaved, onSaveToggle, updateRecipeImage }: { recipe: Recipe; onClose: () => void; isSaved: boolean; onSaveToggle: () => void; updateRecipeImage: (id: number, url: string) => void }) => {
    const { t } = useI18n();
    const [isRegenerating, setIsRegenerating] = useState(false);

    const handleRegenerateImage = async () => {
        setIsRegenerating(true);
        try {
             const query = `${recipe.name} food photography, high quality, 4k, detailed, appetizing`;
             const newUrl = await generateImageForRecipe(query);
             if (newUrl) {
                updateRecipeImage(recipe.id, newUrl);
             }
        } catch (e) {
            console.error("Failed to regen image", e);
        } finally {
            setIsRegenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-0 sm:p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white sm:rounded-3xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                
                {/* Modal Header Image */}
                <div className="relative h-56 sm:h-72 flex-shrink-0 group">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-md p-2 rounded-full text-white transition-all z-10"
                    >
                        <XIcon className="w-6 h-6"/>
                    </button>

                    {/* AI Regenerate Button */}
                    <button
                        onClick={handleRegenerateImage}
                        disabled={isRegenerating}
                        className="absolute top-4 left-4 bg-black/30 hover:bg-emerald-600/80 backdrop-blur-md px-3 py-1.5 rounded-full text-white transition-all z-10 flex items-center text-xs font-medium border border-white/20 disabled:opacity-50"
                    >
                         {isRegenerating ? <Spinner className="w-3 h-3 mr-2 text-white" /> : <SparklesIcon className="w-3 h-3 mr-2 text-yellow-300" />}
                         {isRegenerating ? t('recipes.regeneratingImage') : t('recipes.regenerateImage')}
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs sm:text-sm font-medium text-emerald-300 uppercase tracking-wider">{recipe.type}</p>
                            {recipe.tags && recipe.tags.map(tag => (
                                <span key={tag} className="bg-emerald-500/80 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{recipe.name}</h2>
                    </div>
                </div>

                {/* Modal Content - Added scrollbar-hide class */}
                <div className="p-5 sm:p-6 pb-24 sm:pb-6 overflow-y-auto scrollbar-hide flex-grow">
                    
                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8 pb-6 border-b border-gray-100">
                        <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-xl text-sm sm:text-base">
                            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-500" />
                            <span className="font-medium">{recipe.time}</span>
                        </div>
                        <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-xl text-sm sm:text-base">
                            <FireIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
                            <span className="font-medium">{recipe.calories} kcal</span>
                        </div>
                         <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-xl text-sm sm:text-base">
                            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${recipe.difficulty === 'Fácil' ? 'bg-green-500' : recipe.difficulty === 'Médio' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                            <span className="font-medium">{t(`recipes.difficulty.${recipe.difficulty}`)}</span>
                        </div>
                         <button
                            onClick={onSaveToggle}
                            className={`w-full sm:w-auto sm:ml-auto flex justify-center items-center space-x-2 px-5 py-3 sm:py-2 rounded-xl sm:rounded-full font-bold transition-all ${
                                isSaved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/30'
                            }`}
                        >
                            <BookmarkIcon filled={isSaved} className="w-5 h-5" />
                            <span>{isSaved ? t('recipes.savedButton') : t('recipes.saveButton')}</span>
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900">
                                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">1</span>
                                {t('recipes.ingredients')}
                            </h3>
                            <ul className="space-y-3">
                                {recipe.ingredients.map((ing, i) => (
                                    <li key={i} className="flex items-start p-3 rounded-lg bg-gray-50 text-gray-700 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 mr-3 flex-shrink-0"></div>
                                        {ing}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4 flex items-center text-gray-900">
                                <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm">2</span>
                                {t('recipes.steps')}
                            </h3>
                            <ol className="space-y-4">
                                {recipe.steps.map((step, i) => (
                                    <li key={i} className="relative pl-4 border-l-2 border-emerald-100 pb-4 last:pb-0 last:border-0">
                                         <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-200"></div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface RecipeCardProps {
    recipe: Recipe;
    isSaved: boolean;
    isWeekly: boolean;
    onToggleSave: (recipe: Recipe) => void;
    onSelect: (recipe: Recipe) => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isSaved, isWeekly, onToggleSave, onSelect, t }) => (
      <div 
        onClick={() => onSelect(recipe)}
        className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
            <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
            
            {/* Floating Save Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(recipe);
                }}
                className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
                    isSaved 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                }`}
            >
                <BookmarkIcon filled={isSaved} className="w-4 h-4" />
            </button>
            
            {/* Weekly Badge */}
            {isWeekly && !isSaved && (
                 <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center">
                     <CalendarIcon className="w-3 h-3 mr-1" />
                     Semana
                 </div>
            )}

            {/* Overlaid Tags */}
            <div className="absolute bottom-3 left-3 flex gap-2">
                 <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-white text-xs font-medium flex items-center">
                    <ClockIcon className="w-3 h-3 mr-1" /> {recipe.time}
                 </span>
                 {recipe.tags && recipe.tags.includes('Vegan') && (
                    <span className="px-2 py-1 rounded-md bg-green-600/80 backdrop-blur-sm text-white text-xs font-medium">
                        Vegan
                    </span>
                 )}
                 {recipe.tags && !recipe.tags.includes('Vegan') && recipe.tags.includes('Vegetarian') && (
                    <span className="px-2 py-1 rounded-md bg-green-600/80 backdrop-blur-sm text-white text-xs font-medium">
                        Veg
                    </span>
                 )}
            </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-2">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">{recipe.type}</p>
                <div className="flex items-center">
                     <FireIcon className="w-3 h-3 text-orange-500 mr-1" />
                     <span className="text-xs text-gray-500 font-medium">{recipe.calories}</span>
                </div>
            </div>
            
            <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
                {recipe.name}
            </h3>
            
            <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                <Badge color={recipe.difficulty === 'Fácil' ? 'emerald' : recipe.difficulty === 'Médio' ? 'orange' : 'red'}>
                    {t(`recipes.difficulty.${recipe.difficulty}`)}
                </Badge>
            </div>
        </div>
      </div>
  );

const Recipes = () => {
  const { t, language } = useI18n();
  const { recipes, savedRecipes, toggleSaveRecipe, addRecipe, updateRecipeImage, userProfile, lastGeneratedPlan, savedPlans } = useUserData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [difficulty, setDifficulty] = useState('All');
  const [time, setTime] = useState('Any');
  const [calories, setCalories] = useState('Any');
  const [activeType, setActiveType] = useState('All');
  const [dietFilter, setDietFilter] = useState(userProfile.dietaryPreference === 'Omnivore' ? 'All' : userProfile.dietaryPreference);
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [dietWeek, setDietWeek] = useState(1); // Week of the diet plan
  
  // Get Current Week for rotation logic (calendar week)
  const calendarWeek = useMemo(() => getWeekNumber(new Date()), []);
  
  // Organize saved plans by week number
  const plansByWeek = useMemo(() => {
    const sorted = [...savedPlans].sort((a, b) => a.timestamp - b.timestamp);
    const weeks: { [week: number]: any } = {};
    sorted.forEach((plan, index) => {
      weeks[index + 1] = plan.plan;
    });
    // Add current plan as the latest week
    if (lastGeneratedPlan) {
      const weekNumber = sorted.length + 1;
      weeks[weekNumber] = lastGeneratedPlan;
    }
    return weeks;
  }, [savedPlans, lastGeneratedPlan]);

  const totalDietWeeks = useMemo(() => {
    const savedCount = savedPlans.length;
    const hasCurrentPlan = lastGeneratedPlan && !savedPlans.some(p => JSON.stringify(p.plan) === JSON.stringify(lastGeneratedPlan));
    return Math.max(savedCount + (hasCurrentPlan ? 1 : 0), lastGeneratedPlan ? 1 : 0);
  }, [savedPlans.length, lastGeneratedPlan]);

  // Get recipes from the selected diet week
  const weekPlanRecipes = useMemo(() => {
    const weekPlan = plansByWeek[dietWeek] || (dietWeek === totalDietWeeks && lastGeneratedPlan ? lastGeneratedPlan : null);
    if (!weekPlan) return [];
    
    const weekRecipes: Recipe[] = [];
    const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
    
    weekDays.forEach(day => {
      const dayPlan = weekPlan[day];
      if (dayPlan) {
        // Convert meals to recipes
        ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
          const meal = dayPlan[mealType];
          if (meal) {
            weekRecipes.push({
              id: Date.now() + Math.random(), // Unique ID
              name: meal.name,
              description: meal.description,
              ingredients: meal.ingredients,
              steps: meal.steps,
              calories: meal.calories,
              time: '30 min',
              difficulty: 'Médio',
              type: mealType === 'breakfast' ? 'Café da Manhã' : mealType === 'lunch' ? 'Prato Principal' : 'Prato Principal',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
              tags: []
            });
          }
        });
      }
    });
    
    return weekRecipes;
  }, [plansByWeek, dietWeek, totalDietWeeks, lastGeneratedPlan]);

  const clearFilters = () => {
    setDifficulty('All');
    setTime('Any');
    setCalories('Any');
    setActiveType('All');
    setDietFilter('All');
    setShowOnlySaved(false);
    setSearchTerm('');
  };

  const handlePreviousWeek = () => {
    if (dietWeek > 1) {
      setDietWeek(dietWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (dietWeek < totalDietWeeks) {
      setDietWeek(dietWeek + 1);
    }
  };

  const filteredRecipes = useMemo(() => {
    // If showing diet week recipes, combine them with regular recipes
    const allRecipes = [...recipes];
    if (weekPlanRecipes.length > 0 && searchTerm === '' && activeType === 'All' && difficulty === 'All' && time === 'Any' && calories === 'Any' && dietFilter === 'All' && !showOnlySaved) {
      // Add week plan recipes when in default view
      weekPlanRecipes.forEach(weekRecipe => {
        if (!allRecipes.some(r => r.name === weekRecipe.name && r.calories === weekRecipe.calories)) {
          allRecipes.push(weekRecipe);
        }
      });
    }
    
    return allRecipes.filter(recipe => {
      // 1. Basic Filter Logic
      const nameMatch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
      const difficultyMatch = difficulty === 'All' || recipe.difficulty === difficulty;
      const prepTime = parseInt(recipe.time, 10);
      const timeMatch = time === 'Any' || prepTime <= parseInt(time, 10);
      
      const calorieMatch = (() => {
        if (calories === 'Any') return true;
        if (calories === 'lte300') return recipe.calories <= 300;
        if (calories === '300-500') return recipe.calories > 300 && recipe.calories <= 500;
        if (calories === 'gt500') return recipe.calories > 500;
        return true;
      })();
      const typeMatch = activeType === 'All' || recipe.type === activeType;

      // Diet Filter Logic
      let dietMatch = true;
      if (dietFilter === 'Vegan') {
          dietMatch = recipe.tags?.includes('Vegan') || false;
      } else if (dietFilter === 'Vegetarian') {
          dietMatch = recipe.tags?.includes('Vegetarian') || recipe.tags?.includes('Vegan') || false;
      }
      
      if (!nameMatch || !difficultyMatch || !timeMatch || !calorieMatch || !typeMatch || !dietMatch) {
          return false;
      }

      // 2. Saved Filter
      if (showOnlySaved) {
          return savedRecipes.includes(recipe.id);
      }

      // 3. Weekly Rotation Logic (only for non-diet recipes)
      const isDefaultView = searchTerm === '' && activeType === 'All' && difficulty === 'All' && time === 'Any' && calories === 'Any' && dietFilter === 'All';
      const isFromDietPlan = weekPlanRecipes.some(wr => wr.name === recipe.name && wr.calories === recipe.calories);

      if (isDefaultView && !isFromDietPlan) {
          if (savedRecipes.includes(recipe.id)) return true;
          if (recipe.id > 10000) return true;
          return (recipe.id + calendarWeek) % 4 !== 0;
      }

      return true;
    }).sort((a, b) => {
        const aSaved = savedRecipes.includes(a.id);
        const bSaved = savedRecipes.includes(b.id);
        if (aSaved && !bSaved) return -1;
        if (!aSaved && bSaved) return 1;
        
        const aScore = (a.id * calendarWeek) % 100;
        const bScore = (b.id * calendarWeek) % 100;
        return bScore - aScore;
    });
  }, [searchTerm, difficulty, time, calories, activeType, dietFilter, savedRecipes, showOnlySaved, recipes, calendarWeek, weekPlanRecipes]);
  
  const handleGenerateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredientsInput.trim()) return;

    setIsGenerating(true);
    setGenerationError(null);
    try {
        const recipe = await generateRecipeFromIngredients(ingredientsInput, language);
        setSelectedRecipe(recipe);
        addRecipe(recipe); 
    } catch (err) {
        setGenerationError(t('recipes.generator.error'));
        console.error(err);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSaveRecipe = (recipeToSave: Recipe) => {
    if (!recipes.some(r => r.id === recipeToSave.id)) {
        addRecipe(recipeToSave);
    }
    toggleSaveRecipe(recipeToSave.id);
  };

  const selectClasses = "w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-shadow";
  const categoryTabs = ['All', 'Salada', 'Prato Principal', 'Bebida', 'Café da Manhã', 'Sopa', 'Lanche'];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* --- Hero / Generator Section --- */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white pt-6 pb-16 px-4 md:px-6 relative overflow-hidden mb-6 sm:mb-8">
          {/* Decorative patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
               <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white blur-3xl"></div>
               <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-yellow-300 blur-3xl"></div>
          </div>

          <div className="max-w-3xl mx-auto relative z-10 text-center">
              <div className="inline-flex items-center justify-center p-2 bg-white/10 backdrop-blur-md rounded-full mb-3 sm:mb-4 border border-white/20">
                   <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 mr-2" />
                   <span className="text-xs sm:text-sm font-medium text-emerald-50">Chef IA</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-4 tracking-tight">{t('recipes.generator.title')}</h1>
              <p className="text-emerald-100 mb-6 sm:mb-8 text-base sm:text-lg">{t('recipes.generator.placeholder')}</p>
              
              <form onSubmit={handleGenerateRecipe} className="relative max-w-xl mx-auto">
                  <div className="relative">
                    <input
                        type="text"
                        value={ingredientsInput}
                        onChange={(e) => setIngredientsInput(e.target.value)}
                        placeholder="Ex: ovos, espinafre..."
                        className="w-full py-3 sm:py-4 pl-5 pr-16 sm:pr-36 rounded-full text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all border-0 text-sm sm:text-base"
                    />
                    <button 
                        type="submit" 
                        disabled={isGenerating || !ingredientsInput.trim()} 
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-full px-3 sm:px-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                         {isGenerating ? <Spinner className="w-5 h-5 text-white" /> : (
                             <>
                                <span className="hidden sm:inline">{t('recipes.generator.button')}</span>
                                <SparklesIcon className="w-5 h-5 sm:hidden" />
                             </>
                         )}
                    </button>
                  </div>
                  {generationError && <p className="text-red-200 mt-2 text-sm font-medium bg-red-900/20 p-2 rounded-lg inline-block">{generationError}</p>}
              </form>
          </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
        
        {/* --- Search & Filter Bar --- */}
        <Card className="p-2 mb-4 shadow-lg border-0 flex flex-col sm:flex-row gap-2 sm:gap-0">
             <div className="relative flex-grow">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder={t('recipes.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-11 bg-transparent focus:bg-gray-50 rounded-xl focus:outline-none transition-colors text-gray-700 placeholder-gray-400"
                />
            </div>
            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-2 sm:pt-0 sm:pl-2">
                <button
                    onClick={() => setFiltersVisible(!filtersVisible)}
                    className={`flex-grow sm:flex-grow-0 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-semibold transition-colors ${filtersVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                    <FilterIcon className="w-5 h-5" />
                    <span className="text-sm">{t('recipes.filters.title')}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${filtersVisible ? 'rotate-180' : ''}`} />
                </button>
                 <button
                    onClick={() => setShowOnlySaved(!showOnlySaved)}
                    className={`p-2.5 rounded-xl transition-colors ${
                        showOnlySaved ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                    }`}
                    title={t('recipes.showSavedFilter')}
                >
                    <BookmarkIcon filled={showOnlySaved} className="w-5 h-5" />
                </button>
            </div>
        </Card>

        {/* --- Expanded Filters --- */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${filtersVisible ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">{t('recipes.filters.diet.label')}</label>
                        <select value={dietFilter} onChange={(e) => setDietFilter(e.target.value)} className={selectClasses}>
                            <option value="All">{t('recipes.filters.diet.all')}</option>
                            <option value="Omnivore">{t('recipes.filters.diet.omnivore')}</option>
                            <option value="Vegetarian">{t('recipes.filters.diet.vegetarian')}</option>
                            <option value="Vegan">{t('recipes.filters.diet.vegan')}</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">{t('recipes.filters.difficulty.label')}</label>
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClasses}>
                            <option value="All">{t('recipes.filters.difficulty.all')}</option>
                            <option value="Fácil">{t('recipes.difficulty.Fácil')}</option>
                            <option value="Médio">{t('recipes.difficulty.Médio')}</option>
                            <option value="Difícil">{t('recipes.difficulty.Difícil')}</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">{t('recipes.filters.time.label')}</label>
                        <select value={time} onChange={(e) => setTime(e.target.value)} className={selectClasses} >
                            <option value="Any">{t('recipes.filters.time.any')}</option>
                            <option value="15">{t('recipes.filters.time.upTo15')}</option>
                            <option value="30">{t('recipes.filters.time.upTo30')}</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">{t('recipes.filters.calories.label')}</label>
                        <select value={calories} onChange={(e) => setCalories(e.target.value)} className={selectClasses} >
                            <option value="Any">{t('recipes.filters.calories.any')}</option>
                            <option value="lte300">{t('recipes.filters.calories.upTo300')}</option>
                            <option value="300-500">{t('recipes.filters.calories.between300_500')}</option>
                            <option value="gt500">{t('recipes.filters.calories.over500')}</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
                    <button
                        onClick={clearFilters}
                        className="text-sm font-semibold text-gray-500 hover:text-emerald-600 transition-colors px-4 py-2 hover:bg-emerald-50 rounded-lg"
                    >
                        {t('recipes.filters.clear')}
                    </button>
                </div>
            </div>
        </div>

        {/* Week Navigation - Only show if there are diet plans */}
        {totalDietWeeks > 0 && searchTerm === '' && activeType === 'All' && difficulty === 'All' && time === 'Any' && calories === 'Any' && dietFilter === 'All' && !showOnlySaved && (
          <div className="mb-6 flex items-center justify-between bg-emerald-50 p-4 rounded-xl">
            <button
              onClick={handlePreviousWeek}
              disabled={dietWeek <= 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 rounded-lg font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Semana Anterior
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold text-emerald-700">Semana {dietWeek}</h2>
              {totalDietWeeks > 1 && (
                <p className="text-xs text-gray-500 mt-1">de {totalDietWeeks} semanas</p>
              )}
            </div>
            <button
              onClick={handleNextWeek}
              disabled={dietWeek >= totalDietWeeks}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-emerald-200 rounded-lg font-semibold text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              Próxima Semana
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* --- Category Pills Navigation --- */}
        <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <div className="flex space-x-2">
                {categoryTabs.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveType(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                            activeType === cat 
                                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 transform scale-105' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
                        }`}
                    >
                        {cat === 'All' ? t('recipes.filters.type.all') : t(`recipes.filters.type.${cat}`)}
                    </button>
                ))}
            </div>
        </div>
      
        {/* --- Results Grid --- */}
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
                {searchTerm 
                    ? `Resultados para "${searchTerm}"` 
                    : showOnlySaved 
                        ? 'Suas Receitas Salvas' 
                        : activeType !== 'All' 
                            ? t(`recipes.filters.type.${activeType}`)
                            : dietFilter !== 'All'
                                ? `${t(`recipes.filters.diet.${dietFilter.toLowerCase()}`)}`
                                : totalDietWeeks > 0 
                                    ? `Menu da Semana ${dietWeek}`
                                    : `Menu da Semana ${calendarWeek}`
                }
            </h2>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {filteredRecipes.length} {filteredRecipes.length === 1 ? 'Receita' : 'Receitas'}
            </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map(recipe => (
            <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                isSaved={savedRecipes.includes(recipe.id)}
                isWeekly={!savedRecipes.includes(recipe.id) && recipe.id < 10000}
                onToggleSave={handleSaveRecipe}
                onSelect={setSelectedRecipe}
                t={t}
            />
            ))}
        </div>

        {filteredRecipes.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SearchIcon className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-800 font-bold text-lg">{t('recipes.filters.noResults')}</p>
                <p className="text-gray-500 text-sm mt-1">Tente ajustar seus filtros ou buscar por outro termo.</p>
                <button onClick={clearFilters} className="mt-4 text-emerald-600 font-semibold hover:underline">Limpar filtros</button>
            </div>
        )}

        {selectedRecipe && <RecipeModal 
            recipe={selectedRecipe} 
            onClose={() => setSelectedRecipe(null)}
            isSaved={savedRecipes.includes(selectedRecipe.id)}
            onSaveToggle={() => handleSaveRecipe(selectedRecipe)}
            updateRecipeImage={updateRecipeImage}
        />}
      </div>
    </div>
  );
};

export default Recipes;
