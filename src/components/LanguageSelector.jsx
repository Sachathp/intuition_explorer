import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${i18n.language === 'fr' ? 'active' : ''}`}
        onClick={() => changeLanguage('fr')}
        title="Français"
      >
        FR
      </button>
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        title="English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
