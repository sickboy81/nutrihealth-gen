
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { useAuth } from '../contexts/AuthContext';
import { CogIcon } from './icons/CogIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { assistantName } = useUserData();
    const { logout } = useAuth();

    const getTitle = () => {
        switch (location.pathname) {
            case '/':
                return t('header.dashboard');
            case '/nutriscan':
                return t('header.nutriscan');
            case '/recipes':
                return t('header.recipes');
            case '/health-plan':
                return t('header.healthPlan');
            case '/settings':
                return t('header.settings');
            case '/chat':
                return t('header.chat', { name: assistantName });
            default:
                return t('header.default');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isSettingsPage = location.pathname === '/settings';

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

                <div className="flex items-center justify-end flex-1 gap-2">
                    {!isSettingsPage && (
                        <Link to="/settings" className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                            <CogIcon className="w-6 h-6" />
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Sair"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
