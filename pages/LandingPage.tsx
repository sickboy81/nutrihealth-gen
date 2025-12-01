import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { ChartBarIcon } from '../components/icons/ChartBarIcon';
import { ShoppingCartIcon } from '../components/icons/ShoppingCartIcon';
import { LightningBoltIcon } from '../components/icons/LightningBoltIcon';
import { UserIcon } from '../components/icons/UserIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { BarcodeIcon } from '../components/icons/BarcodeIcon';
import { CameraIcon } from '../components/icons/CameraIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';

const LandingPage = () => {
    const { user } = useAuth();
    const { userProfile } = useUserData();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [visibleSection, setVisibleSection] = useState('');
    const [currency, setCurrency] = useState<'BRL' | 'USD'>('BRL');
    
    // Detect currency based on location
    useEffect(() => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone.includes('America/Sao_Paulo') || navigator.language.includes('pt-BR')) {
            setCurrency('BRL');
        } else {
            setCurrency('USD');
        }
    }, []);
    
    const pricing = {
        BRL: {
            monthly: 29,
            annual: 290,
            symbol: 'R$'
        },
        USD: {
            monthly: 9.99,
            annual: 99.99,
            symbol: '$'
        }
    };

    // Redirect logged-in users to dashboard
    useEffect(() => {
        if (user) {
            const hasCompletedOnboarding = userProfile && 
                userProfile.age > 0 && 
                userProfile.height > 0 && 
                userProfile.weight > 0;
            
            if (hasCompletedOnboarding) {
                navigate('/dashboard');
            } else {
                navigate('/onboarding');
            }
        }
    }, [user, userProfile, navigate]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            
            // Detect visible section for active nav
            const sections = ['features', 'how-it-works', 'pricing', 'testimonials'];
            const scrollPos = window.scrollY + 200;
            
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                        setVisibleSection(section);
                        break;
                    }
                }
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll handler
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setMobileMenuOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                                🥗
                            </div>
                            <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>NutriHealth Gen</span>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <a 
                                href="#features" 
                                onClick={(e) => handleSmoothScroll(e, 'features')}
                                className={`font-medium transition-colors relative ${
                                    visibleSection === 'features' 
                                        ? 'text-emerald-600' 
                                        : scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                                }`}
                            >
                                Funcionalidades
                                {visibleSection === 'features' && (
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"></span>
                                )}
                            </a>
                            <a 
                                href="#how-it-works" 
                                onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                                className={`font-medium transition-colors relative ${
                                    visibleSection === 'how-it-works' 
                                        ? 'text-emerald-600' 
                                        : scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                                }`}
                            >
                                Como Funciona
                                {visibleSection === 'how-it-works' && (
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"></span>
                                )}
                            </a>
                            <a 
                                href="#pricing" 
                                onClick={(e) => handleSmoothScroll(e, 'pricing')}
                                className={`font-medium transition-colors relative ${
                                    visibleSection === 'pricing' 
                                        ? 'text-emerald-600' 
                                        : scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                                }`}
                            >
                                Preços
                                {visibleSection === 'pricing' && (
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"></span>
                                )}
                            </a>
                            <a 
                                href="#testimonials" 
                                onClick={(e) => handleSmoothScroll(e, 'testimonials')}
                                className={`font-medium transition-colors relative ${
                                    visibleSection === 'testimonials' 
                                        ? 'text-emerald-600' 
                                        : scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                                }`}
                            >
                                Depoimentos
                                {visibleSection === 'testimonials' && (
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600"></span>
                                )}
                            </a>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/login" 
                                className={`font-medium hidden sm:block transition-colors ${
                                    scrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white/90 hover:text-white'
                                }`}
                            >
                                Entrar
                            </Link>
                            <Link
                                to="/login"
                                className="bg-emerald-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg shadow-emerald-200/50"
                            >
                                Começar Grátis
                            </Link>
                            
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                                aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
                            <div className="flex flex-col gap-4 pt-4">
                                <a 
                                    href="#features" 
                                    onClick={(e) => handleSmoothScroll(e, 'features')}
                                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    Funcionalidades
                                </a>
                                <a 
                                    href="#how-it-works" 
                                    onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    Como Funciona
                                </a>
                                <a 
                                    href="#pricing" 
                                    onClick={(e) => handleSmoothScroll(e, 'pricing')}
                                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    Preços
                                </a>
                                <a 
                                    href="#testimonials" 
                                    onClick={(e) => handleSmoothScroll(e, 'testimonials')}
                                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    Depoimentos
                                </a>
                                <Link 
                                    to="/login" 
                                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    Entrar
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                {/* Premium gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent"></div>
                {/* Premium mesh gradient */}
                <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-emerald-100/20 via-transparent to-teal-100/20"></div>
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium text-sm mb-8 animate-fadeIn shadow-sm">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Nova IA Nutricionista 2.0</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight animate-fadeIn">
                        Escaneie, Analise e <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 animate-gradient">
                            Transforme sua Nutrição
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed animate-fadeIn">
                        <strong>NutriScan:</strong> Escaneie qualquer comida ou produto com sua câmera e descubra os nutrientes instantaneamente. <strong>Assistente IA:</strong> Sua nutricionista pessoal 24/7 para tirar dúvidas e receber orientações personalizadas.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fadeIn">
                        <Link
                            to="/login"
                            className="group w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-xl shadow-emerald-200/50 flex items-center justify-center gap-2"
                        >
                            Criar meu Plano Grátis
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a
                            href="#features"
                            onClick={(e) => handleSmoothScroll(e, 'features')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-emerald-300 transition-all hover:shadow-lg"
                        >
                            Ver Funcionalidades
                        </a>
                    </div>

                    {/* App Preview Mockup */}
                    <div className="relative mx-auto max-w-5xl">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-20"></div>
                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                {/* Mockup Screen 1: Dashboard */}
                                <div className="p-6 bg-gray-50">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-2 w-20 bg-gray-200 rounded"></div>
                                        <div className="h-8 w-8 bg-emerald-100 rounded-full"></div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-24 bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                                            <div className="h-2 w-16 bg-emerald-100 rounded mb-2"></div>
                                            <div className="h-8 w-full bg-emerald-50 rounded"></div>
                                        </div>
                                        <div className="h-24 bg-white rounded-xl shadow-sm p-3 border border-gray-100">
                                            <div className="h-2 w-16 bg-blue-100 rounded mb-2"></div>
                                            <div className="h-8 w-full bg-blue-50 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Mockup Screen 2: Plan (Active) */}
                                <div className="p-6 bg-white relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                                    <div className="text-center mb-6">
                                        <div className="h-4 w-32 bg-gray-900 rounded mx-auto mb-2"></div>
                                        <div className="h-3 w-24 bg-gray-400 rounded mx-auto"></div>
                                    </div>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                <div className="h-10 w-10 rounded-lg bg-gray-200"></div>
                                                <div className="flex-1">
                                                    <div className="h-3 w-24 bg-gray-800 rounded mb-1"></div>
                                                    <div className="h-2 w-16 bg-gray-400 rounded"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Mockup Screen 3: Stats */}
                                <div className="p-6 bg-gray-50">
                                    <div className="h-4 w-24 bg-gray-800 rounded mb-6"></div>
                                    <div className="flex items-end gap-2 h-32 mb-4">
                                        <div className="w-full bg-emerald-200 rounded-t h-[40%]"></div>
                                        <div className="w-full bg-emerald-300 rounded-t h-[60%]"></div>
                                        <div className="w-full bg-emerald-500 rounded-t h-[80%]"></div>
                                        <div className="w-full bg-emerald-400 rounded-t h-[50%]"></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Seg</span>
                                        <span>Ter</span>
                                        <span>Qua</span>
                                        <span>Qui</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Strip */}
            <section className="py-12 bg-gradient-to-r from-emerald-50 to-teal-50 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                <UserIcon className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">+10.000</div>
                            <div className="text-sm text-gray-600 font-medium">Usuários Ativos</div>
                        </div>
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">⭐</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">4.9/5</div>
                            <div className="text-sm text-gray-600 font-medium">Avaliação Média</div>
                        </div>
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                <span className="text-3xl">🔒</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">100%</div>
                            <div className="text-sm text-gray-600 font-medium">Dados Seguros</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                            Nossas Funcionalidades <span className="text-emerald-600">Estrela</span>
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Tecnologia de ponta para transformar sua relação com a nutrição.
                        </p>
                    </div>

                    {/* Star Features - NutriScan and Assistant */}
                    <div className="grid md:grid-cols-2 gap-8 mb-12 relative z-10">
                        {/* NutriScan - Star Feature */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-emerald-200 group hover:border-emerald-400 hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-bold mb-4">
                                    <SparklesIcon className="w-3 h-3" />
                                    ESTRELA
                                </div>
                                <div className="h-16 w-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-300/50">
                                    <CameraIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">NutriScan</h3>
                                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                    <strong>Escaneie qualquer comida ou produto</strong> com sua câmera e descubra instantaneamente calorias, macros, micronutrientes e muito mais. Funciona com pratos prontos, embalagens, códigos de barras e até rótulos nutricionais.
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <span>Análise instantânea por IA</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <span>Detecta macros e micronutrientes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <span>Lê rótulos nutricionais</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <span>Adiciona automaticamente ao diário</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Assistant - Star Feature */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 group hover:border-blue-400 hover:-translate-y-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold mb-4">
                                    <SparklesIcon className="w-3 h-3" />
                                    ESTRELA
                                </div>
                                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-300/50">
                                    <ChatBubbleIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Assistente de Nutrição IA</h3>
                                <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                    <strong>Sua nutricionista pessoal 24/7</strong> sempre disponível. Tire dúvidas sobre nutrição, peça receitas personalizadas, receba dicas de saúde e orientações baseadas no seu perfil e objetivos.
                                </p>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span>Conversa natural e inteligente</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span>Receitas personalizadas</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span>Orientações baseadas no seu perfil</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        <span>Disponível a qualquer hora</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Other Features */}
                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {/* Feature 1 */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 group hover:border-emerald-200 hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-200/50">
                                <SparklesIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Planos Personalizados</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Planos alimentares que se adaptam aos seus gostos, restrições e objetivos. Como ter um nutri no bolso 24h.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 group hover:border-blue-200 hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200/50">
                                <ShoppingCartIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Compras Inteligentes</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Transforme seu plano semanal em uma lista de compras organizada automaticamente. Exporte para PDF ou WhatsApp.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 group hover:border-purple-200 hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-200/50">
                                <ChartBarIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Métricas Avançadas</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Acompanhe calorias, macros, água, sono e humor. Visualize seu progresso com gráficos detalhados e bonitos.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 group hover:border-orange-200 hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-200/50">
                                <LightningBoltIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Gamificação</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Transforme saúde em jogo. Ganhe XP, suba de nível e desbloqueie conquistas ao manter hábitos saudáveis.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 group hover:border-pink-200 hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-200/50">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Modo Offline (PWA)</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Instale como um aplicativo no seu celular. Acesse seu plano e lista de compras mesmo sem internet.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 group hover:border-teal-200 hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-teal-200/50">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Chat Assistente</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tire dúvidas sobre nutrição, peça receitas alternativas ou dicas de saúde com nossa IA especializada.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works - Steps */}
            <section id="how-it-works" className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                                Sua jornada simplificada em <br />
                                <span className="text-emerald-600">3 passos simples</span>
                            </h2>
                            <p className="text-lg text-gray-500 mb-10">
                                Não complicamos o que deve ser simples. Comece hoje mesmo e veja resultados em poucas semanas.
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">1</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">Crie seu Perfil</h4>
                                        <p className="text-gray-500">Informe seus dados, restrições alimentares e objetivos (perder peso, ganhar massa, etc).</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">2</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">Receba seu Plano</h4>
                                        <p className="text-gray-500">Nossa IA gera instantaneamente um cardápio semanal completo e delicioso para você.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">3</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">Acompanhe e Evolua</h4>
                                        <p className="text-gray-500">Registre suas refeições, acompanhe seu progresso e ajuste o plano conforme necessário.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-3xl transform rotate-3 blur-lg opacity-50"></div>
                            <div className="relative bg-gray-900 rounded-3xl p-8 shadow-2xl text-white">
                                {/* Abstract UI representation */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-2">
                                        <div className="h-3 w-20 bg-gray-700 rounded"></div>
                                        <div className="h-6 w-32 bg-white rounded"></div>
                                    </div>
                                    <div className="h-10 w-10 bg-emerald-500 rounded-full"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gray-700 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 w-24 bg-white rounded mb-2"></div>
                                            <div className="h-3 w-full bg-gray-600 rounded"></div>
                                        </div>
                                        <div className="h-6 w-6 rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                            <div className="h-3 w-3 bg-emerald-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 flex items-center gap-4 opacity-50">
                                        <div className="h-12 w-12 bg-gray-700 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 w-24 bg-white rounded mb-2"></div>
                                            <div className="h-3 w-full bg-gray-600 rounded"></div>
                                        </div>
                                        <div className="h-6 w-6 rounded-full border-2 border-gray-600"></div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-gray-700">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-gray-400 text-sm mb-1">Calorias Hoje</div>
                                            <div className="text-3xl font-bold text-emerald-400">1,850 <span className="text-sm text-gray-500 font-normal">/ 2,200</span></div>
                                        </div>
                                        <div className="h-16 w-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">O que dizem nossos usuários</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: "Ana Silva", role: "Perdeu 8kg em 2 meses", text: "O NutriScan mudou minha vida! Agora só preciso fotografar minha comida e já sei exatamente o que estou comendo. A assistente IA responde todas minhas dúvidas na hora." },
                            { name: "Carlos Mendes", role: "Ganhou 5kg de massa", text: "A combinação de NutriScan + Assistente IA é incrível. Escaneio produtos no supermercado e a assistente me ajuda a escolher as melhores opções para ganhar massa." },
                            { name: "Mariana Costa", role: "Vegetariana", text: "Adoro usar o NutriScan para verificar se estou batendo minhas proteínas. A assistente sempre tem receitas vegetarianas deliciosas quando preciso de ideias." }
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                                </div>
                                <p className="text-gray-600 mb-6">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">{t.name}</div>
                                        <div className="text-xs text-emerald-600 font-medium">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium text-sm mb-6">
                            <SparklesIcon className="w-4 h-4" />
                            <span>Planos e Preços</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            Escolha o plano ideal para você
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                            Comece grátis e atualize quando quiser. Sem compromisso, cancele a qualquer momento.
                        </p>
                        
                        {/* Currency Selector */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
                            <button
                                onClick={() => setCurrency('BRL')}
                                className={`px-4 py-1 rounded-full font-medium text-sm transition-all ${
                                    currency === 'BRL' 
                                        ? 'bg-emerald-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                BRL (R$)
                            </button>
                            <button
                                onClick={() => setCurrency('USD')}
                                className={`px-4 py-1 rounded-full font-medium text-sm transition-all ${
                                    currency === 'USD' 
                                        ? 'bg-emerald-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                USD ($)
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-6 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuito</h3>
                                    <p className="text-gray-600 text-sm">Perfeito para começar</p>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-extrabold text-gray-900">{pricing[currency].symbol} 0</span>
                                        <span className="text-gray-500 ml-2">/mês</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">Para sempre grátis</p>
                                </div>
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-3 px-6 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors mb-6"
                                >
                                    Começar Grátis
                                </Link>
                                <ul className="space-y-4">
                                    {[
                                        'NutriScan (5 análises/dia)',
                                        'Assistente IA (10 mensagens/dia)',
                                        'Plano alimentar personalizado',
                                        'Lista de compras automática',
                                        'Acompanhamento básico de calorias',
                                        'Gráficos de progresso',
                                        'Modo offline (PWA)'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Monthly Plan - Featured */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 border-2 border-emerald-500 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 relative overflow-hidden transform scale-105 md:scale-110 z-10 group">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform"></div>
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">MAIS POPULAR</span>
                            </div>
                            <div className="relative">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">Mensal</h3>
                                    <p className="text-emerald-50 text-sm">Acesso completo mensal</p>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-extrabold text-white">{pricing[currency].symbol} {pricing[currency].monthly}</span>
                                        <span className="text-emerald-100 ml-2">/mês</span>
                                    </div>
                                    <p className="text-sm text-emerald-100 mt-2">Cobrado mensalmente</p>
                                </div>
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-3 px-6 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-xl mb-6"
                                >
                                    Assinar Mensal
                                </Link>
                                <ul className="space-y-4">
                                    {[
                                        'Tudo do plano Gratuito',
                                        'NutriScan ilimitado',
                                        'Assistente IA ilimitada',
                                        'Análise avançada de nutrientes',
                                        'Exportação PDF/WhatsApp',
                                        'Suporte prioritário',
                                        'Sem anúncios',
                                        'Histórico ilimitado'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckIcon className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                                            <span className="text-white text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Annual Plan */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-100 rounded-full -ml-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Anual</h3>
                                    <p className="text-gray-600 text-sm">Melhor economia</p>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-extrabold text-gray-900">{pricing[currency].symbol} {pricing[currency].annual}</span>
                                        <span className="text-gray-500 ml-2">/ano</span>
                                    </div>
                                    <p className="text-sm text-emerald-600 font-semibold mt-2">
                                        Economize {Math.round((1 - (pricing[currency].annual / (pricing[currency].monthly * 12))) * 100)}% vs mensal
                                    </p>
                                </div>
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-3 px-6 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors mb-6"
                                >
                                    Assinar Anual
                                </Link>
                                <ul className="space-y-4">
                                    {[
                                        'Tudo do plano Mensal',
                                        'NutriScan ilimitado',
                                        'Assistente IA ilimitada',
                                        'Análise avançada de nutrientes',
                                        'Exportação PDF/WhatsApp',
                                        'Suporte prioritário',
                                        'Sem anúncios',
                                        'Histórico ilimitado',
                                        '2 meses grátis'
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckIcon className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-600 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Money back guarantee */}
                    <div className="mt-12 text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 rounded-full border border-emerald-100">
                            <CheckIcon className="w-5 h-5 text-emerald-600" />
                            <span className="text-gray-700 font-medium">Garantia de 30 dias ou seu dinheiro de volta</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-900 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 to-teal-900 z-0"></div>
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Comece sua transformação hoje
                    </h2>
                    <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
                        Junte-se a milhares de pessoas que já estão vivendo uma vida mais saudável e feliz com o NutriHealth Gen.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="group w-full sm:w-auto px-10 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                        >
                            Começar Agora - É Grátis
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-emerald-200 text-sm mt-4 sm:mt-0 flex items-center gap-2">
                            <CheckIcon className="w-4 h-4" />
                            Sem cartão de crédito necessário
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                            Perguntas Frequentes
                        </h2>
                        <p className="text-lg text-gray-500">
                            Tire suas dúvidas sobre o NutriHealth Gen
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            {
                                q: "O app é realmente gratuito?",
                                a: "Sim! O plano básico é totalmente gratuito e inclui geração de planos alimentares, lista de compras e acompanhamento básico. Funcionalidades premium estão disponíveis para quem quiser mais recursos."
                            },
                            {
                                q: "Como funciona a IA Nutricionista?",
                                a: "Nossa IA analisa seu perfil, objetivos, restrições alimentares e preferências para criar um plano alimentar personalizado. Ela aprende com suas escolhas e ajusta o plano conforme você evolui."
                            },
                            {
                                q: "Posso usar offline?",
                                a: "Sim! O NutriHealth Gen é um PWA (Progressive Web App) que pode ser instalado no seu celular e funciona offline. Seus planos e listas ficam disponíveis mesmo sem internet."
                            },
                            {
                                q: "Meus dados estão seguros?",
                                a: "Absolutamente. Utilizamos criptografia de ponta a ponta e seguimos as melhores práticas de segurança. Seus dados nunca são compartilhados com terceiros."
                            }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                                <summary className="font-bold text-gray-900 text-lg flex items-center justify-between list-none">
                                    <span>{faq.q}</span>
                                    <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
                                </summary>
                                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-xl">🥗</div>
                                <span className="text-xl font-bold text-white">NutriHealth Gen</span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Nutrição inteligente para um novo você. Transforme sua saúde com IA.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Produto</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')} className="hover:text-white transition-colors">Funcionalidades</a></li>
                                <li><a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, 'how-it-works')} className="hover:text-white transition-colors">Como Funciona</a></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Começar Grátis</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Empresa</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
                        © {new Date().getFullYear()} NutriHealth Gen. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
