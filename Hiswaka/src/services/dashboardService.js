import api from './api';

/**
 * Service pour le dashboard
 * Gère les statistiques et les données du dashboard
 */

const dashboardService = {
  /**
   * Obtenir les statistiques du dashboard (Admin uniquement)
   */
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les statistiques des utilisateurs
   */
  getUserStats: async () => {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data.users;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les statistiques des indicateurs
   */
  getIndicatorStats: async () => {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data.indicators;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les statistiques des demandes d'accès
   */
  getAccessRequestStats: async () => {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data.access_requests;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les statistiques ETL
   */
  getETLStats: async () => {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data.etl;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les statistiques du catalogue
   */
  getCatalogStats: async () => {
    try {
      const response = await api.get('/dashboard/stats/');
      return response.data.catalog;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },
};

export default dashboardService;
