import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import type { UserProfile } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { UserIcon } from '../components/icons/UserIcon';
import { IdentificationIcon } from '../components/icons/IdentificationIcon';
import { ScaleIcon } from '../components/icons/ScaleIcon';
import { RulerIcon } from '../components/icons/RulerIcon';
import { TargetIcon } from '../components/icons/TargetIcon';
import { LightningBoltIcon } from '../components/icons/LightningBoltIcon';

const Profile = () => {
    const { t } = useI18n();
    const { userProfile, updateUserProfile, logWeight } = useUserData();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile>(userProfile);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        setProfile(userProfile);
    }, [userProfile]);

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

        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: type === 'checkbox' ? checked : (name === 'name' || name === 'dietaryPreference' || name === 'gender' || name === 'activityLevel' || name === 'objective' ? value : Number(value) || 0),
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);

        setTimeout(() => {
            if (profile.weight !== userProfile.weight) {
                logWeight(profile.weight);
            }
            updateUserProfile(profile);
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => {
                setSaveSuccess(false);
            }, 3000);
        }, 1000);
    };

    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <Card className="p-4 sm:p-6">
                <form onSubmit={handleSave}>
                    <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                        <UserIcon className="w-6 h-6 mr-2 text-emerald-600" />
                        Meu Perfil
                    </h2>
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

                    <div className="mt-8">
                        <button type="submit" disabled={isSaving} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:bg-emerald-300 disabled:shadow-none flex items-center justify-center">
                            {isSaving && <Spinner className="w-5 h-5 mr-3" />}
                            {isSaving ? 'Salvando...' : 'Salvar Perfil'}
                        </button>
                    </div>

                    {saveSuccess && (
                        <div className="text-center mt-4 animate-fade-in">
                            <p className="text-emerald-600 font-bold">
                                Perfil atualizado com sucesso!
                            </p>
                        </div>
                    )}
                </form>
            </Card>
        </div>
    );
};

export default Profile;



