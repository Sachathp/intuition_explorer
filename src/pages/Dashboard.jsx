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

  useEffect(() => {
    loadAtoms();
  }, []);

  const loadAtoms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await atomsService.getAtoms(10);
      setAtoms(data.atoms);
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
      const result = await atomsService.syncAtoms();
      alert(`✅ ${result.synced_count} atoms synchronisés avec succès !`);
      await loadAtoms();
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
            <div className="dashboard-stats">
              <h2 className="section-title">
                {searchMode ? `🔍 Résultats de recherche (${atoms.length})` : '🏆 Top 10 des Atoms'}
              </h2>
              {!searchMode && (
                <p className="section-description">
                  Classés par valeur de signal (confiance économique) décroissante
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
                  <AtomCard key={atom.id} atom={atom} />
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

