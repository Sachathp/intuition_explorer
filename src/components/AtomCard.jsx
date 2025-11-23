import React from 'react';
import { Link } from 'react-router-dom';
import './AtomCard.css';

const AtomCard = ({ atom, showFullDescription = false, showGrowth = false }) => {
  // Calculer l'indicateur de confiance basé sur le signal
  const getConfidenceIndicator = (signalValue) => {
    if (signalValue > 1000) return { emoji: '🟢', label: 'Haute', cssClass: 'high' };
    if (signalValue > 100) return { emoji: '🟡', label: 'Moyenne', cssClass: 'medium' };
    return { emoji: '🔴', label: 'Faible', cssClass: 'low' };
  };

  const confidence = getConfidenceIndicator(atom.current_signal_value);
  
  // Tronquer la description si nécessaire
  const description = showFullDescription 
    ? atom.description 
    : atom.description?.length > 150 
      ? `${atom.description.substring(0, 150)}...` 
      : atom.description;
  
  // Formater le pourcentage de croissance
  const formatGrowth = (growth) => {
    if (!growth) return '0.00';
    const num = parseFloat(growth);
    return num >= 0 ? `+${num.toFixed(2)}` : num.toFixed(2);
  };

  return (
    <div className="atom-card">
      <div className="atom-card-header">
        <div className={`atom-card-confidence ${confidence.cssClass}`}>
          <span className="confidence-emoji">{confidence.emoji}</span>
          <span className="confidence-label">
            {confidence.label}
          </span>
        </div>
        <div className="atom-card-did">
          <span className="did-label">DID</span>
          <code className="did-value">{atom.did?.substring(0, 10)}...</code>
        </div>
      </div>

      <div className="atom-card-body">
        <p className="atom-description">{description || 'Aucune description disponible'}</p>
      </div>

      <div className="atom-card-footer">
        {showGrowth && atom.growth_percentage !== undefined ? (
          <div className="atom-metric growth-metric">
            <span className="metric-label">Croissance</span>
            <span className={`metric-value growth-value ${atom.growth_direction}`}>
              {atom.growth_direction === 'up' ? '↗' : atom.growth_direction === 'down' ? '↘' : '→'} 
              {formatGrowth(atom.growth_percentage)}%
            </span>
          </div>
        ) : null}
        
        <div className="atom-metric">
          <span className="metric-label">Signal</span>
          <span className="metric-value">
            {parseFloat(atom.current_signal_value).toLocaleString('fr-FR', {
              maximumFractionDigits: 2
            })}
          </span>
        </div>
        
        <div className="atom-metric">
          <span className="metric-label">Prix</span>
          <span className="metric-value">
            {parseFloat(atom.share_price).toLocaleString('fr-FR', {
              maximumFractionDigits: 2
            })}
          </span>
        </div>

        <Link to={`/atom/${atom.id}`} className="atom-card-link">
          Détails →
        </Link>
      </div>
    </div>
  );
};

export default AtomCard;

