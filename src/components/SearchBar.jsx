import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {query && (
          <button 
            type="button" 
            onClick={handleClear}
            className="clear-button"
            aria-label={t('search.clear')}
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-button">
        {t('search.button')}
      </button>
    </form>
  );
};

export default SearchBar;


