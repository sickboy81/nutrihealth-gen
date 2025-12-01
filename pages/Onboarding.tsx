import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../contexts/UserDataContext';
import Card from '../components/Card';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';

const Onboarding = () => {
    const navigate = useNavigate();
    const { updateProfile, updateGoals } = useUserData();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        // Step 1: Basic
        gender: 'male',
        age: 30,
        // Step 2: Measurements
        weight: 70,
        height: 170,
        // Step 3: Goals
        goal: 'lose_weight',
        activityLevel: 'moderate'
    });

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            handleFinish();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSkip = () => {
        // Skip onboarding and go to dashboard
        navigate('/dashboard');
    };

    const handleFinish = () => {
        // Save data to context
        updateProfile({
            gender: formData.gender as 'male' | 'female',
            age: Number(formData.age),
            weight: Number(formData.weight),
            height: Number(formData.height)
        });

        updateGoals({
            primaryGoal: formData.goal,
            activityLevel: formData.activityLevel
        });

        // Redirect to dashboard after completing onboarding
        navigate('/dashboard');
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg p-8 shadow-xl relative">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gray-100 rounded-t-xl overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                {/* Header */}
                <div className="flex justify-between items-center mb-8 mt-2">
                    <button
                        onClick={handleBack}
                        className={`p-2 rounded-full hover:bg-gray-100 text-gray-500 ${step === 1 ? 'invisible' : ''}`}
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-500">
                        Passo {step} de {totalSteps}
                    </span>
                    <button
                        onClick={handleSkip}
                        className="text-sm font-medium text-gray-400 hover:text-gray-600"
                    >
                        Pular
                    </button>
                </div>

                {/* Step Content */}
                <div className="min-h-[300px]">
                    {step === 1 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Vamos nos conhecer!</h2>
                                <p className="text-gray-500 mt-2">Para criar o plano perfeito, precisamos saber um pouco sobre você.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gênero</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => updateField('gender', 'male')}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.gender === 'male' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-200'}`}
                                        >
                                            <span className="text-2xl block mb-1">👨</span>
                                            Masculino
                                        </button>
                                        <button
                                            onClick={() => updateField('gender', 'female')}
                                            className={`p-4 rounded-xl border-2 transition-all ${formData.gender === 'female' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-emerald-200'}`}
                                        >
                                            <span className="text-2xl block mb-1">👩</span>
                                            Feminino
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => updateField('age', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Suas Medidas</h2>
                                <p className="text-gray-500 mt-2">Isso nos ajuda a calcular suas necessidades calóricas.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.weight}
                                            onChange={(e) => updateField('weight', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pl-12"
                                        />
                                        <span className="absolute left-4 top-3.5 text-xl">⚖️</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={formData.height}
                                            onChange={(e) => updateField('height', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all pl-12"
                                        />
                                        <span className="absolute left-4 top-3.5 text-xl">📏</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">Seus Objetivos</h2>
                                <p className="text-gray-500 mt-2">Onde você quer chegar com o NutriHealth?</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo Principal</label>
                                    <select
                                        value={formData.goal}
                                        onChange={(e) => updateField('goal', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                                    >
                                        <option value="lose_weight">Perder Peso</option>
                                        <option value="maintain">Manter Peso</option>
                                        <option value="gain_muscle">Ganhar Massa Muscular</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Atividade</label>
                                    <select
                                        value={formData.activityLevel}
                                        onChange={(e) => updateField('activityLevel', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                                    >
                                        <option value="sedentary">Sedentário (Pouco ou nenhum exercício)</option>
                                        <option value="light">Leve (Exercício 1-3 dias/semana)</option>
                                        <option value="moderate">Moderado (Exercício 3-5 dias/semana)</option>
                                        <option value="active">Ativo (Exercício 6-7 dias/semana)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={handleNext}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                    >
                        {step === totalSteps ? 'Finalizar e Começar!' : 'Próximo'}
                        {step !== totalSteps && <ArrowRightIcon className="w-5 h-5" />}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Onboarding;
