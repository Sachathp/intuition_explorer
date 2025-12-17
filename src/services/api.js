import axios from 'axios';

// URL de base de l'API Rails
const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Services pour les Atoms
export const atomsService = {
  // Récupère les atoms (par défaut les 10 meilleurs)
  getAtoms: async (limit = 10) => {
    try {
      const response = await api.get(`/atoms?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des atoms:', error);
      throw error;
    }
  },

  // Récupère un atom spécifique par son ID
  getAtom: async (id) => {
    try {
      const response = await api.get(`/atoms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'atom ${id}:`, error);
      throw error;
    }
  },

  // Récupère l'historique d'un atom pour les graphiques
  // period: '1h', '4h', '24h', '7d'
  getAtomHistory: async (id, period = '7d') => {
    try {
      // Convertir la période en paramètre approprié
      let queryParam;
      switch (period) {
        case '1h':
          queryParam = 'hours=1';
          break;
        case '4h':
          queryParam = 'hours=4';
          break;
        case '24h':
        case '1d':
          queryParam = 'days=1';
          break;
        case '7d':
        case '1w':
        default:
          queryParam = 'days=7';
          break;
      }
      
      const response = await api.get(`/atoms/${id}/history?${queryParam}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique de l'atom ${id}:`, error);
      throw error;
    }
  },

  // Récupère les atoms trending (plus forte croissance)
  getTrending: async (period = '24h', limit = 10) => {
    try {
      const response = await api.get(`/trending?period=${period}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des atoms trending:', error);
      throw error;
    }
  },

  // Recherche des atoms par requête
  searchAtoms: async (query, limit = 20) => {
    try {
      const response = await api.get(`/search?query=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  },

  // Synchronise les atoms depuis l'API Intuition
  // mode: 'new' (nouveaux atoms), 'update' (mise à jour), 'full' (tout)
  // limit: nombre max d'atoms à synchroniser
  syncAtoms: async (mode = 'new', limit = 500) => {
    try {
      const response = await api.post('/sync', { mode, limit });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  },

  // Récupère le statut de la synchronisation
  getSyncStatus: async () => {
    try {
      const response = await api.get('/sync/status');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      throw error;
    }
  },
};

// Services pour les Positions (wallet)
export const positionsService = {
  // Récupère les positions d'une adresse wallet
  getPositions: async (address, limit = 50, offset = 0) => {
    try {
      const response = await api.get(`/positions?address=${address}&limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des positions pour ${address}:`, error);
      throw error;
    }
  },
};

export default api;

