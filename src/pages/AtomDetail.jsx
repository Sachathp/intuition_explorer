import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { atomsService } from '../services/api';
import AtomChart from '../components/AtomChart';
import './AtomDetail.css';

const AtomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [atom, setAtom] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);
  const [copiedText, setCopiedText] = useState(null);
  
  // Récupérer la période depuis le state de navigation (trendingPeriod du Dashboard)
  // ou utiliser 7d par défaut
  const initialPeriod = location.state?.from?.trendingPeriod || '7d';
  const [chartPeriod, setChartPeriod] = useState(initialPeriod);

  useEffect(() => {
    loadAtom();
  }, [id]);

  useEffect(() => {
    loadHistory();
  }, [id, chartPeriod]);

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
      const data = await atomsService.getAtomHistory(id, chartPeriod);
      setHistory(data.data);
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err);
      setHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Obtenir le libellé de la période pour l'affichage
  const getPeriodLabel = (period) => {
    const labels = {
      '1h': '1 heure',
      '4h': '4 heures',
      '24h': '24 heures',
      '1d': '24 heures',
      '7d': '7 jours',
      '1w': '7 jours'
    };
    return labels[period] || period;
  };

  const getConfidenceIndicator = (marketCap) => {
    if (marketCap > 1000) return { emoji: '🟢', label: 'Haute Confiance', cssClass: 'high' };
    if (marketCap > 100) return { emoji: '🟡', label: 'Confiance Moyenne', cssClass: 'medium' };
    return { emoji: '🔴', label: 'Faible Confiance', cssClass: 'low' };
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

  // Retour à la page Dashboard avec l'état conservé
  const handleBack = () => {
    const fromState = location.state?.from;
    
    if (fromState) {
      // Retourner au Dashboard avec l'état restauré
      navigate('/', { 
        state: { 
          restore: fromState 
        } 
      });
    } else {
      // Fallback : retour simple
      navigate('/');
    }
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
          <button onClick={handleBack} className="back-button">
            ← Retour
          </button>
        </div>
      </div>
    );
  }

  const confidence = getConfidenceIndicator(atom.market_cap || 0);

  return (
    <div className="atom-detail-page">
      <div className="detail-header">
        <button onClick={handleBack} className="back-button">
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

          <div className="detail-section atom-name-section">
            <h2 className="atom-name">{atom.description || 'Sans nom'}</h2>
            <div className="did-container">
              <span className="did-label">DID:</span>
              <code 
                className="did-code clickable" 
                onClick={() => copyToClipboard(atom.did, 'DID')}
                title="Cliquer pour copier"
              >
                {atom.did}
                {copiedText === 'DID' && <span className="copied-badge">✓ Copié</span>}
              </code>
            </div>
          </div>

          <div className="detail-grid-2">
            <div className="detail-section">
              <h3 className="subsection-title">Type</h3>
              <div className="info-value badge">{atom.type ? atom.type.split('/').pop() : 'N/A'}</div>
            </div>
            <div className="detail-section">
              <h3 className="subsection-title">Block Création</h3>
              <div className="info-value">{atom.block_number ? `#${atom.block_number}` : 'N/A'}</div>
            </div>
            <div className="detail-section">
              <h3 className="subsection-title">Créateur</h3>
              <div 
                className="info-value monospace clickable" 
                onClick={() => atom.creator_id && copyToClipboard(atom.creator_id, 'creator')}
                title={atom.creator_id ? "Cliquer pour copier" : ""}
              >
                {atom.creator_id ? `${atom.creator_id.substring(0, 10)}...` : 'N/A'}
                {copiedText === 'creator' && <span className="copied-badge-inline">✓</span>}
              </div>
            </div>
             <div className="detail-section">
              <h3 className="subsection-title">Wallet</h3>
              <div 
                className="info-value monospace clickable" 
                onClick={() => atom.wallet_id && copyToClipboard(atom.wallet_id, 'wallet')}
                title={atom.wallet_id ? "Cliquer pour copier" : ""}
              >
                {atom.wallet_id ? `${atom.wallet_id.substring(0, 10)}...` : 'N/A'}
                {copiedText === 'wallet' && <span className="copied-badge-inline">✓</span>}
              </div>
            </div>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-label">Market Cap</div>
                <div className="metric-value">
                  {parseFloat(atom.market_cap || 0).toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} TRUST
                </div>
                <div className="metric-description">
                  Capitalisation du marché
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
                  })} TRUST
                </div>
                <div className="metric-description">
                  Prix par part
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">📈</div>
              <div className="metric-content">
                <div className="metric-label">Total Shares</div>
                <div className="metric-value">
                  {parseFloat(atom.total_shares || 0).toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <div className="metric-description">
                  Nombre total de parts
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <div className="metric-label">Holders</div>
                <div className="metric-value">
                  {atom.positions_count || 0}
                </div>
                <div className="metric-description">
                  Nombre de détenteurs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Graphique de l'historique */}
        <div className="detail-card chart-section">
          <div className="chart-header">
            <h2 className="chart-title">
              📈 Évolution du Signal et du Prix ({getPeriodLabel(chartPeriod)})
            </h2>
            <div className="period-selector-buttons">
              <button
                className={`period-btn ${chartPeriod === '1h' ? 'active' : ''}`}
                onClick={() => setChartPeriod('1h')}
              >
                1h
              </button>
              <button
                className={`period-btn ${chartPeriod === '4h' ? 'active' : ''}`}
                onClick={() => setChartPeriod('4h')}
              >
                4h
              </button>
              <button
                className={`period-btn ${chartPeriod === '24h' ? 'active' : ''}`}
                onClick={() => setChartPeriod('24h')}
              >
                1j
              </button>
              <button
                className={`period-btn ${chartPeriod === '7d' ? 'active' : ''}`}
                onClick={() => setChartPeriod('7d')}
              >
                7j
              </button>
            </div>
          </div>
          
          {!loadingHistory && history.length > 0 ? (
            <AtomChart 
              data={history} 
              title=""
            />
          ) : loadingHistory ? (
            <div className="chart-loading">
              <div className="loader"></div>
              <p>Chargement des données...</p>
            </div>
          ) : (
            <div className="chart-empty">
              <p>Aucune donnée historique disponible pour cette période</p>
            </div>
          )}
        </div>

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

