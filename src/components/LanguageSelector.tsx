import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'pt', name: 'PT', flag: '🇧🇷' },
    { code: 'en', name: 'EN', flag: '🇺🇸' },
    { code: 'de', name: 'DE', flag: '🇩🇪' },
  ];

  return (
    <div className="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code as 'pt' | 'en' | 'de')}
          className={`language-btn ${
            language === lang.code ? 'active' : ''
          }`}
          title={`Switch to ${lang.name}`}
        >
          <span className="flag">{lang.flag}</span>
          <span className="code">{lang.name}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
