import api from './api';

/**
 * Service pour le système ETL
 * Gère l'upload et le traitement des fichiers
 */

const etlService = {
  /**
   * Upload et traitement automatique d'un fichier
   * @param {File} file - Le fichier à uploader
   * @param {number} categoryId - ID de la catégorie
   * @param {string} fileFormat - Format du fichier (CSV ou EXCEL)
   * @returns {Promise} Résultats du traitement
   */
  uploadAndProcess: async (file, categoryId, fileFormat = 'CSV') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('file_name', file.name);
      formData.append('file_format', fileFormat);
      formData.append('category_id', categoryId);

      const response = await api.post('/etl/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors de l\'upload' };
    }
  },

  /**
   * Obtenir tous les uploads
   */
  getUploads: async (page = 1) => {
    try {
      const response = await api.get('/etl/uploads/', {
        params: { page },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir un upload par ID
   */
  getUpload: async (id) => {
    try {
      const response = await api.get(`/etl/uploads/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les uploads en attente
   */
  getPendingUploads: async () => {
    try {
      const response = await api.get('/etl/uploads/pending/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les uploads en traitement
   */
  getProcessingUploads: async () => {
    try {
      const response = await api.get('/etl/uploads/processing/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les uploads complétés
   */
  getCompletedUploads: async () => {
    try {
      const response = await api.get('/etl/uploads/completed/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Obtenir les uploads avec erreur
   */
  getFailedUploads: async () => {
    try {
      const response = await api.get('/etl/uploads/failed/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Traiter manuellement un upload
   */
  processUpload: async (id) => {
    try {
      const response = await api.post(`/etl/uploads/${id}/process/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Télécharger le fichier de sortie XLS
   */
  downloadOutput: async (id) => {
    try {
      const response = await api.get(`/etl/uploads/${id}/download/`, {
        responseType: 'blob',
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `etl_output_${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erreur lors du téléchargement' };
    }
  },

  /**
   * Supprimer un upload
   */
  deleteUpload: async (id) => {
    try {
      await api.delete(`/etl/uploads/${id}/`);
      return { success: true };
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },
};

export default etlService;
