import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Au chargement de l'app, on vérifie si un utilisateur est déjà stocké
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user_data');
      const token = localStorage.getItem('access_token');
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Erreur lors du parsing des données utilisateur:', e);
      localStorage.removeItem('user_data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Connexion avec username et password
   */
  const login = async (username, password) => {
    try {
      setError(null);
      const { user: userData } = await authService.login(username, password);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      const errorMessage = err.error || err.detail || 'Erreur de connexion';
      setError(errorMessage);
      console.error('Erreur de connexion:', err);
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
      // Nettoyer même si la requête échoue
      setUser(null);
      return { success: true };
    }
  };

  /**
   * Rafraîchir le token
   */
  const refreshToken = async () => {
    try {
      setError(null);
      await authService.refreshToken();
      return { success: true };
    } catch {
      setError('Session expirée. Veuillez vous reconnecter.');
      setUser(null);
      return { success: false };
    }
  };

  /**
   * Changer le mot de passe
   */
  const changePassword = async (oldPassword, newPassword) => {
    try {
      setError(null);
      const result = await authService.changePassword(oldPassword, newPassword);
      return { success: true, message: result.message };
    } catch (err) {
      const errorMessage = err.error || 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: user?.is_staff || user?.role === 'ADMIN',
    login,
    logout,
    refreshToken,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};