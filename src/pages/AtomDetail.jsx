import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { atomsService } from '../services/api';
import AtomChart from '../components/AtomChart';
import './AtomDetail.css';

const AtomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [atom, setAtom] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAtom();
    loadHistory();
  }, [id]);

  const loadAtom = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await atomsService.getAtom(id);
      setAtom(data.atom);
    } catch (err) {
      setError('Erreur lors du chargement de l\'atom');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await atomsService.getAtomHistory(id, 7);
      setHistory(data.data);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const getConfidenceIndicator = (signalValue) => {
    if (signalValue > 1000) return { emoji: '🟢', label: 'Haute Confiance', cssClass: 'high' };
    if (signalValue > 100) return { emoji: '🟡', label: 'Confiance Moyenne', cssClass: 'medium' };
    return { emoji: '🔴', label: 'Faible Confiance', cssClass: 'low' };
  };

  if (loading) {
    return (
      <div className="atom-detail-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !atom) {
    return (
      <div className="atom-detail-page">
        <div className="error-container">
          <p className="error-message">⚠️ {error || 'Atom non trouvé'}</p>
          <button onClick={() => navigate('/')} className="back-button">
            ← Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  const confidence = getConfidenceIndicator(atom.current_signal_value);

  return (
    <div className="atom-detail-page">
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Retour
        </button>
        <h1 className="page-title">Détails de l'Atom</h1>
      </div>

      <div className="detail-container">
        <div className="detail-card main-info">
          <div className="card-header">
            <div className={`confidence-badge ${confidence.cssClass}`}>
              <span className="confidence-emoji">{confidence.emoji}</span>
              <span className="confidence-text">
                {confidence.label}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h2 className="section-title">Description</h2>
            <p className="atom-description">
              {atom.description || 'Aucune description disponible'}
            </p>
          </div>

          <div className="detail-section">
            <h2 className="section-title">Identifiant (DID)</h2>
            <code className="did-code">{atom.did}</code>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-label">Signal Value</div>
                <div className="metric-value">
                  {parseFloat(atom.current_signal_value).toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <div className="metric-description">
                  Confiance économique via dépôts $trust
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <div className="metric-label">Share Price</div>
                <div className="metric-value">
                  {parseFloat(atom.share_price).toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <div className="metric-description">
                  Prix des parts de cet Atom
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique de l'historique */}
        {!loadingHistory && history.length > 0 && (
          <AtomChart 
            data={history} 
            title="📈 Évolution du Signal et du Prix (7 derniers jours)"
          />
        )}

        {atom.triples && atom.triples.length > 0 && (
          <div className="detail-card triples-section">
            <h2 className="section-title">Relations (Triples)</h2>
            <p className="section-description">
              Structure Sujet-Prédicat-Objet des connaissances liées
            </p>
            
            <div className="triples-list">
              {atom.triples.map((triple, index) => (
                <div key={index} className="triple-card">
                  <div className="triple-part">
                    <div className="triple-label">Sujet</div>
                    <div className="triple-content">
                      <code className="triple-id">{triple.subject?.id?.substring(0, 12)}...</code>
                      <div className="triple-description">
                        {triple.subject?.description || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="triple-arrow">→</div>

                  <div className="triple-part">
                    <div className="triple-label">Prédicat</div>
                    <div className="triple-content">
                      <code className="triple-id">{triple.predicate?.id?.substring(0, 12)}...</code>
                      <div className="triple-description">
                        {triple.predicate?.description || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div className="triple-arrow">→</div>

                  <div className="triple-part">
                    <div className="triple-label">Objet</div>
                    <div className="triple-content">
                      <code className="triple-id">{triple.object?.id?.substring(0, 12)}...</code>
                      <div className="triple-description">
                        {triple.object?.description || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="detail-card info-section">
          <h2 className="section-title">À propos de la confiance</h2>
          <div className="info-content">
            <p>
              Le <strong>Signal Value</strong> représente la confiance économique dans cet Atom, 
              basée sur les dépôts de tokens $trust effectués par la communauté.
            </p>
            <p>
              Plus le Signal est élevé, plus l'Atom est considéré comme fiable et canonique 
              au sein de l'écosystème Intuition.
            </p>
            <div className="confidence-scale">
              <div className="scale-item">
                <span className="scale-emoji">🟢</span>
                <span>Signal {'>'} 1000</span>
              </div>
              <div className="scale-item">
                <span className="scale-emoji">🟡</span>
                <span>100 {'<'} Signal {'<'} 1000</span>
              </div>
              <div className="scale-item">
                <span className="scale-emoji">🔴</span>
                <span>Signal {'<'} 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtomDetail;

