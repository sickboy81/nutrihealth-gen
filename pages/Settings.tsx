
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import type { UserProfile, DailyGoal } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { exportToPDF } from '../services/pdfExportService';
import { UserIcon } from '../components/icons/UserIcon';
import { IdentificationIcon } from '../components/icons/IdentificationIcon';
import { ScaleIcon } from '../components/icons/ScaleIcon';
import { RulerIcon } from '../components/icons/RulerIcon';
import { DocumentDownloadIcon } from '../components/icons/DocumentDownloadIcon';
import { DropletIcon } from '../components/icons/DropletIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { ArchiveIcon } from '../components/icons/ArchiveIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { ClipboardListIcon } from '../components/icons/ClipboardListIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';
import { LightningBoltIcon } from '../components/icons/LightningBoltIcon';
import { ChartLineIcon } from '../components/icons/ChartLineIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { ACHIEVEMENTS_LIST } from '../constants';
import { CogIcon } from '../components/icons/CogIcon';


const Settings = () => {
    const { t, language, setLanguage } = useI18n();
    const { recipes, dailyGoals, calorieHistory, lastGeneratedPlan, savedRecipes, updateDailyGoals, goalsHistory, savedPlans, deleteSavedPlan, loadSavedPlan, assistantName, setAssistantName, userProfile, updateUserProfile, logWeight, weightHistory, gamification, preferences, togglePreference } = useUserData();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile>(userProfile);
    const [goals, setGoals] = useState<DailyGoal>(dailyGoals);
    const [localAssistantName, setLocalAssistantName] = useState(assistantName);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [savedPlansVisible, setSavedPlansVisible] = useState(false);
    const [includeRecipesInPdf, setIncludeRecipesInPdf] = useState(true);
    const [includeHealthPlanInPdf, setIncludeHealthPlanInPdf] = useState(true);
    const [goalsRecalculated, setGoalsRecalculated] = useState(false);

    useEffect(() => {
        setProfile(userProfile);
        setGoals(dailyGoals);
    }, [userProfile, dailyGoals]);

    useEffect(() => {
        if (profile.weight > 0 && profile.height > 0) {
            const heightInMeters = profile.height / 100;
            const bmi = profile.weight / (heightInMeters * heightInMeters);
            setProfile(p => ({ ...p, bmi: parseFloat(bmi.toFixed(1)) }));
        }
    }, [profile.weight, profile.height]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        // Special handling for weight to log history
        if (name === 'weight') {
            // Just update local state, actual log happens on save
             setProfile(prev => ({ ...prev, weight: Number(value) }));
             return;
        }

        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: type === 'checkbox' ? checked : (name === 'name' || name === 'dietaryPreference' || name === 'gender' || name === 'activityLevel' || name === 'objective' ? value : Number(value) || 0),
        }));
    };
    
    const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const [goalType, metric] = name.split('.');
        
        setGoals(prevGoals => {
            const goalToUpdate = prevGoals[goalType as keyof DailyGoal];
            if (goalToUpdate) {
                return {
                    ...prevGoals,
                    [goalType]: {
                        ...goalToUpdate,
                        [metric]: Number(value) || 0,
                    }
                }
            }
            return prevGoals;
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);
        setGoalsRecalculated(false);

        setTimeout(() => {
            if (profile.weight !== userProfile.weight) {
                logWeight(profile.weight);
            }
            // This triggers the automatic recalculation inside UserDataContext if profile changed
            updateUserProfile(profile);
            
            setAssistantName(localAssistantName);
            setIsSaving(false);
            setSaveSuccess(true);
            setGoalsRecalculated(true);
            setTimeout(() => {
                setSaveSuccess(false);
                setGoalsRecalculated(false);
            }, 4000);
        }, 1000);
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'pt' | 'en' | 'es' | 'de' | 'fr' | 'ru');
    };
    
    const handleExport = () => {
        const fullSavedRecipes = recipes.filter(r => savedRecipes.includes(r.id));
        exportToPDF(
            profile,
            dailyGoals,
            calorieHistory,
            weightHistory,
            lastGeneratedPlan,
            fullSavedRecipes,
            t,
            includeRecipesInPdf,
            includeHealthPlanInPdf
        );
    };

    const handleLoadPlan = (plan: any) => {
        loadSavedPlan(plan);
        navigate('/health-plan');
    };

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <Card className="p-4 sm:p-6">
                <form onSubmit={handleSave}>
                    <h2 className="text-xl font-bold mb-6 text-gray-800">{t('settings.title')}</h2>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.nameLabel')}</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <UserIcon className="w-5 h-5 text-gray-400" />
                                </span>
                                <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.genderLabel')}</label>
                                <select id="gender" name="gender" value={profile.gender} onChange={handleProfileChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition">
                                    <option value="male">{t('settings.genders.male')}</option>
                                    <option value="female">{t('settings.genders.female')}</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="dietaryPreference" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.dietLabel')}</label>
                                <select id="dietaryPreference" name="dietaryPreference" value={profile.dietaryPreference} onChange={handleProfileChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition">
                                    <option value="Omnivore">{t('settings.diets.Omnivore')}</option>
                                    <option value="Vegetarian">{t('settings.diets.Vegetarian')}</option>
                                    <option value="Vegan">{t('settings.diets.Vegan')}</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.ageLabel')}</label>
                             <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <IdentificationIcon className="w-5 h-5 text-gray-400" />
                                </span>
                                <input type="number" id="age" name="age" value={profile.age} onChange={handleProfileChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.weightLabel')}</label>
                                 <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <ScaleIcon className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <input type="number" id="weight" name="weight" value={profile.weight} step="0.1" onChange={handleProfileChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.heightLabel')}</label>
                                 <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <RulerIcon className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <input type="number" id="height" name="height" value={profile.height} onChange={handleProfileChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="bmi" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.bmiLabel')}</label>
                            <input type="text" id="bmi" name="bmi" value={profile.bmi} readOnly className="w-full p-3 bg-gray-200 border border-gray-200 rounded-lg text-gray-600 font-medium cursor-not-allowed" />
                        </div>

                         <div className="border-t border-gray-200 pt-4 mt-4">
                             <div className="space-y-4">
                                <div>
                                    <label htmlFor="activityLevel" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.activityLabel')}</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <LightningBoltIcon className="w-5 h-5 text-gray-400" />
                                        </span>
                                        <select id="activityLevel" name="activityLevel" value={profile.activityLevel} onChange={handleProfileChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition">
                                            <option value="sedentary">{t('settings.activityLevels.sedentary')}</option>
                                            <option value="light">{t('settings.activityLevels.light')}</option>
                                            <option value="moderate">{t('settings.activityLevels.moderate')}</option>
                                            <option value="active">{t('settings.activityLevels.active')}</option>
                                            <option value="very_active">{t('settings.activityLevels.very_active')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="objective" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.objectiveLabel')}</label>
                                     <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <TargetIcon className="w-5 h-5 text-gray-400" />
                                        </span>
                                        <select id="objective" name="objective" value={profile.objective} onChange={handleProfileChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition">
                                            <option value="lose_weight">{t('settings.objectives.lose_weight')}</option>
                                            <option value="maintain">{t('settings.objectives.maintain')}</option>
                                            <option value="gain_muscle">{t('settings.objectives.gain_muscle')}</option>
                                        </select>
                                    </div>
                                </div>
                                 <div className="pt-2">
                                     <label className="flex items-center cursor-pointer p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                         <input 
                                            type="checkbox" 
                                            name="takesMultivitamin"
                                            checked={profile.takesMultivitamin} 
                                            onChange={handleProfileChange}
                                            className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                        />
                                         <span className="ml-3 text-emerald-800 font-medium">{t('settings.multivitaminLabel')}</span>
                                     </label>
                                 </div>
                             </div>
                        </div>

                    </div>

                    {/* App Preferences Section */}
                    <div className="border-t border-gray-200 mt-6 pt-6">
                        <div className="flex items-center mb-4">
                            <CogIcon className="w-5 h-5 mr-2 text-gray-600" />
                            <h3 className="text-lg font-bold text-gray-800">{t('settings.preferencesTitle')}</h3>
                        </div>
                        <div className="space-y-3">
                             <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200">
                                 <span className="text-gray-700 font-medium">{t('settings.enableGamification')}</span>
                                 <input 
                                    type="checkbox" 
                                    checked={preferences.showGamification} 
                                    onChange={() => togglePreference('showGamification')}
                                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                             </label>
                             <label className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200">
                                 <span className="text-gray-700 font-medium">{t('settings.enableChallenges')}</span>
                                 <input 
                                    type="checkbox" 
                                    checked={preferences.showChallenges} 
                                    onChange={() => togglePreference('showChallenges')}
                                    className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                             </label>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">{t('settings.goalsTitle')}</h3>
                        <div className="space-y-4">
                           <div>
                                <label htmlFor="water.target" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.waterGoalLabel')}</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <DropletIcon className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <input type="number" id="water.target" name="water.target" value={goals.water.target} onChange={handleGoalChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="calories.target" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.calorieGoalLabel')}</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <TargetIcon className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <input type="number" id="calories.target" name="calories.target" value={goals.calories.target} onChange={handleGoalChange} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="protein.target" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.proteinGoalLabel')}</label>
                                    <input type="number" id="protein.target" name="protein.target" value={goals.protein.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                                </div>
                                <div>
                                    <label htmlFor="carbs.target" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.carbsGoalLabel')}</label>
                                    <input type="number" id="carbs.target" name="carbs.target" value={goals.carbs.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                                </div>
                                <div>
                                    <label htmlFor="fat.target" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.fatGoalLabel')}</label>
                                    <input type="number" id="fat.target" name="fat.target" value={goals.fat.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-6 pt-6">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">{t('settings.microsTitle')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="vitaminC.target" className="block text-sm font-semibold text-gray-700 mb-1">Vit C (mg)</label>
                                <input type="number" id="vitaminC.target" name="vitaminC.target" value={goals.vitaminC?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                             <div>
                                <label htmlFor="vitaminD.target" className="block text-sm font-semibold text-gray-700 mb-1">Vit D (IU)</label>
                                <input type="number" id="vitaminD.target" name="vitaminD.target" value={goals.vitaminD?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                             <div>
                                <label htmlFor="iron.target" className="block text-sm font-semibold text-gray-700 mb-1">Iron (mg)</label>
                                <input type="number" id="iron.target" name="iron.target" value={goals.iron?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                             <div>
                                <label htmlFor="calcium.target" className="block text-sm font-semibold text-gray-700 mb-1">Calcium (mg)</label>
                                <input type="number" id="calcium.target" name="calcium.target" value={goals.calcium?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                             <div>
                                <label htmlFor="magnesium.target" className="block text-sm font-semibold text-gray-700 mb-1">Magnesium (mg)</label>
                                <input type="number" id="magnesium.target" name="magnesium.target" value={goals.magnesium?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                            <div>
                                <label htmlFor="vitaminA.target" className="block text-sm font-semibold text-gray-700 mb-1">Vit A (mcg)</label>
                                <input type="number" id="vitaminA.target" name="vitaminA.target" value={goals.vitaminA?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                            <div>
                                <label htmlFor="vitaminB12.target" className="block text-sm font-semibold text-gray-700 mb-1">Vit B12 (mcg)</label>
                                <input type="number" id="vitaminB12.target" name="vitaminB12.target" value={goals.vitaminB12?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                            <div>
                                <label htmlFor="potassium.target" className="block text-sm font-semibold text-gray-700 mb-1">Potassium (mg)</label>
                                <input type="number" id="potassium.target" name="potassium.target" value={goals.potassium?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                            <div>
                                <label htmlFor="sodium.target" className="block text-sm font-semibold text-gray-700 mb-1">Sodium (mg)</label>
                                <input type="number" id="sodium.target" name="sodium.target" value={goals.sodium?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                            <div>
                                <label htmlFor="zinc.target" className="block text-sm font-semibold text-gray-700 mb-1">Zinc (mg)</label>
                                <input type="number" id="zinc.target" name="zinc.target" value={goals.zinc?.target} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition" />
                            </div>
                        </div>
                    </div>


                    <div className="border-t border-gray-200 mt-6 pt-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.language')}</label>
                                <select id="language" value={language} onChange={handleLanguageChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition">
                                    <option value="pt">Português</option>
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                    <option value="de">Deutsch</option>
                                    <option value="fr">Français</option>
                                    <option value="ru">Русский</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="assistant" className="block text-sm font-semibold text-gray-700 mb-1">{t('settings.assistant')}</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <ChatBubbleIcon className="w-5 h-5 text-gray-400" />
                                    </span>
                                    <select id="assistant" value={localAssistantName} onChange={(e) => setLocalAssistantName(e.target.value)} className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-transparent transition">
                                        <option value="Lia">Lia (Amigável)</option>
                                        <option value="Nutri">Nutri (Direto)</option>
                                        <option value="Flora">Flora (Natural)</option>
                                        <option value="Atlas">Atlas (Força)</option>
                                        <option value="Kai">Kai (Moderno)</option>
                                        <option value="Luna">Luna (Calmo)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button type="submit" disabled={isSaving} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:bg-emerald-300 disabled:shadow-none flex items-center justify-center">
                            {isSaving && <Spinner className="w-5 h-5 mr-3" />}
                            {isSaving ? t('settings.savingButton') : t('settings.saveButton')}
                        </button>
                    </div>

                    {saveSuccess && (
                        <div className="text-center mt-4 animate-fade-in space-y-1">
                            <p className="text-emerald-600 font-bold">
                                {t('settings.saveSuccess')}
                            </p>
                            {goalsRecalculated && (
                                <p className="text-xs text-gray-500">
                                    {t('settings.autoRecalculated')}
                                </p>
                            )}
                        </div>
                    )}
                </form>
            </Card>

            {/* Weight Chart Card */}
            <Card className="p-4 sm:p-6">
                <div className="flex items-center mb-4">
                    <ChartLineIcon className="w-5 h-5 mr-3 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-800">{t('settings.weightChart')}</h2>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fill: '#6b7280', fontSize: 10 }} 
                                stroke="#d1d5db" 
                                tickFormatter={(value) => new Date(value).toLocaleDateString(language, {month: 'short', day: 'numeric'})}
                            />
                            <YAxis domain={['auto', 'auto']} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#d1d5db" />
                            <Tooltip 
                                cursor={{stroke: '#10b981', strokeWidth: 1}} 
                                contentStyle={{backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem'}}
                                labelFormatter={(value) => new Date(value).toLocaleDateString(language)}
                            />
                            <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{fill: '#10b981'}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Achievements Gallery - Conditioned by Preference */}
            {preferences.showGamification && (
                <Card className="p-4 sm:p-6">
                    <div className="flex items-center mb-4">
                        <TrophyIcon className="w-5 h-5 mr-3 text-gray-600" />
                        <h2 className="text-xl font-bold text-gray-800">{t('settings.achievements')}</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ACHIEVEMENTS_LIST.map(achievement => {
                            const isUnlocked = gamification.unlockedAchievements.some(u => u.id === achievement.id);
                            return (
                                <div key={achievement.id} className={`p-3 rounded-xl border flex items-center space-x-3 ${isUnlocked ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                    <div className={`p-2 rounded-full ${isUnlocked ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                                        {isUnlocked ? <TrophyIcon className="w-6 h-6 text-yellow-600" /> : <div className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>{t(achievement.titleKey)}</p>
                                        <p className="text-xs text-gray-500">{t(achievement.descKey)}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            )}

             <Card className="p-4 sm:p-6">
                <button
                    onClick={() => setSavedPlansVisible(!savedPlansVisible)}
                    className="w-full flex justify-between items-center text-left"
                >
                    <div className="flex items-center">
                        <ClipboardListIcon className="w-5 h-5 mr-3 text-gray-600" />
                        <h2 className="text-xl font-bold text-gray-800">{t('settings.savedPlansTitle')}</h2>
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform ${savedPlansVisible ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${savedPlansVisible ? 'max-h-[1000px] opacity-100 mt-4 pt-4 border-t' : 'max-h-0 opacity-0'}`}>
                    {savedPlans.length > 0 ? (
                        <div className="space-y-3">
                            {savedPlans.map(p => (
                                <div key={p.timestamp} className="p-3 bg-gray-50 rounded-lg border flex justify-between items-center">
                                    <p className="font-semibold text-gray-700">
                                        {t('settings.savedOn', { date: new Date(p.timestamp).toLocaleDateString(language) })}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => handleLoadPlan(p.plan)} className="text-sm font-bold text-emerald-600 hover:underline">{t('settings.loadPlan')}</button>
                                        <button onClick={() => deleteSavedPlan(p.timestamp)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 pt-2">{t('settings.noSavedPlans')}</p>
                    )}
                </div>
            </Card>

            <Card className="p-4 sm:p-6">
                <button
                    onClick={() => setHistoryVisible(!historyVisible)}
                    className="w-full flex justify-between items-center text-left"
                >
                    <div className="flex items-center">
                        <ArchiveIcon className="w-5 h-5 mr-3 text-gray-600" />
                        <h2 className="text-xl font-bold text-gray-800">{t('settings.historyTitle')}</h2>
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform ${historyVisible ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${historyVisible ? 'max-h-[1000px] opacity-100 mt-4 pt-4 border-t' : 'max-h-0 opacity-0'}`}>
                    {goalsHistory.length > 0 ? (
                        <div className="space-y-3">
                            {goalsHistory.map(item => (
                                <div key={item.date} className="p-3 bg-gray-50 rounded-lg border">
                                    <p className="font-semibold text-gray-800 mb-2">
                                        {new Date(item.date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                                        <span>{t('dashboard.caloriesOf', { target: '' })}: {Math.round(item.goals.calories.current)} / {item.goals.calories.target} kcal</span>
                                        <span>{t('pdf.water')}: {item.goals.water.current} / {item.goals.water.target} ml</span>
                                        <span>{t('dashboard.protein')}: {Math.round(item.goals.protein.current)} / {item.goals.protein.target} g</span>
                                        <span>{t('dashboard.carbs')}: {Math.round(item.goals.carbs.current)} / {item.goals.carbs.target} g</span>
                                        <span>{t('dashboard.fats')}: {Math.round(item.goals.fat.current)} / {item.goals.fat.target} g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 pt-2">{t('settings.noHistory')}</p>
                    )}
                </div>
            </Card>
            
            <Card className="p-4 sm:p-6">
                <div className="space-y-4 mb-4">
                    <label htmlFor="include-recipes" className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="include-recipes"
                            checked={includeRecipesInPdf}
                            onChange={(e) => setIncludeRecipesInPdf(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ml-3 text-gray-700 font-medium">{t('settings.includeRecipesInPdf')}</span>
                    </label>
                    <label htmlFor="include-plan" className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="include-plan"
                            checked={includeHealthPlanInPdf}
                            onChange={(e) => setIncludeHealthPlanInPdf(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="ml-3 text-gray-700 font-medium">{t('settings.includeHealthPlanInPdf')}</span>
                    </label>
                </div>
                 <button
                    type="button"
                    onClick={handleExport}
                    className="w-full py-3 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center"
                >
                    <DocumentDownloadIcon className="w-5 h-5 mr-2" />
                    {t('settings.exportButton')}
                </button>
            </Card>
        </div>
    );
};

export default Settings;
