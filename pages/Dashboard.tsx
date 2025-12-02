
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useI18n } from '../contexts/I18nContext';
import { MOCK_USER_PROFILE } from '../constants';
import { useUserData } from '../contexts/UserDataContext';
import { ScaleIcon } from '../components/icons/ScaleIcon';
import { RulerIcon } from '../components/icons/RulerIcon';
import { HeartbeatIcon } from '../components/icons/HeartbeatIcon';
import { DropletIcon } from '../components/icons/DropletIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { PillIcon } from '../components/icons/PillIcon';
import { FireIcon } from '../components/icons/FireIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { TrophyIcon } from '../components/icons/TrophyIcon';
import { EmojiHappyIcon } from '../components/icons/EmojiHappyIcon';
import { FlagIcon } from '../components/icons/FlagIcon';
import { MoonStarsIcon } from '../components/icons/MoonStarsIcon';
import { generate30DayChallenge } from '../services/geminiService';
import { MoodType, SleepQuality } from '../types';

const ProgressBar = ({ current, target, label, colorClass, unit = 'g' }: { current: number, target: number, label: string, colorClass: string, unit?: string }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{Math.round(current)} / {target}{unit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`${colorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const ACTIVITIES = [
    { id: 'custom', met: 0 },
    { id: 'walking', met: 3.5 },
    { id: 'running', met: 8.0 },
    { id: 'cycling', met: 7.5 },
    { id: 'weights', met: 3.0 },
    { id: 'yoga', met: 2.5 },
    { id: 'swimming', met: 6.0 },
    { id: 'hiit', met: 8.0 },
    { id: 'sports', met: 7.0 },
];

const ActivityWidget = () => {
    const { t } = useI18n();
    const { logActivity, activityLog, userProfile } = useUserData();
    const [name, setName] = useState('');
    const [kcal, setKcal] = useState('');
    const [duration, setDuration] = useState('');
    const [activityType, setActivityType] = useState('custom');

    // Auto-calculate calories when duration or type changes
    useEffect(() => {
        if (activityType !== 'custom' && duration && userProfile.weight) {
            const activity = ACTIVITIES.find(a => a.id === activityType);
            if (activity) {
                const minutes = parseFloat(duration);
                if (!isNaN(minutes) && minutes > 0) {
                    // Formula: Calories = MET * Weight (kg) * Time (hours)
                    const calculatedKcal = Math.round(activity.met * userProfile.weight * (minutes / 60));
                    setKcal(calculatedKcal.toString());
                }
            }
            // Update name label if it's not custom
            const translationKey = `dashboard.activity.types.${activityType}`;
            // We set the name but allow user to override if they want
            if (!name || name === t(translationKey)) {
                // Don't overwrite if user customized the name, unless it was the previous auto name
                if (activityType !== 'custom') setName(t(translationKey));
            }
        }
    }, [duration, activityType, userProfile.weight, t]);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setActivityType(newType);
        if (newType !== 'custom') {
            setName(t(`dashboard.activity.types.${newType}`));
        } else {
            setName('');
            setKcal('');
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && kcal && duration) {
            logActivity(name, Number(kcal), Number(duration));
            // Reset form but keep type if convenient? No, reset to clean state.
            setName('');
            setKcal('');
            setDuration('');
            setActivityType('custom');
        }
    };

    const totalBurned = useMemo(() => activityLog.reduce((acc, curr) => acc + curr.caloriesBurned, 0), [activityLog]);

    return (
        <Card className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-3">
                <div className="p-2 bg-orange-100 rounded-full mr-3">
                    <FireIcon className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{t('dashboard.activity.title')}</h2>
            </div>

            <div className="text-center mb-4">
                <p className="text-3xl font-extrabold text-orange-500">{totalBurned} <span className="text-lg text-gray-500 font-medium">kcal</span></p>
                <p className="text-xs text-gray-400">{t('dashboard.burned')}</p>
            </div>

            <form onSubmit={handleAdd} className="space-y-2 mb-4">
                <select
                    value={activityType}
                    onChange={handleTypeChange}
                    className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                    {ACTIVITIES.map(act => (
                        <option key={act.id} value={act.id}>
                            {t(`dashboard.activity.types.${act.id}`)}
                        </option>
                    ))}
                </select>

                {activityType === 'custom' && (
                    <input
                        type="text"
                        placeholder={t('dashboard.activity.placeholderName')}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                )}

                <div className="flex gap-2">
                    <div className="relative w-1/2">
                        <input
                            type="number"
                            placeholder={t('dashboard.activity.placeholderDur')}
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <span className="absolute right-2 top-2 text-xs text-gray-400">min</span>
                    </div>
                    <div className="relative w-1/2">
                        <input
                            type="number"
                            placeholder={t('dashboard.activity.placeholderCal')}
                            value={kcal}
                            onChange={e => setKcal(e.target.value)}
                            className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <span className="absolute right-2 top-2 text-xs text-gray-400">kcal</span>
                    </div>
                </div>
                <button type="submit" disabled={!name || !kcal} className="w-full py-2 bg-orange-500 text-white font-semibold text-sm rounded-lg hover:bg-orange-600 transition-colors flex justify-center items-center disabled:opacity-50">
                    <PlusCircleIcon className="w-4 h-4 mr-1" /> {t('dashboard.activity.log')}
                </button>
            </form>

            <div className="flex-grow overflow-y-auto max-h-32 space-y-2 custom-scrollbar">
                <p className="text-xs font-bold text-gray-400 uppercase">{t('dashboard.activity.todayLog')}</p>
                {activityLog.length === 0 && <p className="text-xs text-center text-gray-300 py-2">-</p>}
                {activityLog.slice().reverse().map(log => (
                    <div key={log.id} className="flex justify-between text-sm border-b border-gray-50 pb-1 last:border-0">
                        <span className="text-gray-700 truncate w-24">{log.name}</span>
                        <span className="text-gray-500 text-xs">{log.durationMinutes}m</span>
                        <span className="font-semibold text-orange-600">{log.caloriesBurned}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}

const FastingWidget = () => {
    const { t } = useI18n();
    const { fastingState, startFasting, stopFasting } = useUserData();
    const [selectedProtocol, setSelectedProtocol] = useState('16:8');
    const [elapsedTime, setElapsedTime] = useState(0);

    const protocols = [
        { label: '12:12 (Circadian)', value: '12:12', duration: 12 },
        { label: '14:10 (Beginner)', value: '14:10', duration: 14 },
        { label: '16:8 (Lean Gains)', value: '16:8', duration: 16 },
        { label: '18:6 (Warrior)', value: '18:6', duration: 18 },
        { label: '20:4 (Warrior+) ', value: '20:4', duration: 20 },
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (fastingState.isFasting && fastingState.startTime) {
            const updateTimer = () => {
                const now = Date.now();
                const diff = now - (fastingState.startTime as number);
                setElapsedTime(diff);
            };
            updateTimer();
            interval = setInterval(updateTimer, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(interval);
    }, [fastingState.isFasting, fastingState.startTime]);

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor(ms / (1000 * 60 * 60));
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        const protocol = protocols.find(p => p.value === selectedProtocol);
        if (protocol) {
            startFasting(protocol.duration, protocol.value);
        }
    };

    const progressPercentage = fastingState.isFasting && fastingState.targetDuration
        ? Math.min((elapsedTime / (fastingState.targetDuration * 60 * 60 * 1000)) * 100, 100)
        : 0;

    const endsAt = fastingState.startTime
        ? new Date(fastingState.startTime + fastingState.targetDuration * 60 * 60 * 1000)
        : null;

    return (
        <Card className="p-4 flex flex-col h-full relative overflow-hidden">
            <div className="flex items-center mb-3 z-10">
                <div className="p-2 bg-purple-100 rounded-full mr-3">
                    <ClockIcon className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{t('dashboard.fasting.title')}</h2>
            </div>

            {fastingState.isFasting ? (
                <div className="flex flex-col items-center justify-center flex-grow z-10 space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">{t('dashboard.fasting.elapsed')}</p>
                        <p className="text-4xl font-extrabold text-purple-600 font-mono">{formatTime(elapsedTime)}</p>
                    </div>

                    <div className="w-full space-y-2">
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className="bg-purple-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>{t('dashboard.fasting.startedAt')} {new Date(fastingState.startTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>{t('dashboard.fasting.endsAt')} {endsAt?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm font-semibold text-gray-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
                            {t('dashboard.fasting.goal')}: {fastingState.targetDuration}h ({fastingState.protocol})
                        </p>
                    </div>

                    <button
                        onClick={stopFasting}
                        className="w-full py-2 border-2 border-purple-100 text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-colors mt-auto"
                    >
                        {t('dashboard.fasting.end')}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col justify-center flex-grow z-10 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">{t('dashboard.fasting.selectProtocol')}</label>
                        <select
                            value={selectedProtocol}
                            onChange={(e) => setSelectedProtocol(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                            {protocols.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <p className="text-purple-800 text-sm">
                            {protocols.find(p => p.value === selectedProtocol)?.duration}h {t('dashboard.fasting.goal')}
                        </p>
                    </div>
                    <button
                        onClick={handleStart}
                        className="w-full py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 mt-auto"
                    >
                        {t('dashboard.fasting.start')}
                    </button>
                </div>
            )}
        </Card>
    );
};

const LevelWidget = () => {
    const { t } = useI18n();
    const { gamification } = useUserData();

    const currentLevelBaseXP = Math.pow(gamification.level - 1, 2) * 100;
    const nextLevelXP = Math.pow(gamification.level, 2) * 100;
    const xpInLevel = gamification.xp - currentLevelBaseXP;
    const xpNeeded = nextLevelXP - currentLevelBaseXP;

    const percentage = Math.min((xpInLevel / xpNeeded) * 100, 100);

    return (
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 mb-6 shadow-lg shadow-indigo-500/30">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                        <TrophyIcon className="w-6 h-6 text-yellow-300" />
                    </div>
                    <div>
                        <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">{t('dashboard.level', { level: gamification.level })}</p>
                        <p className="font-bold text-lg">{t('dashboard.xp', { current: Math.round(gamification.xp), next: nextLevelXP })}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs text-indigo-100">
                        {gamification.unlockedAchievements.length} 🏅
                    </p>
                </div>
            </div>
            <div className="w-full bg-black/20 rounded-full h-2 backdrop-blur-sm">
                <div className="bg-yellow-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
            </div>
        </Card>
    );
};

const MoodWidget = () => {
    const { t } = useI18n();
    const { logMood, moodHistory } = useUserData();
    const today = new Date().toISOString().split('T')[0];
    const todaysMood = moodHistory.find(m => m.date === today)?.mood;

    const moods: { type: MoodType, label: string, color: string }[] = [
        { type: 'great', label: t('dashboard.mood.great'), color: 'bg-green-100 text-green-600 border-green-200' },
        { type: 'good', label: t('dashboard.mood.good'), color: 'bg-blue-100 text-blue-600 border-blue-200' },
        { type: 'okay', label: t('dashboard.mood.okay'), color: 'bg-yellow-100 text-yellow-600 border-yellow-200' },
        { type: 'tired', label: t('dashboard.mood.tired'), color: 'bg-gray-100 text-gray-600 border-gray-200' },
        { type: 'stressed', label: t('dashboard.mood.stressed'), color: 'bg-red-100 text-red-600 border-red-200' }
    ];

    return (
        <Card className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-3">
                <div className="p-2 bg-yellow-100 rounded-full mr-3">
                    <EmojiHappyIcon className="w-5 h-5 text-yellow-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{t('dashboard.mood.title')}</h2>
            </div>

            {todaysMood ? (
                <div className="flex-grow flex flex-col items-center justify-center animate-fade-in">
                    <div className={`p-4 rounded-full mb-3 ${moods.find(m => m.type === todaysMood)?.color.split(' ')[0]}`}>
                        <EmojiHappyIcon className={`w-12 h-12 ${moods.find(m => m.type === todaysMood)?.color.split(' ')[1]}`} />
                    </div>
                    <p className="font-bold text-lg text-gray-700">{moods.find(m => m.type === todaysMood)?.label}</p>
                    <p className="text-sm text-gray-500 mt-1">{t('dashboard.mood.logged')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 flex-grow">
                    {moods.map(mood => (
                        <button
                            key={mood.type}
                            onClick={() => logMood(mood.type)}
                            className={`p-2 rounded-lg border text-sm font-medium transition-transform hover:scale-105 flex flex-col items-center justify-center ${mood.color}`}
                        >
                            <span>{mood.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </Card>
    );
};

const SleepWidget = () => {
    const { t } = useI18n();
    const { logSleep, sleepHistory } = useUserData();
    const [hours, setHours] = useState<string>('');
    const [quality, setQuality] = useState<SleepQuality>('good');

    const today = new Date().toISOString().split('T')[0];
    const todaysSleep = sleepHistory.find(s => s.date === today);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hours) {
            logSleep(parseFloat(hours), quality);
        }
    };

    const weeklyAverage = useMemo(() => {
        if (sleepHistory.length === 0) return 0;
        const recent = sleepHistory.slice(-7);
        const total = recent.reduce((acc, curr) => acc + curr.durationHours, 0);
        return (total / recent.length).toFixed(1);
    }, [sleepHistory]);

    return (
        <Card className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-3">
                <div className="p-2 bg-indigo-100 rounded-full mr-3">
                    <MoonStarsIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{t('dashboard.sleep.title')}</h2>
            </div>

            {todaysSleep ? (
                <div className="flex-grow flex flex-col items-center justify-center animate-fade-in text-center">
                    <p className="text-4xl font-extrabold text-indigo-600">{todaysSleep.durationHours}<span className="text-xl">h</span></p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 mt-2 uppercase">
                        {t(`dashboard.sleep.qualities.${todaysSleep.quality}`)}
                    </span>
                    <p className="text-sm text-gray-500 mt-4">{t('dashboard.sleep.logged')}</p>
                    <p className="text-xs text-gray-400 mt-1">{t('dashboard.sleep.average', { hours: weeklyAverage })}</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('dashboard.sleep.duration')}</label>
                        <input
                            type="number"
                            step="0.5"
                            max="24"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="8.0"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t('dashboard.sleep.quality')}</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['poor', 'fair', 'good', 'excellent'] as SleepQuality[]).map(q => (
                                <button
                                    key={q}
                                    type="button"
                                    onClick={() => setQuality(q)}
                                    className={`text-xs py-2 px-1 rounded-md border ${quality === q ? 'bg-indigo-100 border-indigo-300 text-indigo-700 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {t(`dashboard.sleep.qualities.${q}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={!hours}
                        className="w-full py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg hover:bg-indigo-700 transition-colors mt-auto disabled:opacity-50"
                    >
                        {t('dashboard.sleep.log')}
                    </button>
                </form>
            )}
        </Card>
    );
};

const ChallengeWidget = () => {
    const { t, language } = useI18n();
    const { challenge, startChallenge, completeChallengeTask, userProfile } = useUserData();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleStart = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const tasks = await generate30DayChallenge(userProfile.objective, language);
            startChallenge(tasks);
        } catch (e) {
            setError(t('dashboard.challenge.error'));
        } finally {
            setIsLoading(false);
        }
    };

    // Determine current task
    // Logic: Challenge start date vs today. 
    const getDayIndex = () => {
        if (!challenge.startDate) return 0;
        const diff = Date.now() - challenge.startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        return Math.min(Math.max(0, days), 29); // 0 to 29
    };

    const currentDayIndex = getDayIndex();
    const currentTask = challenge.tasks[currentDayIndex];

    return (
        <Card className="p-4 flex flex-col h-full">
            <div className="flex items-center mb-3">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                    <FlagIcon className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{t('dashboard.challenge.title')}</h2>
            </div>

            {challenge.isActive && currentTask ? (
                <div className="flex flex-col flex-grow animate-fade-in">
                    <div className="mb-2">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wide bg-red-50 px-2 py-1 rounded-md">
                            {t('dashboard.challenge.day', { day: currentTask.day })}
                        </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{currentTask.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{currentTask.description}</p>

                    {currentTask.completed ? (
                        <div className="w-full py-3 bg-green-100 text-green-800 font-semibold rounded-xl flex items-center justify-center mt-auto">
                            <CheckIcon className="w-5 h-5 mr-2" />
                            {t('dashboard.challenge.completed')}
                        </div>
                    ) : (
                        <button
                            onClick={() => completeChallengeTask(currentTask.day)}
                            className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 mt-auto"
                        >
                            {t('dashboard.challenge.complete')}
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-grow text-center space-y-4">
                    <p className="text-gray-500 text-sm">
                        Aceite o desafio de 30 dias personalizado para seu objetivo: <span className="font-semibold">{userProfile.objective}</span>.
                    </p>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        onClick={handleStart}
                        disabled={isLoading}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center"
                    >
                        {isLoading ? <Spinner className="w-5 h-5 mr-2" /> : null}
                        {isLoading ? t('dashboard.challenge.generating') : t('dashboard.challenge.start')}
                    </button>
                </div>
            )}
        </Card>
    );
};

import { ShareIcon } from '../components/icons/ShareIcon';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useI18n();
    const { dailyGoals, calorieHistory, activityLog, logWater, logSupplement, userProfile, toggleDailySupplement, preferences, gamification } = useUserData();
    const [vitaminTaken, setVitaminTaken] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const chartData = useMemo(() => {
        const dayMap: { [key: number]: string } = {
            0: t('healthPlan.dayShort.sunday'),
            1: t('healthPlan.dayShort.monday'),
            2: t('healthPlan.dayShort.tuesday'),
            3: t('healthPlan.dayShort.wednesday'),
            4: t('healthPlan.dayShort.thursday'),
            5: t('healthPlan.dayShort.friday'),
            6: t('healthPlan.dayShort.saturday'),
        };

        const last7DaysData: { name: string; kcal: number }[] = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const record = calorieHistory.find(h => h.date === dateStr);

            last7DaysData.push({
                name: dayMap[date.getDay()],
                kcal: record ? Math.round(record.kcal) : 0,
            });
        }
        return last7DaysData;
    }, [calorieHistory, t]);

    const totalBurned = useMemo(() => activityLog.reduce((acc, curr) => acc + curr.caloriesBurned, 0), [activityLog]);
    const netCalories = Math.max(0, dailyGoals.calories.current - totalBurned);

    const handleTakeVitamin = () => {
        logSupplement();
        setVitaminTaken(true);
        setTimeout(() => setVitaminTaken(false), 2000);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    const waterPercentage = dailyGoals.water.target > 0 ? Math.min((dailyGoals.water.current / dailyGoals.water.target) * 100, 100) : 0;

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="mb-2 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.greeting', { name: userProfile.name })}</h2>
                    <p className="text-gray-500">{t('dashboard.subtitle')}</p>
                </div>
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'NutriHealth Progress',
                                text: `I'm crushing my health goals on NutriHealth! Level ${Math.floor(1 + Math.sqrt(gamification.xp / 100))} • ${gamification.unlockedAchievements.length} Achievements Unlocked.`,
                                url: window.location.href
                            });
                        } else {
                            alert('Sharing is not supported on this browser, but keep up the great work!');
                        }
                    }}
                    className="p-2 bg-white border border-gray-200 rounded-full text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                    title="Share Progress"
                >
                    <ShareIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Level / Gamification Widget - Conditioned by Preference */}
            {preferences.showGamification && <LevelWidget />}

            {/* Stats Cards */}
            <Card>
                <div className="flex justify-around divide-x divide-gray-200">
                    <div className="flex-1 px-2 py-3 flex flex-col items-center text-center">
                        <div className="p-2 bg-emerald-100 rounded-full mb-1">
                            <ScaleIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-xs text-gray-500">{t('dashboard.weight')}</p>
                        <p className="text-md font-bold text-gray-800">{`${userProfile.weight} kg`}</p>
                    </div>
                    <div className="flex-1 px-2 py-3 flex flex-col items-center text-center">
                        <div className="p-2 bg-emerald-100 rounded-full mb-1">
                            <RulerIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-xs text-gray-500">{t('dashboard.height')}</p>
                        <p className="text-md font-bold text-gray-800">{`${userProfile.height} cm`}</p>
                    </div>
                    <div className="flex-1 px-2 py-3 flex flex-col items-center text-center">
                        <div className="p-2 bg-emerald-100 rounded-full mb-1">
                            <HeartbeatIcon className="w-5 h-5 text-emerald-600" />
                        </div>
                        <p className="text-xs text-gray-500">{t('dashboard.bmi')}</p>
                        <p className="text-md font-bold text-gray-800">{userProfile.bmi}</p>
                    </div>
                </div>
            </Card>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Macros Card - Spans 2 Cols */}
                <Card className="p-4 lg:col-span-2 flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">{t('dashboard.dailyGoals')}</h2>
                    <div className="flex justify-around items-center mb-6">
                        <div className="text-center opacity-60">
                            <p className="text-lg font-bold text-gray-600">{Math.round(dailyGoals.calories.current)}</p>
                            <p className="text-xs text-gray-400">{t('dashboard.eaten')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-5xl font-extrabold text-emerald-600">{Math.round(netCalories)}</p>
                            <p className="text-gray-500 font-medium">{t('dashboard.netCalories')}</p>
                            <p className="text-xs text-gray-400">{t('dashboard.caloriesOf', { target: dailyGoals.calories.target })}</p>
                        </div>
                        <div className="text-center opacity-60">
                            <p className="text-lg font-bold text-orange-500">-{totalBurned}</p>
                            <p className="text-xs text-gray-400">{t('dashboard.burned')}</p>
                        </div>
                    </div>
                    <div className="space-y-4 flex-grow">
                        <ProgressBar {...dailyGoals.protein} label={t('dashboard.protein')} colorClass="bg-sky-500" />
                        <ProgressBar {...dailyGoals.carbs} label={t('dashboard.carbs')} colorClass="bg-orange-500" />
                        <ProgressBar {...dailyGoals.fat} label={t('dashboard.fats')} colorClass="bg-amber-500" />
                    </div>
                </Card>

                {/* Water Card - Spans 1 Col */}
                <Card className="p-4 flex flex-col lg:col-span-1">
                    <div className="flex items-center mb-3">
                        <div className="p-2 bg-cyan-100 rounded-full mr-3">
                            <DropletIcon className="w-5 h-5 text-cyan-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">{t('dashboard.water')}</h2>
                    </div>
                    <div className="flex-grow flex flex-col items-center justify-center text-center py-2">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <DropletIcon className="w-full h-full text-cyan-50" />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 overflow-hidden flex items-end justify-center" style={{ height: `${waterPercentage}%` }}>
                                <DropletIcon className="w-24 h-24 text-cyan-400 absolute bottom-0" style={{ clipPath: `inset(${100 - waterPercentage}% 0 0 0)` }} />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center shadow-white drop-shadow-md">
                                <span className="text-cyan-900 font-bold text-lg">{`${Math.round(waterPercentage)}%`}</span>
                            </div>
                        </div>
                        <p className="text-2xl font-extrabold text-cyan-600 mt-2">{dailyGoals.water.current} ml</p>
                        <p className="text-gray-400 text-xs">{t('dashboard.waterOf', { target: dailyGoals.water.target })}</p>
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        <button onClick={() => logWater(250)} className="bg-cyan-100 text-cyan-800 font-semibold py-2 px-3 rounded-full hover:bg-cyan-200 transition-colors text-xs">+250</button>
                        <button onClick={() => logWater(300)} className="bg-cyan-100 text-cyan-800 font-semibold py-2 px-3 rounded-full hover:bg-cyan-200 transition-colors text-xs">+300</button>
                        <button onClick={() => logWater(500)} className="bg-cyan-100 text-cyan-800 font-semibold py-2 px-3 rounded-full hover:bg-cyan-200 transition-colors text-xs">+500</button>
                    </div>
                </Card>

                {/* Micros Card - Spans 2 Cols */}
                <Card className="p-4 lg:col-span-2 flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                        <div className="flex items-center mb-2 sm:mb-0">
                            <div className="p-2 bg-pink-100 rounded-full mr-3">
                                <PillIcon className="w-5 h-5 text-pink-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">{t('dashboard.micros.title')}</h2>
                        </div>

                        {userProfile.takesMultivitamin ? (
                            <div className="bg-pink-50 border border-pink-100 rounded-xl px-4 py-2 flex items-center space-x-3">
                                <span className="text-xs font-bold text-pink-800 uppercase tracking-wide hidden sm:inline">
                                    {t('dashboard.micros.vitaminReminder')}
                                </span>
                                <button
                                    onClick={toggleDailySupplement}
                                    className={`text-xs font-bold px-4 py-1.5 rounded-full flex items-center transition-all shadow-sm ${dailyGoals.supplementTaken
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-white border border-gray-200 text-gray-500 hover:text-pink-600 hover:border-pink-200'
                                        }`}
                                >
                                    {dailyGoals.supplementTaken ? <CheckIcon className="w-4 h-4 mr-1" /> : <div className="w-4 h-4 mr-1 border-2 border-current rounded-full"></div>}
                                    {dailyGoals.supplementTaken ? t('dashboard.micros.taken') : t('dashboard.micros.notTaken')}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleTakeVitamin}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center transition-all ${vitaminTaken
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                                    }`}
                            >
                                {vitaminTaken ? <CheckIcon className="w-4 h-4 mr-1" /> : <PlusCircleIcon className="w-4 h-4 mr-1" />}
                                {t('dashboard.micros.takeVitamin')}
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                        <ProgressBar {...dailyGoals.vitaminC} label={t('dashboard.micros.vitaminC')} colorClass="bg-yellow-400" unit="mg" />
                        <ProgressBar {...dailyGoals.vitaminD} label={t('dashboard.micros.vitaminD')} colorClass="bg-yellow-300" unit="IU" />
                        <ProgressBar {...dailyGoals.iron} label={t('dashboard.micros.iron')} colorClass="bg-red-400" unit="mg" />
                        <ProgressBar {...dailyGoals.calcium} label={t('dashboard.micros.calcium')} colorClass="bg-slate-300" unit="mg" />
                        <ProgressBar {...dailyGoals.magnesium} label={t('dashboard.micros.magnesium')} colorClass="bg-indigo-400" unit="mg" />
                        <ProgressBar {...dailyGoals.vitaminA} label={t('dashboard.micros.vitaminA')} colorClass="bg-orange-400" unit="mcg" />
                        <ProgressBar {...dailyGoals.vitaminB12} label={t('dashboard.micros.vitaminB12')} colorClass="bg-rose-400" unit="mcg" />
                        <ProgressBar {...dailyGoals.potassium} label={t('dashboard.micros.potassium')} colorClass="bg-blue-400" unit="mg" />
                        <ProgressBar {...dailyGoals.sodium} label={t('dashboard.micros.sodium')} colorClass="bg-gray-400" unit="mg" />
                        <ProgressBar {...dailyGoals.zinc} label={t('dashboard.micros.zinc')} colorClass="bg-teal-400" unit="mg" />
                    </div>
                </Card>

                {/* Challenge Widget - Spans 1 Col (Conditioned) */}
                {preferences.showChallenges && (
                    <div className="lg:col-span-1">
                        <ChallengeWidget />
                    </div>
                )}

                {/* Fasting Widget - Spans 1 Col */}
                <div className="lg:col-span-1">
                    <FastingWidget />
                </div>

                {/* Activity Widget - Spans 1 Col */}
                <div className="lg:col-span-1">
                    <ActivityWidget />
                </div>

                {/* Mood Widget - Spans 1 Col */}
                <div className="lg:col-span-1">
                    <MoodWidget />
                </div>

                {/* Sleep Widget - Spans 1 Col */}
                <div className="lg:col-span-1">
                    <SleepWidget />
                </div>

                {/* Charts & Info - Spans 3 Cols */}
                <Card className="p-4 lg:col-span-3">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">{t('dashboard.calorieHistory')}</h2>
                    <div className="w-full" style={{ minHeight: '256px', height: '256px' }}>
                        <ResponsiveContainer width="100%" height={256}>
                            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#d1d5db" />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#d1d5db" />
                                <Tooltip cursor={{ fill: 'rgba(236, 252, 241, 0.6)' }} contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }} />
                                <Bar dataKey="kcal" fill="#10b981" barSize={20} radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
