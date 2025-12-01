
import React, { useState, useRef, useEffect } from 'react';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { CameraIcon } from '../components/icons/CameraIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { analyzeMeal } from '../services/geminiService';
import type { MealAnalysis } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { BarcodeIcon } from '../components/icons/BarcodeIcon';

const NutriScan = () => {
  const { t, language } = useI18n();
  const { logMeal } = useUserData();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mealLogged, setMealLogged] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
      setMealLogged(false);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    setMealLogged(false);
    try {
      const result = await analyzeMeal(imageFile, language);
      setAnalysis(result);
    } catch (err) {
      setError(t('nutriscan.analysisError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogMeal = () => {
    if (analysis) {
        logMeal(analysis);
        setMealLogged(true);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <p className="text-center text-gray-500">
        {t('nutriscan.description')}
      </p>
      <Card className="p-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        {!previewUrl ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl h-60 flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 hover:border-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
            onClick={triggerFileSelect}
          >
            <div className="flex space-x-2 mb-2">
                <CameraIcon className="w-12 h-12 text-gray-400" />
                <BarcodeIcon className="w-12 h-12 text-gray-400" />
            </div>
            <span className="font-bold text-gray-600">{t('nutriscan.uploadPrompt')}</span>
            <span className="text-sm">{t('nutriscan.uploadHint')}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img src={previewUrl} alt="Prévia da refeição" className="rounded-lg max-h-64 w-auto object-cover shadow-lg shadow-gray-300/20" />
            <div className="flex space-x-4 mt-6">
                <button
                    onClick={triggerFileSelect}
                    className="py-2 px-5 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-colors"
                >
                    {t('nutriscan.changePhoto')}
                </button>
                <button
                    onClick={handleAnalyzeClick}
                    disabled={isLoading}
                    className="py-2 px-5 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20 disabled:bg-emerald-300 disabled:shadow-none flex items-center"
                >
                    {isLoading ? <Spinner className="w-5 h-5 mr-2"/> : null}
                    {isLoading ? t('nutriscan.analyzing') : t('nutriscan.analyze')}
                </button>
            </div>
          </div>
        )}
      </Card>

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {analysis && (
        <div className="mt-2 animate-fade-in">
          <h2 className="text-2xl font-bold text-center mb-4">{t('nutriscan.analysisResults')}</h2>
          <Card className="p-4 space-y-5">
            
            {/* Calories & Serving Size */}
            <div className="text-center bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-md text-emerald-800 font-medium">{t('nutriscan.totalCalories')}</p>
              <p className="text-5xl font-extrabold text-emerald-600">{analysis.calories} <span className="text-2xl font-semibold">kcal</span></p>
              {analysis.servingSize && (
                  <p className="text-sm font-medium text-emerald-700 mt-2 bg-emerald-100/50 py-1 px-3 rounded-full inline-block">
                      {t('nutriscan.servingSize')}: {analysis.servingSize}
                  </p>
              )}
            </div>
            
            {/* Macros */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-sky-50 p-2 rounded-lg border border-sky-100">
                <p className="font-bold text-xl text-sky-600">{analysis.macros.protein}g</p>
                <p className="text-xs text-gray-500 font-medium">{t('nutriscan.protein')}</p>
              </div>
              <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
                <p className="font-bold text-xl text-orange-600">{analysis.macros.carbs}g</p>
                <p className="text-xs text-gray-500 font-medium">{t('nutriscan.carbs')}</p>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-100">
                <p className="font-bold text-xl text-amber-600">{analysis.macros.fat}g</p>
                <p className="text-xs text-gray-500 font-medium">{t('nutriscan.fats')}</p>
              </div>
            </div>

            {/* Micros */}
            {analysis.micros && (
                <div className="pt-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2">{t('dashboard.micros.title')}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                        <div className="p-1 bg-yellow-50 rounded border border-yellow-100">
                            <p className="text-xs font-bold text-yellow-700">{analysis.micros.vitaminC}mg</p>
                            <p className="text-[10px] text-gray-500">Vit C</p>
                        </div>
                        <div className="p-1 bg-yellow-50 rounded border border-yellow-100">
                             <p className="text-xs font-bold text-yellow-700">{analysis.micros.vitaminD}IU</p>
                             <p className="text-[10px] text-gray-500">Vit D</p>
                        </div>
                        <div className="p-1 bg-red-50 rounded border border-red-100">
                             <p className="text-xs font-bold text-red-700">{analysis.micros.iron}mg</p>
                             <p className="text-[10px] text-gray-500">Iron</p>
                        </div>
                         <div className="p-1 bg-slate-50 rounded border border-slate-200">
                             <p className="text-xs font-bold text-slate-700">{analysis.micros.calcium}mg</p>
                             <p className="text-[10px] text-gray-500">Ca</p>
                        </div>
                         <div className="p-1 bg-indigo-50 rounded border border-indigo-100">
                             <p className="text-xs font-bold text-indigo-700">{analysis.micros.magnesium}mg</p>
                             <p className="text-[10px] text-gray-500">Mg</p>
                        </div>
                        <div className="p-1 bg-orange-50 rounded border border-orange-100">
                             <p className="text-xs font-bold text-orange-700">{analysis.micros.vitaminA}mcg</p>
                             <p className="text-[10px] text-gray-500">Vit A</p>
                        </div>
                        <div className="p-1 bg-rose-50 rounded border border-rose-100">
                             <p className="text-xs font-bold text-rose-700">{analysis.micros.vitaminB12}mcg</p>
                             <p className="text-[10px] text-gray-500">Vit B12</p>
                        </div>
                        <div className="p-1 bg-blue-50 rounded border border-blue-100">
                             <p className="text-xs font-bold text-blue-700">{analysis.micros.potassium}mg</p>
                             <p className="text-[10px] text-gray-500">Potas</p>
                        </div>
                        <div className="p-1 bg-gray-50 rounded border border-gray-200">
                             <p className="text-xs font-bold text-gray-700">{analysis.micros.sodium}mg</p>
                             <p className="text-[10px] text-gray-500">Sod</p>
                        </div>
                        <div className="p-1 bg-teal-50 rounded border border-teal-100">
                             <p className="text-xs font-bold text-teal-700">{analysis.micros.zinc}mg</p>
                             <p className="text-[10px] text-gray-500">Zinc</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Foods List */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{t('nutriscan.identifiedFoods')}</h3>
              <ul className="space-y-2">
                {analysis.identifiedFoods.map((food, index) => (
                  <li key={index} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-lg">
                    <CheckIcon className="w-4 h-4 mr-3 text-emerald-500" />
                    <span className="text-sm font-medium">{food}</span>
                  </li>
                ))}
              </ul>
            </div>
             <div className="border-t border-gray-200 pt-4">
                <button
                    onClick={handleLogMeal}
                    disabled={mealLogged}
                    className="w-full py-3 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 transition-all shadow-lg shadow-sky-500/20 disabled:bg-sky-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {mealLogged ? (
                        <>
                            <CheckIcon className="w-5 h-5 mr-2" />
                            {t('nutriscan.addedToLog')}
                        </>
                    ) : (
                        <>
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            {t('nutriscan.addToLog')}
                        </>
                    )}
                </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default NutriScan;