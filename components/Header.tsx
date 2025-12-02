
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { useAuth } from '../contexts/AuthContext';
import { CogIcon } from './icons/CogIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { UserIcon } from './icons/UserIcon';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { assistantName } = useUserData();
    const { logout, user, isAdmin } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const getTitle = () => {
        switch (location.pathname) {
            case '/dashboard':
                return t('header.dashboard');
            case '/nutriscan':
                return t('header.nutriscan');
            case '/recipes':
                return t('header.recipes');
            case '/health-plan':
                return t('header.healthPlan');
            case '/settings':
                return 'Configurações';
            case '/profile':
                return 'Perfil';
            case '/about':
                return 'Sobre';
            case '/admin':
                return 'Admin';
            case '/chat':
                return t('header.chat', { name: assistantName });
            default:
                return t('header.default');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setMenuOpen(false);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const isSettingsPage = location.pathname === '/settings' || location.pathname === '/profile' || location.pathname === '/about' || location.pathname === '/admin';

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100 z-40 h-16">
            <div className="max-w-4xl mx-auto flex items-center justify-between h-full px-4">
                <div className="flex items-center flex-1">
                    {isSettingsPage && (
                        <button onClick={() => navigate(-1)} className="mr-2 p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>

                <div className="flex-1 text-center">
                    <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">{getTitle()}</h1>
                </div>

                <div className="flex items-center justify-end flex-1 gap-2 relative">
                    {!isSettingsPage && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                aria-label="Menu"
                            >
                                <CogIcon className="w-6 h-6" />
                            </button>
                            
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden backdrop-blur-xl bg-white/95 animate-fadeIn">
                                    <div className="px-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-200 group"
                                        >
                                            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                <UserIcon className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-gray-900 block">Perfil</span>
                                                <span className="text-xs text-gray-500">Editar informações pessoais</span>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-200 group"
                                        >
                                            <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                                                <CogIcon className="w-5 h-5 text-emerald-600" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-gray-900 block">Configurações</span>
                                                <span className="text-xs text-gray-500">Preferências e metas</span>
                                            </div>
                                        </Link>
                                        <Link
                                            to="/about"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all duration-200 group"
                                        >
                                            <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                                <span className="text-lg">ℹ️</span>
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-gray-900 block">Sobre</span>
                                                <span className="text-xs text-gray-500">Informações do app</span>
                                            </div>
                                        </Link>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 rounded-xl transition-all duration-200 group"
                                            >
                                                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                                    <span className="text-lg">🛡️</span>
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-semibold text-gray-900 block">Admin</span>
                                                    <span className="text-xs text-gray-500">Painel administrativo</span>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-100 my-2"></div>
                                    <div className="px-2">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-200 text-left group"
                                        >
                                            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                                <span className="text-lg">🚪</span>
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-semibold text-red-600 block">Sair</span>
                                                <span className="text-xs text-red-400">Fazer logout da conta</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
