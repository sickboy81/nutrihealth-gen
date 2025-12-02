import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import type { UserProfile, DailyGoal } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { exportToPDF } from '../services/pdfExportService';
import { DocumentDownloadIcon } from '../components/icons/DocumentDownloadIcon';
import { DropletIcon } from '../components/icons/DropletIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { ArchiveIcon } from '../components/icons/ArchiveIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { ClipboardListIcon } from '../components/icons/ClipboardListIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';
import { ChartLineIcon } from '../components/icons/ChartLineIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { ACHIEVEMENTS_LIST } from '../constants';
import { CogIcon } from '../components/icons/CogIcon';


const Settings = () => {
    const { t, language, setLanguage } = useI18n();
    const { recipes, dailyGoals, calorieHistory, lastGeneratedPlan, savedRecipes, updateDailyGoals, goalsHistory, savedPlans, deleteSavedPlan, loadSavedPlan, assistantName, setAssistantName, userProfile, weightHistory, gamification, preferences, togglePreference } = useUserData();
    const navigate = useNavigate();
    const [goals, setGoals] = useState<DailyGoal>(dailyGoals);
    const [localAssistantName, setLocalAssistantName] = useState(assistantName);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [savedPlansVisible, setSavedPlansVisible] = useState(false);
    const [includeRecipesInPdf, setIncludeRecipesInPdf] = useState(true);
    const [includeHealthPlanInPdf, setIncludeHealthPlanInPdf] = useState(true);
    const [goalsRecalculated, setGoalsRecalculated] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'goals' | 'data'>('general');

    useEffect(() => {
        setGoals(dailyGoals);
    }, [dailyGoals]);
    
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
            updateDailyGoals(goals);
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
            userProfile,
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
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            {/* Modern Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <CogIcon className="w-7 h-7 text-white" />
                    </div>
                    {t('settings.title')}
                </h1>
                <p className="text-gray-500">Personalize sua experiência e gerencie suas preferências</p>
            </div>

            {/* Modern Tab Navigation */}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex gap-1 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`px-6 py-3 font-semibold text-sm transition-all whitespace-nowrap ${
                            activeTab === 'general'
                                ? 'text-emerald-600 border-b-2 border-emerald-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        ⚙️ Geral
                    </button>
                    <button
                        onClick={() => setActiveTab('goals')}
                        className={`px-6 py-3 font-semibold text-sm transition-all whitespace-nowrap ${
                            activeTab === 'goals'
                                ? 'text-emerald-600 border-b-2 border-emerald-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        🎯 Metas
                    </button>
                    <button
                        onClick={() => setActiveTab('data')}
                        className={`px-6 py-3 font-semibold text-sm transition-all whitespace-nowrap ${
                            activeTab === 'data'
                                ? 'text-emerald-600 border-b-2 border-emerald-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        📊 Dados
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        {/* App Preferences Card */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-2xl">🎨</span>
                                {t('settings.preferencesTitle')}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🎮</span>
                                        <span className="text-gray-800 font-medium">{t('settings.enableGamification')}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={preferences.showGamification} 
                                        onChange={() => togglePreference('showGamification')}
                                        className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                </label>
                                <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">🏆</span>
                                        <span className="text-gray-800 font-medium">{t('settings.enableChallenges')}</span>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        checked={preferences.showChallenges} 
                                        onChange={() => togglePreference('showChallenges')}
                                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                </label>
                            </div>
                        </Card>

                        {/* Language & Assistant Card */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-2xl">🌍</span>
                                Idioma & Assistente
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">{t('settings.language')}</label>
                                    <select 
                                        id="language" 
                                        value={language} 
                                        onChange={handleLanguageChange} 
                                        className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                    >
                                        <option value="pt">🇧🇷 Português</option>
                                        <option value="en">🇺🇸 English</option>
                                        <option value="es">🇪🇸 Español</option>
                                        <option value="de">🇩🇪 Deutsch</option>
                                        <option value="fr">🇫🇷 Français</option>
                                        <option value="ru">🇷🇺 Русский</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="assistant" className="block text-sm font-semibold text-gray-700 mb-2">{t('settings.assistant')}</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <ChatBubbleIcon className="w-5 h-5 text-gray-400" />
                                        </span>
                                        <select 
                                            id="assistant" 
                                            value={localAssistantName} 
                                            onChange={(e) => setLocalAssistantName(e.target.value)} 
                                            className="w-full p-3 pl-10 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                                        >
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
                        </Card>

                        {/* Achievements - if gamification enabled */}
                        {preferences.showGamification && (
                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrophyIcon className="w-6 h-6 text-yellow-500" />
                                    {t('settings.achievements')}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {ACHIEVEMENTS_LIST.map(achievement => {
                                        const isUnlocked = gamification.unlockedAchievements.some(u => u.id === achievement.id);
                                        return (
                                            <div key={achievement.id} className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${isUnlocked ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 shadow-md' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                                                <div className={`p-3 rounded-xl ${isUnlocked ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                                                    {isUnlocked ? <TrophyIcon className="w-6 h-6 text-yellow-600" /> : <div className="w-6 h-6 bg-gray-300 rounded" />}
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
                    </div>
                )}

                {/* Goals Tab */}
                {activeTab === 'goals' && (
                    <div className="space-y-6">
                        {/* Macros Card */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-2xl">🎯</span>
                                {t('settings.goalsTitle')}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="water.target" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <DropletIcon className="w-4 h-4 text-blue-500" />
                                            {t('settings.waterGoalLabel')}
                                        </label>
                                        <input 
                                            type="number" 
                                            id="water.target" 
                                            name="water.target" 
                                            value={goals.water.target} 
                                            onChange={handleGoalChange} 
                                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="calories.target" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <TargetIcon className="w-4 h-4 text-emerald-500" />
                                            {t('settings.calorieGoalLabel')}
                                        </label>
                                        <input 
                                            type="number" 
                                            id="calories.target" 
                                            name="calories.target" 
                                            value={goals.calories.target} 
                                            onChange={handleGoalChange} 
                                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="protein.target" className="block text-sm font-semibold text-gray-700 mb-2">💪 {t('settings.proteinGoalLabel')}</label>
                                        <input 
                                            type="number" 
                                            id="protein.target" 
                                            name="protein.target" 
                                            value={goals.protein.target} 
                                            onChange={handleGoalChange} 
                                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="carbs.target" className="block text-sm font-semibold text-gray-700 mb-2">🍞 {t('settings.carbsGoalLabel')}</label>
                                        <input 
                                            type="number" 
                                            id="carbs.target" 
                                            name="carbs.target" 
                                            value={goals.carbs.target} 
                                            onChange={handleGoalChange} 
                                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition" 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="fat.target" className="block text-sm font-semibold text-gray-700 mb-2">🥑 {t('settings.fatGoalLabel')}</label>
                                        <input 
                                            type="number" 
                                            id="fat.target" 
                                            name="fat.target" 
                                            value={goals.fat.target} 
                                            onChange={handleGoalChange} 
                                            className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Micronutrients Card */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="text-2xl">💊</span>
                                {t('settings.microsTitle')}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <div>
                                    <label htmlFor="vitaminC.target" className="block text-xs font-semibold text-gray-600 mb-1">🍊 Vit C (mg)</label>
                                    <input type="number" id="vitaminC.target" name="vitaminC.target" value={goals.vitaminC?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="vitaminD.target" className="block text-xs font-semibold text-gray-600 mb-1">☀️ Vit D (IU)</label>
                                    <input type="number" id="vitaminD.target" name="vitaminD.target" value={goals.vitaminD?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="iron.target" className="block text-xs font-semibold text-gray-600 mb-1">🔴 Iron (mg)</label>
                                    <input type="number" id="iron.target" name="iron.target" value={goals.iron?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="calcium.target" className="block text-xs font-semibold text-gray-600 mb-1">🦴 Calcium (mg)</label>
                                    <input type="number" id="calcium.target" name="calcium.target" value={goals.calcium?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="magnesium.target" className="block text-xs font-semibold text-gray-600 mb-1">⚡ Magnesium (mg)</label>
                                    <input type="number" id="magnesium.target" name="magnesium.target" value={goals.magnesium?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="vitaminA.target" className="block text-xs font-semibold text-gray-600 mb-1">🥕 Vit A (mcg)</label>
                                    <input type="number" id="vitaminA.target" name="vitaminA.target" value={goals.vitaminA?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="vitaminB12.target" className="block text-xs font-semibold text-gray-600 mb-1">🧠 Vit B12 (mcg)</label>
                                    <input type="number" id="vitaminB12.target" name="vitaminB12.target" value={goals.vitaminB12?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="potassium.target" className="block text-xs font-semibold text-gray-600 mb-1">🍌 Potassium (mg)</label>
                                    <input type="number" id="potassium.target" name="potassium.target" value={goals.potassium?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="sodium.target" className="block text-xs font-semibold text-gray-600 mb-1">🧂 Sodium (mg)</label>
                                    <input type="number" id="sodium.target" name="sodium.target" value={goals.sodium?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition" />
                                </div>
                                <div>
                                    <label htmlFor="zinc.target" className="block text-xs font-semibold text-gray-600 mb-1">⚙️ Zinc (mg)</label>
                                    <input type="number" id="zinc.target" name="zinc.target" value={goals.zinc?.target} onChange={handleGoalChange} className="w-full p-2 text-sm bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" />
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Data Tab */}
                {activeTab === 'data' && (
                    <div className="space-y-6">
                        {/* Weight Chart */}
                        <Card className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <ChartLineIcon className="w-6 h-6 text-emerald-600" />
                                {t('settings.weightChart')}
                            </h3>
                            <div className="h-64 min-h-[256px] w-full">
                                <ResponsiveContainer width="100%" height="100%" minHeight={256}>
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
                                        <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{fill: '#10b981', r: 4}} activeDot={{r: 6}} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Saved Plans */}
                        <Card className="p-6">
                            <button
                                onClick={() => setSavedPlansVisible(!savedPlansVisible)}
                                className="w-full flex justify-between items-center text-left group"
                            >
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ClipboardListIcon className="w-6 h-6 text-blue-600" />
                                    {t('settings.savedPlansTitle')}
                                </h3>
                                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform group-hover:text-gray-600 ${savedPlansVisible ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 overflow-hidden ${savedPlansVisible ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                {savedPlans.length > 0 ? (
                                    <div className="space-y-3">
                                        {savedPlans.map(p => (
                                            <div key={p.timestamp} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 flex justify-between items-center hover:border-blue-300 transition-all">
                                                <p className="font-semibold text-gray-800">
                                                    📅 {t('settings.savedOn', { date: new Date(p.timestamp).toLocaleDateString(language) })}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleLoadPlan(p.plan)} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-all">{t('settings.loadPlan')}</button>
                                                    <button onClick={() => deleteSavedPlan(p.timestamp)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">{t('settings.noSavedPlans')}</p>
                                )}
                            </div>
                        </Card>

                        {/* History */}
                        <Card className="p-6">
                            <button
                                onClick={() => setHistoryVisible(!historyVisible)}
                                className="w-full flex justify-between items-center text-left group"
                            >
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ArchiveIcon className="w-6 h-6 text-purple-600" />
                                    {t('settings.historyTitle')}
                                </h3>
                                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform group-hover:text-gray-600 ${historyVisible ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`transition-all duration-300 overflow-hidden ${historyVisible ? 'max-h-[1000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                {goalsHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {goalsHistory.map(item => (
                                            <div key={item.date} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                                                <p className="font-bold text-gray-900 mb-3">
                                                    📅 {new Date(item.date).toLocaleDateString(language, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">🔥</span>
                                                        <span className="text-gray-700">{Math.round(item.goals.calories.current)} / {item.goals.calories.target} kcal</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">💧</span>
                                                        <span className="text-gray-700">{item.goals.water.current} / {item.goals.water.target} ml</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">💪</span>
                                                        <span className="text-gray-700">{Math.round(item.goals.protein.current)} / {item.goals.protein.target} g</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">🍞</span>
                                                        <span className="text-gray-700">{Math.round(item.goals.carbs.current)} / {item.goals.carbs.target} g</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">🥑</span>
                                                        <span className="text-gray-700">{Math.round(item.goals.fat.current)} / {item.goals.fat.target} g</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">{t('settings.noHistory')}</p>
                                )}
                            </div>
                        </Card>

                        {/* Export PDF */}
                        <Card className="p-6 bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <DocumentDownloadIcon className="w-6 h-6 text-sky-600" />
                                Exportar Dados
                            </h3>
                            <div className="space-y-4 mb-4">
                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-gray-50 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={includeRecipesInPdf}
                                        onChange={(e) => setIncludeRecipesInPdf(e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                    />
                                    <span className="text-gray-700 font-medium">{t('settings.includeRecipesInPdf')}</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-gray-50 transition-all">
                                    <input
                                        type="checkbox"
                                        checked={includeHealthPlanInPdf}
                                        onChange={(e) => setIncludeHealthPlanInPdf(e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                                    />
                                    <span className="text-gray-700 font-medium">{t('settings.includeHealthPlanInPdf')}</span>
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={handleExport}
                                className="w-full py-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold rounded-xl hover:from-sky-700 hover:to-blue-700 transition-all shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2"
                            >
                                <DocumentDownloadIcon className="w-5 h-5" />
                                {t('settings.exportButton')}
                            </button>
                        </Card>
                    </div>
                )}

                {/* Save Button - Fixed at bottom */}
                <div className="sticky bottom-4 z-10">
                    <button 
                        type="submit" 
                        disabled={isSaving} 
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSaving && <Spinner className="w-5 h-5" />}
                        {isSaving ? 'Salvando...' : '💾 Salvar Configurações'}
                    </button>
                </div>

                {saveSuccess && (
                    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl animate-bounce font-bold">
                        ✅ Configurações salvas com sucesso!
                    </div>
                )}
            </form>
        </div>
    );
};

export default Settings;
