
import React, { createContext, useState, useContext, useCallback } from 'react';
import translations from '../translations';

type Language = 'pt' | 'en' | 'es' | 'de' | 'fr' | 'ru';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const getNestedTranslation = (language: Language, key: string): string | undefined => {
    const keys = key.split('.');
    let result: any = translations[language];
    for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
            return undefined;
        }
    }
    return result as string;
}

export const I18nProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = getNestedTranslation(language, key) || key;
    
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
    }

    return translation;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
