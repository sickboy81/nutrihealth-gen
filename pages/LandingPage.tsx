import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { ChartBarIcon } from '../components/icons/ChartBarIcon';
import { ShoppingCartIcon } from '../components/icons/ShoppingCartIcon';
import { LightningBoltIcon } from '../components/icons/LightningBoltIcon';
import { UserIcon } from '../components/icons/UserIcon';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">
                            🥗
                        </div>
                        <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-gray-900'}`}>NutriHealth Gen</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Funcionalidades</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Como Funciona</a>
                        <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Depoimentos</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium hidden sm:block">
                            Entrar
                        </Link>
                        <Link
                            to="/login"
                            className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
                        >
                            Começar Grátis
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-20 right-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium text-sm mb-8 animate-fadeIn">
                        <SparklesIcon className="w-4 h-4" />
                        <span>Nova IA Nutricionista 2.0</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
                        Nutrição Inteligente <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            Para Um Novo Você
                        </span>
                    </h1>

                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
                        Abandone as dietas genéricas. Receba planos alimentares personalizados por IA, listas de compras automáticas e acompanhamento em tempo real.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-lg hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-xl shadow-emerald-200 flex items-center justify-center gap-2"
                        >
                            Criar meu Plano Grátis
                            <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                        <a
                            href="#features"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors hover:shadow-md"
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
            <section className="py-10 bg-white border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-xl font-bold text-gray-400 flex items-center gap-2"><UserIcon className="w-6 h-6" /> +10.000 Usuários</span>
                        <span className="text-xl font-bold text-gray-400 flex items-center gap-2">⭐ 4.9/5 Avaliação</span>
                        <span className="text-xl font-bold text-gray-400 flex items-center gap-2">🔒 Dados Seguros</span>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                            Tudo que você precisa para <br />
                            <span className="text-emerald-600">atingir sua melhor versão</span>
                        </h2>
                        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                            Combinamos ciência nutricional com tecnologia de ponta para simplificar sua vida saudável.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="h-14 w-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                                <SparklesIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">IA Nutricionista</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Planos alimentares que se adaptam aos seus gostos, restrições e objetivos. Como ter um nutri no bolso 24h.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="h-14 w-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <ShoppingCartIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Compras Inteligentes</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Transforme seu plano semanal em uma lista de compras organizada automaticamente. Exporte para PDF ou WhatsApp.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="h-14 w-14 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                                <ChartBarIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Métricas Avançadas</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Acompanhe calorias, macros, água, sono e humor. Visualize seu progresso com gráficos detalhados e bonitos.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                                <LightningBoltIcon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Gamificação</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Transforme saúde em jogo. Ganhe XP, suba de nível e desbloqueie conquistas ao manter hábitos saudáveis.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="h-14 w-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Modo Offline (PWA)</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Instale como um aplicativo no seu celular. Acesse seu plano e lista de compras mesmo sem internet.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                            <div className="h-14 w-14 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">💬</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Chat Assistente</h3>
                            <p className="text-gray-500 leading-relaxed">
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
                            { name: "Ana Silva", role: "Perdeu 8kg em 2 meses", text: "O NutriHealth mudou minha relação com a comida. As receitas são incríveis e a lista de compras me economiza horas." },
                            { name: "Carlos Mendes", role: "Ganhou 5kg de massa", text: "Finalmente um app que entende que quero ganhar massa sem comer só frango com batata doce. A IA é surpreendente." },
                            { name: "Mariana Costa", role: "Vegetariana", text: "Amei a opção de personalizar para dieta vegetariana. Nunca foi tão fácil bater minha meta de proteínas." }
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
                            className="w-full sm:w-auto px-10 py-4 bg-white text-emerald-900 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors shadow-lg"
                        >
                            Começar Agora - É Grátis
                        </Link>
                        <p className="text-emerald-200 text-sm mt-4 sm:mt-0">
                            Sem cartão de crédito necessário
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-xl">🥗</div>
                            <span className="text-xl font-bold text-white">NutriHealth Gen</span>
                        </div>
                        <div className="flex gap-8 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Sobre</a>
                            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                            <a href="#" className="hover:text-white transition-colors">Termos</a>
                            <a href="#" className="hover:text-white transition-colors">Contato</a>
                        </div>
                        <div className="text-sm text-gray-600">
                            © {new Date().getFullYear()} NutriHealth Gen.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
