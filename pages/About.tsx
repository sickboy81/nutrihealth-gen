import React from 'react';
import Card from '../components/Card';
import { SparklesIcon } from '../components/icons/SparklesIcon';

const About = () => {
    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
            <Card className="p-4 sm:p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                    <span className="text-2xl mr-3">ℹ️</span>
                    Sobre o App
                </h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">NutriHealth Gen</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                            Nutrição inteligente para um novo você. Transforme sua saúde com IA.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            O NutriHealth Gen combina inteligência artificial avançada com conhecimento nutricional para criar uma experiência única que se adapta às necessidades individuais de cada usuário.
                        </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Funcionalidades Principais</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-1">•</span>
                                <span><strong>NutriScan:</strong> Escaneie qualquer comida ou produto e descubra os nutrientes instantaneamente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-1">•</span>
                                <span><strong>Assistente IA:</strong> Sua nutricionista pessoal 24/7 para tirar dúvidas e receber orientações</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-1">•</span>
                                <span><strong>Planos Personalizados:</strong> Planos alimentares adaptados aos seus objetivos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 mt-1">•</span>
                                <span><strong>Acompanhamento Completo:</strong> Calorias, macros, micronutrientes e muito mais</span>
                            </li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tecnologia</h3>
                        <p className="text-gray-600 leading-relaxed mb-2">
                            Utilizamos modelos de IA de última geração para análise de imagens e processamento de linguagem natural. Toda nossa plataforma foi desenvolvida com foco em privacidade, segurança e experiência do usuário.
                        </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Versão do App</h3>
                                <p className="text-sm text-gray-500">Versão atual instalada</p>
                            </div>
                            <div className="px-4 py-2 bg-emerald-100 rounded-full border border-emerald-200">
                                <span className="text-emerald-700 font-bold font-mono">v1.0.0</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-500 text-center">
                            © {new Date().getFullYear()} NutriHealth Gen. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default About;



