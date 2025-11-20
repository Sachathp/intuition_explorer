import React from 'react';
import { Link } from 'react-router-dom';
import './AtomCard.css';

const AtomCard = ({ atom, showFullDescription = false }) => {
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

