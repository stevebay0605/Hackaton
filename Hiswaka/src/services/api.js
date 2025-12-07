import axios from 'axios';

// Création de l'instance avec l'URL de base définie dans le .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTEUR : Ajoute le token à CHAQUE requête si on est connecté
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTEUR : Gère les erreurs (ex: 401 si le token expire)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si on reçoit une erreur 401 (Non autorisé), on déconnecte l'utilisateur proprement
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      // Optionnel : rediriger vers /login
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;