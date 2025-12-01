
import React, { useState, useEffect, useMemo } from 'react';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { generateHealthPlan, regenerateMeal, generateShoppingListFromPlan } from '../services/geminiService';
import type { WeeklyPlan, DayPlan, Meal, ShoppingItem } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { MugIcon } from '../components/icons/MugIcon';
import { SunIcon } from '../components/icons/SunIcon';
import { MoonIcon } from '../components/icons/MoonIcon';
import { CollectionIcon } from '../components/icons/CollectionIcon';
import { SwitchHorizontalIcon } from '../components/icons/SwitchHorizontalIcon';
import { ClipboardListIcon } from '../components/icons/ClipboardListIcon';
import { XIcon } from '../components/icons/XIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ShoppingCartIcon } from '../components/icons/ShoppingCartIcon';

const RecipeModal = ({ meal, mealType, onClose }: { meal: Meal; mealType: string; onClose: () => void; }) => {
    const { t } = useI18n();
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 pb-24">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="font-bold text-lg text-emerald-600">{mealType}</p>
                            <h2 className="text-2xl font-extrabold text-gray-900 flex-1 pr-4">{meal.name}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <p className="text-gray-600 mb-6">{meal.description}</p>

                    <div className="mb-6">
                        <h3 className="font-bold text-lg mb-3">{t('recipes.ingredients')}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                            {meal.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-3">{t('recipes.steps')}</h3>
                        <ol className="list-decimal list-inside space-y-3 text-gray-700">
                            {meal.steps.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { jsPDF } from 'jspdf';
import { ShareIcon } from '../components/icons/ShareIcon';
import { DownloadIcon } from '../components/icons/DownloadIcon';

const ShoppingListModal = ({ onClose }: { onClose: () => void }) => {
    const { t, language } = useI18n();
    const { lastGeneratedPlan, shoppingList, setShoppingList, toggleShoppingItem } = useUserData();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!shoppingList && lastGeneratedPlan) {
            const generate = async () => {
                setIsLoading(true);
                try {
                    const list = await generateShoppingListFromPlan(lastGeneratedPlan, language);
                    setShoppingList(list);
                } catch (err) {
                    setError(t('healthPlan.shoppingList.generateError'));
                } finally {
                    setIsLoading(false);
                }
            };
            generate();
        }
    }, [shoppingList, lastGeneratedPlan, language, setShoppingList, t]);

    const groupedItems = useMemo(() => {
        if (!shoppingList) return {} as Record<string, (ShoppingItem & { originalIndex: number })[]>;
        return shoppingList.items.reduce<Record<string, (ShoppingItem & { originalIndex: number })[]>>((acc, item, index) => {
            const cat = item.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ ...item, originalIndex: index });
            return acc;
        }, {});
    }, [shoppingList]);

    const exportToWhatsApp = () => {
        if (!shoppingList) return;
        let text = `*${t('healthPlan.shoppingList.title')} - NutriHealth*\n\n`;
        (Object.entries(groupedItems) as [string, (ShoppingItem & { originalIndex: number })[]][]).forEach(([category, items]) => {
            text += `*${category}*\n`;
            items.forEach(item => {
                text += `- ${item.item} ${item.checked ? '(✓)' : ''}\n`;
            });
            text += '\n';
        });
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    };

    const exportToPDF = () => {
        if (!shoppingList) return;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(16, 185, 129); // Emerald 500
        doc.text(t('healthPlan.shoppingList.title'), 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        let y = 40;
        (Object.entries(groupedItems) as [string, (ShoppingItem & { originalIndex: number })[]][]).forEach(([category, items]) => {
            if (y > 270) { doc.addPage(); y = 20; }

            doc.setFont(undefined, 'bold');
            doc.text(category.toUpperCase(), 20, y);
            y += 10;

            doc.setFont(undefined, 'normal');
            items.forEach(item => {
                if (y > 280) { doc.addPage(); y = 20; }
                const checkMark = item.checked ? '[x] ' : '[ ] ';
                doc.text(`${checkMark}${item.item}`, 25, y);
                y += 8;
            });
            y += 10;
        });

        doc.save('nutrihealth-shopping-list.pdf');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center">
                        <ShoppingCartIcon className="w-6 h-6 mr-2 text-emerald-600" />
                        {t('healthPlan.shoppingList.title')}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-40">
                            <Spinner />
                            <p className="mt-2 text-gray-500">{t('healthPlan.shoppingList.generating')}</p>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-center">{error}</p>}

                    {!isLoading && !error && shoppingList && (
                        <div className="space-y-6">
                            {Object.entries(groupedItems).map(([category, items]: [string, (ShoppingItem & { originalIndex: number })[]]) => (
                                <div key={category}>
                                    <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase tracking-wide">{category}</h3>
                                    <div className="space-y-2">
                                        {items.map((item) => (
                                            <div
                                                key={item.originalIndex}
                                                onClick={() => toggleShoppingItem(item.originalIndex)}
                                                className={`flex items-center p-3 rounded-lg cursor-pointer border transition-all ${item.checked ? 'bg-gray-50 border-gray-100 opacity-60' : 'bg-white border-gray-200 hover:border-emerald-300'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                                                    {item.checked && <CheckIcon className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className={`text-sm ${item.checked ? 'line-through text-gray-500' : 'text-gray-700'}`}>{item.item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && !shoppingList && !lastGeneratedPlan && (
                        <p className="text-center text-gray-500 mt-10">{t('healthPlan.shoppingList.empty')}</p>
                    )}
                </div>

                {!isLoading && shoppingList && (
                    <div className="p-4 border-t border-gray-100 flex gap-3">
                        <button
                            onClick={exportToWhatsApp}
                            className="flex-1 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center text-sm"
                        >
                            <ShareIcon className="w-4 h-4 mr-2" />
                            WhatsApp
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center text-sm"
                        >
                            <DownloadIcon className="w-4 h-4 mr-2" />
                            PDF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const HealthPlan = () => {
    const { t, language } = useI18n();
    const { dailyGoals, lastGeneratedPlan, setHealthPlan, replaceMealInPlan, savedPlans, saveCurrentPlan, userProfile } = useUserData();
    const [goal, setGoal] = useState('perder peso');
    const [restrictions, setRestrictions] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [regeneratingMeal, setRegeneratingMeal] = useState<{ day: keyof WeeklyPlan; meal: keyof DayPlan; } | null>(null);
    const [selectedMeal, setSelectedMeal] = useState<{ meal: Meal, type: string } | null>(null);
    const [showShoppingList, setShowShoppingList] = useState(false);

    const dayIndex = new Date().getDay();
    const initialDay = dayIndex === 0 ? 'sunday' : Object.keys(lastGeneratedPlan || {})[dayIndex - 1] || 'monday';
    const [selectedDay, setSelectedDay] = useState<keyof WeeklyPlan>(initialDay as keyof WeeklyPlan);

    useEffect(() => {
        if (lastGeneratedPlan) {
            setSelectedDay(initialDay as keyof WeeklyPlan);
        }
    }, []);

    const isCurrentPlanSaved = useMemo(() => {
        if (!lastGeneratedPlan) return false;
        return savedPlans.some(p => JSON.stringify(p.plan) === JSON.stringify(lastGeneratedPlan));
    }, [lastGeneratedPlan, savedPlans]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setHealthPlan(null);
        try {
            const result = await generateHealthPlan(goal, restrictions, dailyGoals.calories.target, language, userProfile.dietaryPreference);
            setHealthPlan(result);
        } catch (err) {
            setError(t('healthPlan.generationError'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReplaceMeal = async (day: keyof WeeklyPlan, mealType: keyof DayPlan) => {
        if (!lastGeneratedPlan) return;
        setRegeneratingMeal({ day, meal: mealType });
        setError(null);

        const currentDayPlan = lastGeneratedPlan[day];
        const mealToReplace = currentDayPlan[mealType];
        const otherMeals = (Object.keys(currentDayPlan) as Array<keyof DayPlan>)
            .filter(mt => mt !== mealType)
            .map(mt => currentDayPlan[mt]);

        try {
            const newMeal = await regenerateMeal(
                goal,
                restrictions,
                dailyGoals.calories.target,
                language,
                mealType,
                mealToReplace.name,
                otherMeals,
                userProfile.dietaryPreference
            );
            replaceMealInPlan(day, mealType, newMeal);
        } catch (err) {
            console.error("Failed to regenerate meal:", err);
            setError(t('healthPlan.regenerationError'));
        } finally {
            setRegeneratingMeal(null);
        }
    };

    const weekDays: (keyof WeeklyPlan)[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const currentDayPlan = lastGeneratedPlan ? lastGeneratedPlan[selectedDay] : null;
    const totalDayCalories = currentDayPlan
        ? currentDayPlan.breakfast.calories + currentDayPlan.lunch.calories + currentDayPlan.dinner.calories
        : 0;

    const MealCard = ({ meal, mealType, icon: Icon, onReplace, isRegenerating, onCardClick }: { meal: Meal, mealType: string, icon: React.FC<any>, onReplace: () => void, isRegenerating: boolean, onCardClick: () => void }) => (
        <Card className="flex items-start p-4 space-x-4 group cursor-pointer hover:shadow-lg transition-shadow" onClick={onCardClick}>
            <div className="p-3 bg-emerald-100 rounded-full">
                <Icon className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-800">{mealType}</h4>
                        <p className="text-gray-600 font-semibold mt-1 group-hover:text-emerald-700 transition-colors">{meal.name}</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 pl-2">
                        <span className="font-bold text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{meal.calories} kcal</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onReplace(); }}
                            disabled={isRegenerating}
                            className="p-1 text-gray-400 hover:text-emerald-600 disabled:text-gray-300 hover:bg-gray-100 rounded-full transition-colors disabled:cursor-wait"
                            title={t('healthPlan.replaceMeal')}
                            aria-label={t('healthPlan.replaceMeal')}
                        >
                            {isRegenerating ? <Spinner className="w-5 h-5" /> : <SwitchHorizontalIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <p className="text-gray-500 text-sm mt-1">{meal.description}</p>
                <span className="text-sm font-semibold text-emerald-600 mt-2 inline-block group-hover:underline">{t('healthPlan.viewRecipe')}</span>
            </div>
        </Card>
    );

    const PlanSkeleton = () => (
        <div className="animate-pulse">
            <div className="flex justify-between gap-1 mb-4">
                {[...Array(7)].map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded-lg flex-1"></div>)}
            </div>
            <div className="h-8 w-3/4 bg-gray-200 rounded-md mb-6 mx-auto"></div>
            <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <Card className="p-4 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-semibold text-gray-700 mb-1 ml-2">{t('healthPlan.goalLabel')}</label>
                        <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="perder peso">{t('healthPlan.goalOptions.lose')}</option>
                            <option value="manter peso">{t('healthPlan.goalOptions.maintain')}</option>
                            <option value="ganhar massa muscular">{t('healthPlan.goalOptions.gain')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="restrictions" className="block text-sm font-semibold text-gray-700 mb-1 ml-2">{t('healthPlan.restrictionsLabel')}</label>
                        <input type="text" id="restrictions" placeholder={t('healthPlan.restrictionsPlaceholder')} value={restrictions} onChange={(e) => setRestrictions(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>
                    <p className="text-center text-sm text-gray-500 px-2">
                        {t('dashboard.caloriesOf', { target: dailyGoals.calories.target })} • {userProfile.dietaryPreference}
                    </p>
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:bg-emerald-300 disabled:shadow-none flex items-center justify-center">
                        {isLoading && <Spinner className="w-5 h-5 mr-3" />}
                        {isLoading ? t('healthPlan.generatingButton') : t('healthPlan.generateButton')}
                    </button>
                </form>
            </Card>

            {error && <p className="text-center text-red-500">{error}</p>}

            {isLoading && <PlanSkeleton />}

            {!isLoading && lastGeneratedPlan && (
                <div className="animate-fade-in">
                    <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{t(`healthPlan.days.${selectedDay}`)}</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowShoppingList(true)}
                                className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-full font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                                <ShoppingCartIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={saveCurrentPlan}
                                disabled={isCurrentPlanSaved}
                                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:bg-emerald-100 disabled:text-emerald-800 disabled:border-emerald-200 disabled:cursor-not-allowed"
                            >
                                {isCurrentPlanSaved ? <CheckIcon className="w-5 h-5" /> : <ClipboardListIcon className="w-5 h-5" />}
                                <span className="hidden sm:inline">{isCurrentPlanSaved ? t('healthPlan.planSaved') : t('healthPlan.savePlan')}</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-100 p-1 rounded-lg mb-4">
                        {weekDays.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`flex-1 py-2 px-1 text-center text-sm font-bold rounded-md transition-colors ${selectedDay === day ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:bg-white/50'
                                    }`}
                            >
                                {t(`healthPlan.dayShort.${day}`)}
                            </button>
                        ))}
                    </div>

                    <div className="text-center mb-4">
                        <p className="font-semibold text-gray-500">{t('healthPlan.totalCalories')} <span className="font-extrabold text-emerald-600">{totalDayCalories} kcal</span></p>
                    </div>

                    {currentDayPlan && (
                        <div className="space-y-4">
                            <MealCard
                                meal={currentDayPlan.breakfast}
                                mealType={t('healthPlan.meals.breakfast')}
                                icon={MugIcon}
                                isRegenerating={regeneratingMeal?.day === selectedDay && regeneratingMeal?.meal === 'breakfast'}
                                onReplace={() => handleReplaceMeal(selectedDay, 'breakfast')}
                                onCardClick={() => setSelectedMeal({ meal: currentDayPlan.breakfast, type: t('healthPlan.meals.breakfast') })}
                            />
                            <MealCard
                                meal={currentDayPlan.lunch}
                                mealType={t('healthPlan.meals.lunch')}
                                icon={SunIcon}
                                isRegenerating={regeneratingMeal?.day === selectedDay && regeneratingMeal?.meal === 'lunch'}
                                onReplace={() => handleReplaceMeal(selectedDay, 'lunch')}
                                onCardClick={() => setSelectedMeal({ meal: currentDayPlan.lunch, type: t('healthPlan.meals.lunch') })}
                            />
                            <MealCard
                                meal={currentDayPlan.dinner}
                                mealType={t('healthPlan.meals.dinner')}
                                icon={MoonIcon}
                                isRegenerating={regeneratingMeal?.day === selectedDay && regeneratingMeal?.meal === 'dinner'}
                                onReplace={() => handleReplaceMeal(selectedDay, 'dinner')}
                                onCardClick={() => setSelectedMeal({ meal: currentDayPlan.dinner, type: t('healthPlan.meals.dinner') })}
                            />
                        </div>
                    )}
                </div>
            )}

            {!isLoading && !lastGeneratedPlan && !error && (
                <div className="text-center py-10 px-4">
                    <CollectionIcon className="w-16 h-16 mx-auto text-gray-300" />
                    <h3 className="mt-4 text-xl font-bold text-gray-700">{t('healthPlan.emptyStateTitle')}</h3>
                    <p className="mt-2 text-gray-500">{t('healthPlan.emptyStateDescription')}</p>
                </div>
            )}

            {selectedMeal && <RecipeModal meal={selectedMeal.meal} mealType={selectedMeal.type} onClose={() => setSelectedMeal(null)} />}
            {showShoppingList && <ShoppingListModal onClose={() => setShowShoppingList(false)} />}
        </div>
    );
};

export default HealthPlan;
