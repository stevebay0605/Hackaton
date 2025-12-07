import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

/**
 * Composant pour protéger les routes
 * Vérifie l'authentification et le rôle requis
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Attendre le chargement de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'accès...</p>
        </div>
      </div>
    );
  }

  // Vérifier l'authentification
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole === 'admin' && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center border border-gray-200">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page. Seuls les administrateurs peuvent y accéder.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  // Tout est bon, afficher le contenu
  return children;
};

export default ProtectedRoute;
