import React, { useState, useEffect } from 'react';
import { atomsService } from '../services/api';
import AtomCard from '../components/AtomCard';
import SearchBar from '../components/SearchBar';
import './Dashboard.css';

const Dashboard = () => {
  const [atoms, setAtoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [activeTab, setActiveTab] = useState('top'); // 'top' ou 'trending'
  const [trendingPeriod, setTrendingPeriod] = useState('24h'); // '24h' ou '7d'

  useEffect(() => {
    loadAtoms();
  }, [activeTab, trendingPeriod]);

  const loadAtoms = async () => {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === 'trending') {
        const data = await atomsService.getTrending(trendingPeriod, 10);
        setAtoms(data.trending);
      } else {
        const data = await atomsService.getAtoms(10);
        setAtoms(data.atoms);
      }
    } catch (err) {
      setError('Erreur lors du chargement des atoms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      
      // Synchronisation incrémentale (nouveaux atoms uniquement)
      const result = await atomsService.syncAtoms('new', 500);
      
      if (result.success) {
        const { stats, atoms } = result;
        const message = stats.added > 0
          ? `✅ ${stats.added} nouveaux atoms ajoutés !\n\n` +
            `📊 Total: ${atoms.after.toLocaleString()} / ${atoms.total_on_network.toLocaleString()} atoms\n` +
            `📈 Couverture: ${atoms.coverage_percent}%`
          : `✅ Aucun nouvel atom.\n\n` +
            `📊 Vous avez déjà ${atoms.after.toLocaleString()} atoms\n` +
            `📈 Couverture: ${atoms.coverage_percent}%`;
        
        alert(message);
        await loadAtoms(); // Recharger la liste
      } else {
        alert(`❌ Erreur: ${result.error}`);
      }
    } catch (err) {
      alert('❌ Erreur lors de la synchronisation');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchMode(false);
      await loadAtoms();
      return;
    }

    try {
      setLoading(true);
      setSearchMode(true);
      const data = await atomsService.searchAtoms(query);
      setAtoms(data.atoms);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchMode(false);
    await loadAtoms();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">🧠</span>
            Intuition Explorer
          </h1>
          <p className="dashboard-subtitle">
            Découvrez et explorez les Atoms les plus fiables du protocole Intuition
          </p>
        </div>

        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} />

        <div className="header-actions">
          <button 
            onClick={handleSync} 
            disabled={syncing}
            className="sync-button"
          >
            {syncing ? '⏳ Synchronisation...' : '🔄 Synchroniser les données'}
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Chargement des atoms...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">⚠️ {error}</p>
            <button onClick={loadAtoms} className="retry-button">
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {!searchMode && (
              <div className="tabs-container">
                <div className="tabs">
                  <button
                    className={`tab ${activeTab === 'top' ? 'active' : ''}`}
                    onClick={() => setActiveTab('top')}
                  >
                    🏆 Top Atoms
                  </button>
                  <button
                    className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trending')}
                  >
                    📈 Trending
                  </button>
                </div>
                
                {activeTab === 'trending' && (
                  <div className="period-selector">
                    <button
                      className={`period-button ${trendingPeriod === '24h' ? 'active' : ''}`}
                      onClick={() => setTrendingPeriod('24h')}
                    >
                      24h
                    </button>
                    <button
                      className={`period-button ${trendingPeriod === '7d' ? 'active' : ''}`}
                      onClick={() => setTrendingPeriod('7d')}
                    >
                      7j
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="dashboard-stats">
              <h2 className="section-title">
                {searchMode 
                  ? `🔍 Résultats de recherche (${atoms.length})` 
                  : activeTab === 'trending' 
                    ? `📈 Atoms en Tendance (${atoms.length})`
                    : `🏆 Top ${atoms.length} des Atoms`
                }
              </h2>
              {!searchMode && (
                <p className="section-description">
                  {activeTab === 'trending'
                    ? `Plus forte croissance sur ${trendingPeriod === '24h' ? '24 heures' : '7 jours'}`
                    : 'Classés par valeur de signal (confiance économique) décroissante'
                  }
                </p>
              )}
            </div>

            {atoms.length === 0 ? (
              <div className="empty-state">
                <p className="empty-message">
                  {searchMode 
                    ? 'Aucun résultat trouvé pour votre recherche' 
                    : 'Aucun atom disponible. Cliquez sur "Synchroniser les données" pour charger les atoms depuis l\'API Intuition.'}
                </p>
              </div>
            ) : (
              <div className="atoms-grid">
                {atoms.map((atom) => (
                  <AtomCard 
                    key={atom.id} 
                    atom={atom} 
                    showGrowth={activeTab === 'trending'}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

