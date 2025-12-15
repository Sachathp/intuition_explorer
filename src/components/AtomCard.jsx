import React from 'react';
import { Link } from 'react-router-dom';
import './AtomCard.css';

const AtomCard = ({ atom, showFullDescription = false, showGrowth = false }) => {
  // Calculer l'indicateur de confiance basé sur le market cap
  const getConfidenceIndicator = (marketCap) => {
    if (marketCap > 1000) return { emoji: '🟢', label: 'Haute', cssClass: 'high' };
    if (marketCap > 100) return { emoji: '🟡', label: 'Moyenne', cssClass: 'medium' };
    return { emoji: '🔴', label: 'Faible', cssClass: 'low' };
  };

  const confidence = getConfidenceIndicator(atom.market_cap || 0);
  
  // Tronquer la description si nécessaire
  const description = showFullDescription 
    ? atom.description 
    : atom.description?.length > 100 
      ? `${atom.description.substring(0, 100)}...` 
      : atom.description;
  
  // Formater le pourcentage de croissance
  const formatGrowth = (growth) => {
    if (!growth) return '0.00';
    const num = parseFloat(growth);
    return num >= 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
  };

  // Formater le type (ex: 'Person' au lieu de 'http://schema.org/Person')
  const formatType = (type) => {
    if (!type) return 'Inconnu';
    const parts = type.split('/');
    return parts[parts.length - 1] || type;
  };

  return (
    <div className="atom-card">
      <div className="atom-card-header-row">
        <div className={`atom-card-confidence ${confidence.cssClass}`}>
          <span className="confidence-emoji">{confidence.emoji}</span>
          <span className="confidence-label">{confidence.label}</span>
        </div>
        {atom.type && (
          <div className="atom-type-badge">
            {formatType(atom.type)}
          </div>
        )}
      </div>

      <div className="atom-card-main">
        {atom.image ? (
          <div className="atom-image-container">
            <img src={atom.image} alt="Atom" className="atom-image" />
          </div>
        ) : (
          <div className="atom-icon-placeholder">
            {atom.emoji || '⚛️'}
          </div>
        )}
        
        <div className="atom-info">
          <div className="atom-did-container">
            <span className="did-prefix">DID:</span>
            <code className="did-value">{atom.did?.substring(0, 12)}...</code>
          </div>
          <p className="atom-description">
            {description || 'Aucune description disponible'}
          </p>
        </div>
      </div>

      <div className="atom-metrics-grid">
        <div className="atom-metric">
          <span className="metric-label">Market Cap</span>
          <span className="metric-value">
            {parseFloat(atom.market_cap || 0).toLocaleString('fr-FR', {
              maximumFractionDigits: 2
            })} TRUST
          </span>
        </div>
        
        <div className="atom-metric">
          <span className="metric-label">Prix / Share</span>
          <span className="metric-value">
            {parseFloat(atom.share_price).toLocaleString('fr-FR', {
              maximumFractionDigits: 2
            })} TRUST
          </span>
        </div>

        {showGrowth && atom.growth_percentage !== undefined && (
          <div className="atom-metric">
            <span className="metric-label">Croissance</span>
            <span className={`metric-value growth-value ${atom.growth_direction}`}>
              {atom.growth_direction === 'up' ? '↗' : atom.growth_direction === 'down' ? '↘' : '→'} 
              {formatGrowth(atom.growth_percentage)}%
            </span>
          </div>
        )}

        <div className="atom-metric">
          <span className="metric-label">Positions</span>
          <span className="metric-value">
            {atom.positions_count || 0}
          </span>
        </div>
      </div>

      <div className="atom-card-footer">
        <Link to={`/atom/${atom.id}`} className="atom-card-link">
          Voir les détails →
        </Link>
      </div>
    </div>
  );
};

export default AtomCard;

