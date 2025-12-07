import api from './api';

/**
 * Service pour le catalogue de données
 * Gère les indicateurs, catégories, modèles de données
 */

const catalogService = {
  // ============ INDICATEURS ============

  /**
   * Obtenir tous les indicateurs
   */
  getIndicators: async (page = 1) => {
    try {
      const response = await api.get('/catalog/indicators/', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les indicateurs publics (sans authentification requise)
   */
  getPublicIndicators: async (page = 1) => {
    try {
      const response = await api.get('/catalog/indicators/public/', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les indicateurs privés (Admin uniquement)
   */
  getPrivateIndicators: async (page = 1) => {
    try {
      const response = await api.get('/catalog/indicators/private/', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir un indicateur par ID
   */
  getIndicator: async (id) => {
    try {
      const response = await api.get(`/catalog/indicators/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Créer un nouvel indicateur
   */
  createIndicator: async (data) => {
    try {
      const response = await api.post('/catalog/indicators/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Mettre à jour un indicateur
   */
  updateIndicator: async (id, data) => {
    try {
      const response = await api.patch(`/catalog/indicators/${id}/`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Supprimer un indicateur
   */
  deleteIndicator: async (id) => {
    try {
      await api.delete(`/catalog/indicators/${id}/`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  // ============ CATÉGORIES ============

  /**
   * Obtenir toutes les catégories
   */
  getCategories: async (page = 1) => {
    try {
      const response = await api.get('/catalog/categories/', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir une catégorie par ID
   */
  getCategory: async (id) => {
    try {
      const response = await api.get(`/catalog/categories/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Créer une nouvelle catégorie
   */
  createCategory: async (data) => {
    try {
      const response = await api.post('/catalog/categories/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Mettre à jour une catégorie
   */
  updateCategory: async (id, data) => {
    try {
      const response = await api.patch(`/catalog/categories/${id}/`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Supprimer une catégorie
   */
  deleteCategory: async (id) => {
    try {
      await api.delete(`/catalog/categories/${id}/`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  // ============ MODÈLES DE DONNÉES ============

  /**
   * Obtenir tous les modèles de données
   */
  getDataModels: async (page = 1) => {
    try {
      const response = await api.get('/catalog/data-models/', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir un modèle de données par ID
   */
  getDataModel: async (id) => {
    try {
      const response = await api.get(`/catalog/data-models/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Créer un nouveau modèle de données
   */
  createDataModel: async (data) => {
    try {
      const response = await api.post('/catalog/data-models/', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Mettre à jour un modèle de données
   */
  updateDataModel: async (id, data) => {
    try {
      const response = await api.patch(`/catalog/data-models/${id}/`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Supprimer un modèle de données
   */
  deleteDataModel: async (id) => {
    try {
      await api.delete(`/catalog/data-models/${id}/`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  // ============ RECHERCHE ============

  /**
   * Rechercher des indicateurs
   */
  searchIndicators: async (query) => {
    try {
      const response = await api.get('/catalog/indicators/', {
        params: { search: query },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },
};

export default catalogService;
