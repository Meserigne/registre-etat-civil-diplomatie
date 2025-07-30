import { useLanguage } from '../contexts/LanguageContext';
import { fr } from '../translations/fr';
import { en } from '../translations/en';

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const translations = {
    fr,
    en
  };

  const t = (key) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback to French if translation not found
        translation = translations.fr;
        for (const fallbackKey of keys) {
          if (translation && translation[fallbackKey]) {
            translation = translation[fallbackKey];
          } else {
            return key; // Return the key if no translation found
          }
        }
        break;
      }
    }
    
    return translation || key;
  };

  return { t };
};

export default useTranslation;
