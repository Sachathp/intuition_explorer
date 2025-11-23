import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear }) => {
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
          placeholder="Rechercher des atoms par description ou DID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {query && (
          <button 
            type="button" 
            onClick={handleClear}
            className="clear-button"
            aria-label="Effacer"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="search-button">
        Rechercher
      </button>
    </form>
  );
};

export default SearchBar;


