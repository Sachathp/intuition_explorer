import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AtomCard.css';

const AtomCard = ({ 
  atom, 
  showFullDescription = false, 
  showGrowth = false,
  dashboardState = {} 
}) => {
  const [copiedText, setCopiedText] = useState(null);

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

  // Copier dans le presse-papier
  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  // Extraire le nom de l'atome depuis la description
  const getAtomName = () => {
    if (atom.label) return atom.label;
    if (atom.description) {
      // Prendre les premiers mots (max 50 caractères)
      const name = atom.description.substring(0, 50);
      return name.length < atom.description.length ? `${name}...` : name;
    }
    return 'Sans nom';
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
          <h3 className="atom-card-title">{getAtomName()}</h3>
          <div 
            className="atom-did-container clickable-did" 
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard(atom.did, `did-${atom.id}`);
            }}
            title="Cliquer pour copier le DID"
          >
            <span className="did-prefix">DID:</span>
            <code className="did-value">{atom.did?.substring(0, 12)}...</code>
            {copiedText === `did-${atom.id}` && <span className="copied-indicator">✓</span>}
          </div>
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
          <span className="metric-label">Holders</span>
          <span className="metric-value">
            {atom.positions_count || 0}
          </span>
        </div>
      </div>

      <div className="atom-card-footer">
        <Link 
          to={`/atom/${atom.id}`} 
          state={{ from: dashboardState }}
          className="atom-card-link"
        >
          Voir les détails →
        </Link>
      </div>
    </div>
  );
};

export default AtomCard;

