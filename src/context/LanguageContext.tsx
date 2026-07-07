import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { translations, Language, TranslationKey } from '../translations';

interface LanguageContextType {
  language: Language;
  t: TranslationKey;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine language based on the URL path
  const getLanguageFromPath = (pathname: string): Language => {
    return pathname.startsWith('/fr') ? 'fr' : 'en';
  };

  const [language, setLanguageState] = useState<Language>(() => getLanguageFromPath(location.pathname));

  // Keep language state in sync with URL changes (back button, direct links, etc.)
  useEffect(() => {
    const targetLang = getLanguageFromPath(location.pathname);
    if (targetLang !== language) {
      setLanguageState(targetLang);
    }
  }, [location.pathname, language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const isFrench = location.pathname.startsWith('/fr');
    if (lang === 'fr' && !isFrench) {
      navigate('/fr' + (location.pathname === '/' ? '' : location.pathname));
    } else if (lang === 'en' && isFrench) {
      navigate(location.pathname.substring(3) || '/');
    }
  };

  const toggleLanguage = () => {
    const isFrench = location.pathname.startsWith('/fr');
    if (isFrench) {
      navigate(location.pathname.substring(3) || '/');
    } else {
      navigate('/fr' + (location.pathname === '/' ? '' : location.pathname));
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
