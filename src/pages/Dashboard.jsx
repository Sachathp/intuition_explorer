import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { atomsService } from '../services/api';
import AtomCard from '../components/AtomCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  
  // Restaurer l'état depuis la navigation si disponible
  const restoreState = location.state?.restore;
  
  const [atoms, setAtoms] = useState([]);
  const [allAtoms, setAllAtoms] = useState([]); // Pour le filtrage côté client
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [activeTab, setActiveTab] = useState(restoreState?.activeTab || 'top');
  const [trendingPeriod, setTrendingPeriod] = useState(restoreState?.trendingPeriod || '7d');
  const [limit, setLimit] = useState(restoreState?.limit || 10);
  const [filters, setFilters] = useState(restoreState?.filters || {
    sortBy: 'market_cap',
    sortOrder: 'desc',
    minMarketCap: '',
    maxMarketCap: '',
    minSharePrice: '',
    maxSharePrice: '',
  });

  useEffect(() => {
    loadAtoms();
  }, [activeTab, trendingPeriod, limit]);

  const loadAtoms = async () => {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === 'trending') {
        const data = await atomsService.getTrending(trendingPeriod, limit * 2); // Charger plus pour le filtrage
        setAllAtoms(data.trending);
        setAtoms(applyFilters(data.trending));
      } else {
        const data = await atomsService.getAtoms(limit * 2); // Charger plus pour le filtrage
        setAllAtoms(data.atoms);
        setAtoms(applyFilters(data.atoms));
      }
    } catch (err) {
      setError('Erreur lors du chargement des atoms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres sur les atoms
  const applyFilters = (atomsList) => {
    let filtered = [...atomsList];

    // Filtrer par market cap minimum
    if (filters.minMarketCap) {
      filtered = filtered.filter(atom => 
        (atom.market_cap || 0) >= parseFloat(filters.minMarketCap)
      );
    }

    // Filtrer par market cap maximum
    if (filters.maxMarketCap) {
      filtered = filtered.filter(atom => 
        (atom.market_cap || 0) <= parseFloat(filters.maxMarketCap)
      );
    }

    // Filtrer par share price minimum
    if (filters.minSharePrice) {
      filtered = filtered.filter(atom => 
        (atom.share_price || 0) >= parseFloat(filters.minSharePrice)
      );
    }

    // Filtrer par share price maximum
    if (filters.maxSharePrice) {
      filtered = filtered.filter(atom => 
        (atom.share_price || 0) <= parseFloat(filters.maxSharePrice)
      );
    }

    // Trier selon le mode actif
    if (activeTab === 'trending') {
      // En mode Trending : trier par croissance selon la période sélectionnée
      const growthField = `growth_${trendingPeriod.replace('d', 'd')}_percent`;
      filtered.sort((a, b) => {
        const growthA = a[growthField] || a.growth_percentage || 0;
        const growthB = b[growthField] || b.growth_percentage || 0;
        return growthB - growthA; // Toujours décroissant (plus forte croissance en premier)
      });
    } else {
      // En mode Top : trier selon les préférences de l'utilisateur
      filtered.sort((a, b) => {
        let valueA, valueB;
        
        switch (filters.sortBy) {
          case 'market_cap':
            valueA = a.market_cap || 0;
            valueB = b.market_cap || 0;
            break;
          case 'share_price':
            valueA = a.share_price || 0;
            valueB = b.share_price || 0;
            break;
          case 'positions_count':
            valueA = a.positions_count || 0;
            valueB = b.positions_count || 0;
            break;
          case 'created_at':
            valueA = new Date(a.created_at).getTime();
            valueB = new Date(b.created_at).getTime();
            break;
          default:
            valueA = a.market_cap || 0;
            valueB = b.market_cap || 0;
        }

        return filters.sortOrder === 'desc' 
          ? valueB - valueA 
          : valueA - valueB;
      });
    }

    // Limiter au nombre demandé
    return filtered.slice(0, limit);
  };

  // Gérer le changement de filtres
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setAtoms(applyFilters(allAtoms));
  };

  // Gérer le changement de limite
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      
      // Mode UPDATE: Met à jour les données existantes (market cap, share price, etc.)
      // Synchronise les 1000 premiers atoms pour rafraîchir leurs données
      const result = await atomsService.syncAtoms('update', 1000);
      
      if (result.success) {
        const { stats, atoms } = result;
        
        // Message détaillé avec les statistiques de mise à jour
        const message = 
          `✅ Synchronisation terminée !\n\n` +
          `📊 Atoms actualisés: ${stats.updated.toLocaleString()}\n` +
          `✨ Nouveaux atoms: ${stats.created.toLocaleString()}\n` +
          `📈 Total en base: ${atoms.after.toLocaleString()} / ${atoms.total_on_network.toLocaleString()} atoms\n` +
          `🔢 Couverture: ${atoms.coverage_percent}%\n\n` +
          `💡 Les données (market cap, prix, etc.) sont maintenant à jour !`;
        
        alert(message);
        await loadAtoms(); // Recharger la liste avec les nouvelles données
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

  const getPeriodLabel = (period) => {
    const labels = {
      '1h': '1 heure',
      '4h': '4 heures',
      '24h': '24 heures',
      '7d': '1 semaine'
    };
    return labels[period] || period;
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
            title="Actualise les données des atoms (market cap, prix, etc.)"
          >
            {syncing ? '⏳ Actualisation en cours...' : '🔄 Actualiser les données'}
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
                
              </div>
            )}
            
            <div className="dashboard-stats">
              <div className="stats-header">
                <div className="stats-header-text">
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
                        ? `Plus forte croissance sur ${getPeriodLabel(trendingPeriod)}`
                        : 'Classés par market cap (capitalisation de marché) décroissante'
                      }
                    </p>
                  )}
                </div>
              </div>

              {!searchMode && (
                <FilterPanel 
                  onFilterChange={handleFilterChange}
                  onLimitChange={handleLimitChange}
                  onPeriodChange={setTrendingPeriod}
                  currentLimit={limit}
                  currentPeriod={trendingPeriod}
                  isTrendingMode={activeTab === 'trending'}
                />
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
                    dashboardState={{
                      activeTab,
                      trendingPeriod,
                      limit,
                      filters
                    }}
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

