import api from './api';

/**
 * Service d'authentification
 * Gère le login, logout, refresh token, etc.
 */

const authService = {
  /**
   * Login avec username et password
   * @param {string} username
   * @param {string} password
   * @returns {Promise} { access, refresh, user }
   */
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/users/login/', {
        username,
        password,
      });
      
      const { access, refresh, user } = response.data;
      
      // Stocker les tokens et les infos utilisateur
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      return { access, refresh, user };
    } catch (error) {
      throw error.response?.data || { error: 'Erreur de connexion' };
    }
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      await api.post('/auth/users/logout/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le localStorage même si la requête échoue
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  },

  /**
   * Rafraîchir le token
   * @returns {Promise} { access, refresh }
   */
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Pas de refresh token');
      }

      const response = await api.post('/token/refresh/', {
        refresh: refreshToken,
      });

      const { access, refresh } = response.data;
      
      // Mettre à jour les tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      return { access, refresh };
    } catch (error) {
      // Si le refresh échoue, déconnecter l'utilisateur
      authService.logout();
      throw error;
    }
  },

  /**
   * Obtenir les infos de l'utilisateur connecté
   * @returns {Promise} user data
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/users/me/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Changer le mot de passe
   * @param {string} oldPassword
   * @param {string} newPassword
   */
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.post('/auth/users/change_password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Erreur' };
    }
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  /**
   * Obtenir les infos utilisateur du localStorage
   */
  getUserData: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin: () => {
    const user = authService.getUserData();
    return user?.is_staff || user?.role === 'ADMIN';
  },
};

export default authService;
