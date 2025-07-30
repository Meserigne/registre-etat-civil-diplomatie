import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Récupérer la langue sauvegardée ou utiliser français par défaut
    return localStorage.getItem('appLanguage') || 'fr';
  });

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('appLanguage', newLanguage);
  };

  useEffect(() => {
    // Sauvegarder la langue à chaque changement
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const value = {
    language,
    changeLanguage,
    isEnglish: language === 'en',
    isFrench: language === 'fr'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
