import React, { useState } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ 
  onFilterChange, 
  onLimitChange, 
  onPeriodChange,
  currentLimit = 10,
  currentPeriod = '7d',
  isTrendingMode = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'market_cap', // market_cap, share_price, positions_count, created_at
    sortOrder: 'desc', // desc, asc
    minMarketCap: '',
    maxMarketCap: '',
    minSharePrice: '',
    maxSharePrice: '',
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLimitChange = (value) => {
    onLimitChange(parseInt(value));
  };

  const handlePeriodChange = (value) => {
    if (onPeriodChange) {
      onPeriodChange(value);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      sortBy: 'market_cap',
      sortOrder: 'desc',
      minMarketCap: '',
      maxMarketCap: '',
      minSharePrice: '',
      maxSharePrice: '',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = () => {
    return filters.minMarketCap || filters.maxMarketCap || 
           filters.minSharePrice || filters.maxSharePrice ||
           filters.sortBy !== 'market_cap' || filters.sortOrder !== 'desc';
  };

  return (
    <div className="filter-panel-container">
      <div className="filter-header">
        <div className="filter-controls">
          {/* Sélecteur de période (uniquement en mode Trending) */}
          {isTrendingMode && (
            <div className="period-selector-filter">
              <label htmlFor="period-select">Période :</label>
              <select
                id="period-select"
                value={currentPeriod}
                onChange={(e) => handlePeriodChange(e.target.value)}
                className="period-select"
              >
                <option value="1h">1 heure</option>
                <option value="4h">4 heures</option>
                <option value="24h">1 jour</option>
                <option value="7d">1 semaine</option>
              </select>
            </div>
          )}

          {/* Sélecteur de nombre d'atoms */}
          <div className="limit-selector">
            <label htmlFor="limit-select">Afficher :</label>
            <select
              id="limit-select"
              value={currentLimit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="limit-select"
            >
              <option value="10">10 atoms</option>
              <option value="25">25 atoms</option>
              <option value="50">50 atoms</option>
              <option value="100">100 atoms</option>
              <option value="200">200 atoms</option>
            </select>
          </div>

          {/* Bouton pour ouvrir/fermer les filtres (masqué en mode Trending) */}
          {!isTrendingMode && (
            <button
              className={`filter-toggle-btn ${isOpen ? 'active' : ''} ${hasActiveFilters() ? 'has-filters' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="filter-icon">🎛️</span>
              <span>Filtres</span>
              {hasActiveFilters() && <span className="filter-badge">●</span>}
              <span className={`arrow ${isOpen ? 'open' : ''}`}>▼</span>
            </button>
          )}
        </div>
      </div>

      {/* Panneau de filtres extensible (masqué en mode Trending) */}
      {isOpen && !isTrendingMode && (
        <div className="filter-panel">
          <div className="filter-section">
            <h3 className="filter-section-title">Tri</h3>
            <div className="filter-row">
              <div className="filter-group">
                <label>Trier par :</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="filter-select"
                >
                  <option value="market_cap">Market Cap</option>
                  <option value="share_price">Prix / Share</option>
                  <option value="positions_count">Nombre de Positions</option>
                  <option value="created_at">Date de création</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Ordre :</label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="filter-select"
                >
                  <option value="desc">Décroissant</option>
                  <option value="asc">Croissant</option>
                </select>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-section-title">Market Cap (TRUST)</h3>
            <div className="filter-row">
              <div className="filter-group">
                <label>Minimum :</label>
                <input
                  type="number"
                  value={filters.minMarketCap}
                  onChange={(e) => handleFilterChange('minMarketCap', e.target.value)}
                  placeholder="Ex: 100"
                  className="filter-input"
                  min="0"
                />
              </div>

              <div className="filter-group">
                <label>Maximum :</label>
                <input
                  type="number"
                  value={filters.maxMarketCap}
                  onChange={(e) => handleFilterChange('maxMarketCap', e.target.value)}
                  placeholder="Ex: 10000"
                  className="filter-input"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-section-title">Prix / Share (TRUST)</h3>
            <div className="filter-row">
              <div className="filter-group">
                <label>Minimum :</label>
                <input
                  type="number"
                  value={filters.minSharePrice}
                  onChange={(e) => handleFilterChange('minSharePrice', e.target.value)}
                  placeholder="Ex: 1"
                  className="filter-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="filter-group">
                <label>Maximum :</label>
                <input
                  type="number"
                  value={filters.maxSharePrice}
                  onChange={(e) => handleFilterChange('maxSharePrice', e.target.value)}
                  placeholder="Ex: 100"
                  className="filter-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <button
              onClick={resetFilters}
              className="reset-filters-btn"
              disabled={!hasActiveFilters()}
            >
              <span>🔄</span>
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;



