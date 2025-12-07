/**
 * Configuration centralisée de l'API
 * Contient les constantes et configurations pour l'intégration frontend-backend
 */

export const API_CONFIG = {
  // URL de base de l'API
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',

  // Endpoints d'authentification
  AUTH: {
    LOGIN: '/auth/users/login/',
    LOGOUT: '/auth/users/logout/',
    ME: '/auth/users/me/',
    CHANGE_PASSWORD: '/auth/users/change_password/',
    TOKEN: '/token/',
    REFRESH: '/token/refresh/',
  },

  // Endpoints du catalogue
  CATALOG: {
    INDICATORS: '/catalog/indicators/',
    INDICATORS_PUBLIC: '/catalog/indicators/public/',
    INDICATORS_PRIVATE: '/catalog/indicators/private/',
    CATEGORIES: '/catalog/categories/',
    DATA_MODELS: '/catalog/data-models/',
  },

  // Endpoints du dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats/',
  },

  // Endpoints ETL
  ETL: {
    UPLOAD: '/etl/upload/',
    UPLOADS: '/etl/uploads/',
    PENDING: '/etl/uploads/pending/',
    PROCESSING: '/etl/uploads/processing/',
    COMPLETED: '/etl/uploads/completed/',
    FAILED: '/etl/uploads/failed/',
  },

  // Configuration des tokens
  TOKENS: {
    ACCESS_TOKEN_KEY: 'access_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    USER_DATA_KEY: 'user_data',
    ACCESS_TOKEN_LIFETIME: 24 * 60 * 60 * 1000, // 24 heures en ms
    REFRESH_TOKEN_LIFETIME: 7 * 24 * 60 * 60 * 1000, // 7 jours en ms
  },

  // Messages d'erreur
  ERRORS: {
    NETWORK_ERROR: 'Erreur réseau. Veuillez vérifier votre connexion.',
    UNAUTHORIZED: 'Authentification requise. Veuillez vous connecter.',
    FORBIDDEN: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.',
    NOT_FOUND: 'Ressource non trouvée.',
    SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
    VALIDATION_ERROR: 'Les données fournies sont invalides.',
  },

  // Rôles utilisateur
  ROLES: {
    ADMIN: 'ADMIN',
    PARTNER: 'PARTNER',
    PUBLIC: 'PUBLIC',
  },

  // Statuts ETL
  ETL_STATUS: {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
  },

  // Visibilité des indicateurs
  VISIBILITY: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE',
    RESTRICTED: 'RESTRICTED',
  },

  // Formats de fichier
  FILE_FORMATS: {
    CSV: 'CSV',
    EXCEL: 'EXCEL',
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
};

/**
 * Obtenir l'URL complète d'un endpoint
 * @param {string} endpoint - L'endpoint relatif
 * @returns {string} L'URL complète
 */
export const getFullURL = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Obtenir le message d'erreur approprié
 * @param {number} statusCode - Code HTTP
 * @returns {string} Message d'erreur
 */
export const getErrorMessage = (statusCode) => {
  switch (statusCode) {
    case 400:
      return API_CONFIG.ERRORS.VALIDATION_ERROR;
    case 401:
      return API_CONFIG.ERRORS.UNAUTHORIZED;
    case 403:
      return API_CONFIG.ERRORS.FORBIDDEN;
    case 404:
      return API_CONFIG.ERRORS.NOT_FOUND;
    case 500:
    case 502:
    case 503:
      return API_CONFIG.ERRORS.SERVER_ERROR;
    default:
      return API_CONFIG.ERRORS.NETWORK_ERROR;
  }
};

export default API_CONFIG;
