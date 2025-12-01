
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import { CameraIcon } from './icons/CameraIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

const BottomNav = () => {
  const { t } = useI18n();
  const { assistantName } = useUserData();
  
  const navItems = [
    { path: '/', label: t('nav.dashboard'), icon: ChartBarIcon },
    { path: '/nutriscan', label: t('nav.nutriscan'), icon: CameraIcon },
    { path: '/health-plan', label: t('nav.plan'), icon: CalendarIcon },
    { path: '/recipes', label: t('nav.recipes'), icon: BookOpenIcon },
    { path: '/chat', label: t('nav.chat', { name: assistantName }), icon: ChatBubbleIcon },
  ];

  const activeLinkClass = 'text-emerald-600';
  const inactiveLinkClass = 'text-gray-400 hover:text-emerald-600';

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-200 z-50">
      <div className="flex justify-around max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className="w-full"
          >
            {({ isActive }) => (
              <div
                className={`relative flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 ${isActive ? activeLinkClass : inactiveLinkClass}`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-[10px] sm:text-[11px] font-semibold mt-1 truncate px-1">{label}</span>
                {isActive && <div className="absolute bottom-1 h-[3px] w-3 bg-emerald-500 rounded-full"></div>}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
