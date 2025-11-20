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
  syncAtoms: async () => {
    try {
      const response = await api.post('/sync');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
      throw error;
    }
  },
};

export default api;

