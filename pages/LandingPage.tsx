import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { useI18n } from '../contexts/I18nContext';
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
    const { t, language, setLanguage } = useI18n();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [visibleSection, setVisibleSection] = useState('');
    
    // SEO: Update meta tags dynamically based on language
    useEffect(() => {
        // Update document title and meta tags for SEO
        const titles: { [key: string]: string } = {
            pt: 'NutriHealth Gen - Nutrição Inteligente com IA | Escaneie Alimentos e Transforme Sua Saúde',
            en: 'NutriHealth Gen - AI-Powered Nutrition | Scan Foods & Transform Your Health',
            es: 'NutriHealth Gen - Nutrición Inteligente con IA | Escanea Alimentos y Transforma Tu Salud',
            de: 'NutriHealth Gen - KI-gestützte Ernährung | Scannen Sie Lebensmittel und transformieren Sie Ihre Gesundheit',
            fr: 'NutriHealth Gen - Nutrition Intelligente avec IA | Scannez les Aliments et Transformez Votre Santé',
            ru: 'NutriHealth Gen - Умное питание с ИИ | Сканируйте продукты и измените свое здоровье'
        };
        
        const descriptions: { [key: string]: string } = {
            pt: 'NutriScan: Escaneie qualquer comida com sua câmera e descubra nutrientes instantaneamente. Assistente IA de nutrição 24/7. Planos alimentares personalizados. Comece grátis!',
            en: 'NutriScan: Scan any food with your camera and discover nutrients instantly. 24/7 AI nutrition assistant. Personalized meal plans. Start free!',
            es: 'NutriScan: Escanea cualquier comida con tu cámara y descubre nutrientes al instante. Asistente de nutrición IA 24/7. Planes de comidas personalizados. ¡Comienza gratis!',
            de: 'NutriScan: Scannen Sie jedes Lebensmittel mit Ihrer Kamera und entdecken Sie sofort Nährstoffe. 24/7 KI-Ernährungsassistent. Personalisierte Ernährungspläne. Kostenlos starten!',
            fr: 'NutriScan: Scannez n\'importe quel aliment avec votre caméra et découvrez les nutriments instantanément. Assistant nutrition IA 24/7. Plans de repas personnalisés. Commencez gratuitement!',
            ru: 'NutriScan: Сканируйте любую еду камерой и мгновенно узнавайте о питательных веществах. Ассистент по питанию с ИИ 24/7. Персонализированные планы питания. Начните бесплатно!'
        };
        
        document.title = titles[language] || titles.en;
        
        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.setAttribute('name', 'description');
            document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', descriptions[language] || descriptions.en);
        
        // Update Open Graph tags
        const updateOGTag = (property: string, content: string) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };
        
        updateOGTag('og:title', titles[language] || titles.en);
        updateOGTag('og:description', descriptions[language] || descriptions.en);
        updateOGTag('og:locale', language === 'pt' ? 'pt_BR' : language === 'es' ? 'es_ES' : language === 'en' ? 'en_US' : 'pt_BR');
        
        // Update canonical URL with language
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        const baseUrl = 'https://nutrihealthgen.com/';
        canonical.setAttribute('href', language === 'pt' ? baseUrl : `${baseUrl}?lang=${language}`);
    }, [language]);
    
    // Auto-detect language and currency based on browser locale and timezone
    useEffect(() => {
        const browserLang = navigator.language.toLowerCase();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Detect currency based on timezone (Brazil = BRL, rest = USD)
        const isBrazil = timezone.includes('America/Sao_Paulo') || 
                        timezone.includes('America/Fortaleza') || 
                        timezone.includes('America/Recife') ||
                        timezone.includes('America/Belem') ||
                        timezone.includes('America/Cuiaba') ||
                        timezone.includes('America/Campo_Grande') ||
                        timezone.includes('America/Manaus') ||
                        timezone.includes('America/Porto_Velho') ||
                        timezone.includes('America/Rio_Branco') ||
                        timezone.includes('America/Boa_Vista') ||
                        timezone.includes('America/Maceio') ||
                        timezone.includes('America/Aracaju') ||
                        timezone.includes('America/Natal') ||
                        timezone.includes('America/Joao_Pessoa') ||
                        timezone.includes('America/Vitoria') ||
                        timezone.includes('America/Bahia');
        
        // Detect language (default to English)
        if (browserLang.includes('pt')) {
            setLanguage('pt');
        } else if (browserLang.includes('es')) {
            setLanguage('es');
        } else if (browserLang.includes('de')) {
            setLanguage('de');
        } else if (browserLang.includes('fr')) {
            setLanguage('fr');
        } else if (browserLang.includes('ru')) {
            setLanguage('ru');
        } else {
            setLanguage('en'); // Default to English
        }
    }, [setLanguage]);
    
    // Determine currency based on timezone
    const getCurrency = (): 'BRL' | 'USD' => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const isBrazil = timezone.includes('America/Sao_Paulo') || 
                        timezone.includes('America/Fortaleza') || 
                        timezone.includes('America/Recife') ||
                        timezone.includes('America/Belem') ||
                        timezone.includes('America/Cuiaba') ||
                        timezone.includes('America/Campo_Grande') ||
                        timezone.includes('America/Manaus') ||
                        timezone.includes('America/Porto_Velho') ||
                        timezone.includes('America/Rio_Branco') ||
                        timezone.includes('America/Boa_Vista') ||
                        timezone.includes('America/Maceio') ||
                        timezone.includes('America/Aracaju') ||
                        timezone.includes('America/Natal') ||
                        timezone.includes('America/Joao_Pessoa') ||
                        timezone.includes('America/Vitoria') ||
                        timezone.includes('America/Bahia');
        return isBrazil ? 'BRL' : 'USD';
    };
    
    const currency = getCurrency();
    
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
            const sections = ['features', 'how-it-works', 'pricing'];
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

    // Structured Data for SEO (JSON-LD) - Enhanced
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "NutriHealth Gen",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web, iOS, Android",
        "offers": [
            {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": currency === 'BRL' ? 'BRL' : 'USD',
                "name": "Free Plan"
            },
            {
                "@type": "Offer",
                "price": currency === 'BRL' ? "29" : "9.99",
                "priceCurrency": currency === 'BRL' ? 'BRL' : 'USD',
                "name": "Monthly Plan",
                "billingIncrement": "P1M"
            },
            {
                "@type": "Offer",
                "price": currency === 'BRL' ? "290" : "99.99",
                "priceCurrency": currency === 'BRL' ? 'BRL' : 'USD',
                "name": "Annual Plan",
                "billingIncrement": "P1Y"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "10000",
            "bestRating": "5",
            "worstRating": "1"
        },
        "description": t('landing.heroDescription'),
        "featureList": [
            t('landing.nutriScanTitle'),
            t('landing.assistantTitle'),
            t('landing.planTitle'),
            "Lista de Compras Automática",
            "Acompanhamento de Calorias e Macros",
            "Análise de Imagens com IA",
            "Receitas Personalizadas",
            "Acompanhamento de Progresso"
        ],
        "screenshot": "https://nutrihealthgen.com/screenshot.jpg",
        "softwareVersion": "1.0.0",
        "releaseNotes": "Versão inicial com NutriScan e Assistente IA",
        "inLanguage": language === 'pt' ? 'pt-BR' : language === 'es' ? 'es-ES' : language === 'en' ? 'en-US' : 'pt-BR',
        "url": "https://nutrihealthgen.com"
    };

    const organizationData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "NutriHealth Gen",
        "url": "https://nutrihealthgen.com",
        "logo": {
            "@type": "ImageObject",
            "url": "https://nutrihealthgen.com/logo.png",
            "width": 512,
            "height": 512
        },
        "description": "Plataforma de nutrição inteligente com IA para análise de alimentos e planos alimentares personalizados",
        "foundingDate": "2024",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "contato@nutrihealthgen.com",
                "availableLanguage": ["Portuguese", "English", "Spanish"]
            },
            {
                "@type": "ContactPoint",
                "contactType": "technical support",
                "email": "suporte@nutrihealthgen.com"
            }
        ],
        "sameAs": [
            "https://www.facebook.com/nutrihealthgen",
            "https://www.instagram.com/nutrihealthgen",
            "https://twitter.com/nutrihealthgen"
        ],
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "BR"
        }
    };
    
    // Breadcrumb structured data
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://nutrihealthgen.com/"
            }
        ]
    };

    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": t('landing.faq1Q'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('landing.faq1A')
                }
            },
            {
                "@type": "Question",
                "name": t('landing.faq2Q'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('landing.faq2A')
                }
            },
            {
                "@type": "Question",
                "name": t('landing.faq3Q'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('landing.faq3A')
                }
            },
            {
                "@type": "Question",
                "name": t('landing.faq4Q'),
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": t('landing.faq4A')
                }
            }
        ]
    };

    return (
        <>
            {/* Structured Data for SEO */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(organizationData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(faqData)}
            </script>
            <script type="application/ld+json">
                {JSON.stringify(breadcrumbData)}
            </script>
            
            <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden" itemScope itemType="https://schema.org/WebPage">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/98 backdrop-blur-xl shadow-md border-b border-gray-200/50 py-3' : 'bg-white/95 backdrop-blur-xl py-4'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative">
                                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                                    <span className="text-white text-xl font-bold">N</span>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-gray-900">NutriHealth Gen</span>
                        </Link>
                        
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            <a 
                                href="#features" 
                                onClick={(e) => handleSmoothScroll(e, 'features')}
                                className={`font-medium text-sm transition-all duration-200 relative py-2 ${
                                    visibleSection === 'features' 
                                        ? 'text-emerald-600 font-semibold' 
                                        : scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                                }`}
                            >
                                {t('landing.navFeatures')}
                                {visibleSection === 'features' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
                                )}
                            </a>
                            <a 
                                href="#how-it-works" 
                                onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                                className={`font-medium text-sm transition-all duration-200 relative py-2 ${
                                    visibleSection === 'how-it-works' 
                                        ? 'text-emerald-600 font-semibold' 
                                        : scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                                }`}
                            >
                                {t('landing.navHowItWorks')}
                                {visibleSection === 'how-it-works' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
                                )}
                            </a>
                            <a 
                                href="#pricing" 
                                onClick={(e) => handleSmoothScroll(e, 'pricing')}
                                className={`font-medium text-sm transition-all duration-200 relative py-2 ${
                                    visibleSection === 'pricing' 
                                        ? 'text-emerald-600 font-semibold' 
                                        : scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-gray-800 hover:text-emerald-600'
                                }`}
                            >
                                {t('landing.navPricing')}
                                {visibleSection === 'pricing' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"></span>
                                )}
                            </a>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Link 
                                to="/login" 
                                className="hidden sm:block font-medium text-sm text-gray-700 hover:text-emerald-600 transition-colors px-3 py-2"
                            >
                                {t('landing.navLogin')}
                            </Link>
                            <Link
                                to="/login"
                                className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                {t('landing.ctaStart')}
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
                                    {t('landing.navFeatures')}
                                </a>
                                <a 
                                    href="#how-it-works" 
                                    onClick={(e) => handleSmoothScroll(e, 'how-it-works')}
                                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    {t('landing.navHowItWorks')}
                                </a>
                                <a 
                                    href="#pricing" 
                                    onClick={(e) => handleSmoothScroll(e, 'pricing')}
                                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    {t('landing.navPricing')}
                                </a>
                                <Link 
                                    to="/login" 
                                    className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
                                >
                                    {t('landing.navLogin')}
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-white">
                {/* Subtle background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 -right-20 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 -left-20 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 border border-emerald-200/50 text-emerald-700 font-medium text-sm mb-8">
                            <SparklesIcon className="w-4 h-4" />
                            <span>{t('landing.newAI')}</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            {t('landing.heroTitle')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                                {t('landing.heroTitleHighlight')}
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                            {t('landing.heroDescription')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link
                                to="/login"
                                className="group w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                            >
                                {t('landing.ctaStart')}
                                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#features"
                                onClick={(e) => handleSmoothScroll(e, 'features')}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold text-lg hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                {t('landing.ctaFeatures')}
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            {/* Social Proof Strip */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">+10.000</div>
                            <div className="text-gray-600">{t('landing.statsUsers')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">4.9/5</div>
                            <div className="text-gray-600">{t('landing.statsRating')}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900 mb-2">100%</div>
                            <div className="text-gray-600">{t('landing.statsSecure')}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-gradient-to-b from-white via-gray-50/30 to-white" itemScope itemType="https://schema.org/ItemList">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {t('landing.featuresTitle')} <span className="text-emerald-600">{t('landing.featuresTitleHighlight')}</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t('landing.featuresSubtitle')}
                        </p>
                    </div>

                    {/* Star Features - NutriScan and Assistant */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16 relative">
                        {/* Decorative background elements */}
                        <div className="absolute inset-0 -z-10">
                            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl"></div>
                            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
                        </div>
                        
                        {/* NutriScan - Star Feature */}
                        <div className="relative bg-gradient-to-br from-emerald-100 via-emerald-50 to-emerald-100/50 p-10 rounded-3xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 border-2 border-emerald-200/50 group hover:border-emerald-400 hover:-translate-y-1 overflow-hidden">
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            <div className="relative z-10">
                                <div className="h-20 w-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-emerald-500/30">
                                    <CameraIcon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.nutriScanTitle')}</h3>
                                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                    {t('landing.nutriScanDesc')}
                                </p>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="font-medium">{t('landing.nutriScanFeature1')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="font-medium">{t('landing.nutriScanFeature2')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="font-medium">{t('landing.nutriScanFeature3')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="font-medium">{t('landing.nutriScanFeature4')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Assistant - Star Feature */}
                        <div className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-blue-100/50 p-10 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 border-2 border-blue-200/50 group hover:border-blue-400 hover:-translate-y-1 overflow-hidden">
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            
                            <div className="relative z-10">
                                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-blue-500/30">
                                    <ChatBubbleIcon className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.assistantTitle')}</h3>
                                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                    {t('landing.assistantDesc')}
                                </p>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium">{t('landing.assistantFeature1')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium">{t('landing.assistantFeature2')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium">{t('landing.assistantFeature3')}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                            <CheckIcon className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="font-medium">{t('landing.assistantFeature4')}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Other Features */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-100">
                            <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <SparklesIcon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{t('landing.planTitle')}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {t('landing.planDesc')}
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-100">
                            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Compras Inteligentes</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Transforme seu plano semanal em uma lista de compras organizada automaticamente. Exporte para PDF ou WhatsApp.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-gray-50 p-6 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 border border-gray-100">
                            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <ChartBarIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Métricas Avançadas</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Acompanhe calorias, macros, água, sono e humor. Visualize seu progresso com gráficos detalhados.
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
                                {t('landing.howItWorksTitle')} <br />
                                <span className="text-emerald-600">{t('landing.howItWorksTitleHighlight')}</span>
                            </h2>
                            <p className="text-lg text-gray-500 mb-10">
                                {t('landing.howItWorksSubtitle')}
                            </p>

                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">1</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('landing.step1Title')}</h4>
                                        <p className="text-gray-500">{t('landing.step1Desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">2</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('landing.step2Title')}</h4>
                                        <p className="text-gray-500">{t('landing.step2Desc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">3</div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 mb-2">{t('landing.step3Title')}</h4>
                                        <p className="text-gray-500">{t('landing.step3Desc')}</p>
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
                        <h2 className="text-3xl font-bold text-gray-900">{t('landing.testimonialsTitle')}</h2>
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
                            <span>{t('landing.pricingBadge')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                            {t('landing.pricingTitle')}
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                            {t('landing.pricingSubtitle')}
                        </p>
                        
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-6 max-w-6xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('landing.planFree')}</h3>
                                    <p className="text-gray-600 text-sm">{t('landing.planFreeDesc')}</p>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-extrabold text-gray-900">{pricing[currency].symbol} 0</span>
                                        <span className="text-gray-500 ml-2">/mês</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">{t('landing.planFreePrice')}</p>
                                </div>
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-3 px-6 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition-colors mb-6"
                                >
                                    {t('landing.navStartFree')}
                                </Link>
                                <ul className="space-y-4">
                                    {t('landing.planFreeFeatures').split(', ').map((feature, i) => (
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
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">{t('landing.mostPopular')}</span>
                            </div>
                            <div className="relative">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{t('landing.planMonthly')}</h3>
                                    <p className="text-emerald-50 text-sm">{t('landing.planMonthlyDesc')}</p>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-extrabold text-white">{pricing[currency].symbol} {pricing[currency].monthly}</span>
                                        <span className="text-emerald-100 ml-2">/mês</span>
                                    </div>
                                    <p className="text-sm text-emerald-100 mt-2">{t('landing.planMonthlyPrice')}</p>
                                </div>
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-3 px-6 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-xl mb-6"
                                >
                                    {t('landing.planMonthly')}
                                </Link>
                                <ul className="space-y-4">
                                    {t('landing.planPaidFeatures').split(', ').map((feature, i) => (
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
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('landing.planAnnual')}</h3>
                                    <p className="text-gray-600 text-sm">{t('landing.planAnnualDesc')}</p>
                                </div>
                                <div className="mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-5xl font-extrabold text-gray-900">{pricing[currency].symbol} {pricing[currency].annual}</span>
                                        <span className="text-gray-500 ml-2">/ano</span>
                                    </div>
                                    <p className="text-sm text-emerald-600 font-semibold mt-2">
                                        {t('landing.planAnnualPrice', { percent: Math.round((1 - (pricing[currency].annual / (pricing[currency].monthly * 12))) * 100) })}
                                    </p>
                                </div>
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-3 px-6 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors mb-6"
                                >
                                    {t('landing.planAnnual')}
                                </Link>
                                <ul className="space-y-4">
                                    {[
                                        ...t('landing.planPaidFeatures').split(', '),
                                        t('landing.planAnnualExtra')
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
                            <span className="text-gray-700 font-medium">{t('landing.guarantee')}</span>
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
                        {t('landing.ctaFinalTitle')}
                    </h2>
                    <p className="text-emerald-100 text-xl mb-10 max-w-2xl mx-auto">
                        {t('landing.ctaFinalDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login"
                            className="group w-full sm:w-auto px-10 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                        >
                            {t('landing.ctaFinalButton')}
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-emerald-200 text-sm mt-4 sm:mt-0 flex items-center gap-2">
                            <CheckIcon className="w-4 h-4" />
                            {t('landing.ctaFinalNoCard')}
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                            {t('landing.faqTitle')}
                        </h2>
                        <p className="text-lg text-gray-500">
                            {t('landing.faqSubtitle')}
                        </p>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            {
                                q: t('landing.faq1Q'),
                                a: t('landing.faq1A')
                            },
                            {
                                q: t('landing.faq2Q'),
                                a: t('landing.faq2A')
                            },
                            {
                                q: t('landing.faq3Q'),
                                a: t('landing.faq3A')
                            },
                            {
                                q: t('landing.faq4Q'),
                                a: t('landing.faq4A')
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
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800" itemScope itemType="https://schema.org/WPFooter">
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
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link></li>
                                <li><Link to="/terms" className="hover:text-white transition-colors">Termos</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contato</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                            <div>© {new Date().getFullYear()} NutriHealth Gen. Todos os direitos reservados.</div>
                        </div>
                    </div>
                </div>
            </footer>
            </div>
        </>
    );
};

export default LandingPage;
