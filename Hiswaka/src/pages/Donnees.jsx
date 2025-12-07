import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { catalogService } from '../services';
import { Lock, Search, Loader2, AlertCircle, BarChart3, TrendingUp, Eye, EyeOff, Eye as EyeIcon, ArrowRight } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Donnees = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [indicators, setIndicators] = useState([]);
  const [publicIndicators, setPublicIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [filterVisibility, setFilterVisibility] = useState('all');

  // Charger les indicateurs
  useEffect(() => {
    const loadIndicators = async () => {
      try {
        setLoading(true);
        
        // Toujours charger les indicateurs publics
        const publicData = await catalogService.getPublicIndicators();
        const publicList = publicData.results || publicData;
        setPublicIndicators(publicList);

        // Si authentifié, charger tous les indicateurs
        if (isAuthenticated) {
          const allData = await catalogService.getIndicators();
          const allList = allData.results || allData;
          setIndicators(allList);
        } else {
          setIndicators(publicList);
        }

        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des indicateurs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadIndicators();
  }, [isAuthenticated]);

  // Filtrer les indicateurs
  const filteredIndicators = indicators.filter(ind => {
    const matchesSearch = ind.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ind.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterVisibility === 'public') {
      return matchesSearch && ind.visibility === 'PUBLIC';
    } else if (filterVisibility === 'private') {
      return matchesSearch && ind.visibility === 'PRIVATE';
    }
    return matchesSearch;
  });

  // Vérifier l'accès aux données privées
  const canAccessPrivate = isAuthenticated;

  // Données de démonstration pour les graphiques
  const chartData = [
    { month: 'Jan', value: 400, trend: 2400 },
    { month: 'Fév', value: 300, trend: 1398 },
    { month: 'Mar', value: 200, trend: 9800 },
    { month: 'Avr', value: 278, trend: 3908 },
    { month: 'Mai', value: 189, trend: 4800 },
    { month: 'Juin', value: 239, trend: 3800 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={40} />
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Catalogue de Données</h1>
              <p className="text-gray-600 mt-1">
                {isAuthenticated ? `Bienvenue, ${user?.first_name || user?.username}` : 'Données publiques'}
              </p>
            </div>
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Se connecter
              </button>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par titre ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              {[
                { label: 'Tous', value: 'all' },
                { label: 'Publics', value: 'public' },
                ...(isAuthenticated ? [{ label: 'Privés', value: 'private' }] : []),
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setFilterVisibility(filter.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterVisibility === filter.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-emerald-500'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Indicateur Sélectionné - Détails avec Graphiques */}
        {selectedIndicator && (
          <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedIndicator.title}</h2>
                <p className="text-gray-600 mt-2">{selectedIndicator.description}</p>
                <div className="flex gap-4 mt-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedIndicator.visibility === 'PUBLIC'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedIndicator.visibility === 'PUBLIC' ? '🔓 Public' : '🔒 Privé'}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    {selectedIndicator.category_name || 'Catégorie'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedIndicator(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique Ligne */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Tendance
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique Aire */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="trend" fill="#f3f4f6" stroke="#10b981" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique Barres */}
              <div className="bg-gray-50 rounded-lg p-4 lg:col-span-2">
                <h3 className="font-bold text-lg mb-4">Comparaison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#10b981" />
                    <Bar dataKey="trend" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Liste des Indicateurs */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {filteredIndicators.length} Indicateur{filteredIndicators.length !== 1 ? 's' : ''}
          </h2>

          {filteredIndicators.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
              <p className="text-gray-600">Aucun indicateur trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIndicators.map(indicator => {
                const isPrivate = indicator.visibility === 'PRIVATE';
                const canView = !isPrivate || isAuthenticated;

                const handleViewDetails = (e) => {
                  e.stopPropagation();
                  if (isPrivate && !isAuthenticated) {
                    // Rediriger vers la page de demande d'accès
                    navigate('/demande');
                  } else {
                    // Aller à la page de détails
                    navigate(`/donnees/${indicator.id}`);
                  }
                };

                return (
                  <div
                    key={indicator.id}
                    className={`rounded-lg border p-4 transition ${
                      canView
                        ? 'bg-white border-gray-200 hover:shadow-lg'
                        : 'bg-gray-50 border-gray-300 opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 flex-1">{indicator.title}</h3>
                      {isPrivate && (
                        <Lock className={`flex-shrink-0 ml-2 ${isAuthenticated ? 'text-yellow-600' : 'text-red-600'}`} size={18} />
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{indicator.description}</p>

                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        indicator.visibility === 'PUBLIC'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {indicator.visibility === 'PUBLIC' ? 'Public' : 'Privé'}
                      </span>
                      <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                        {indicator.category_name || 'Catégorie'}
                      </span>
                    </div>

                    {!canView ? (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Lock size={16} />
                          <span>Données confidentielles</span>
                        </div>
                        <button
                          onClick={handleViewDetails}
                          className="ml-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs font-bold hover:bg-yellow-700 transition"
                        >
                          Demander accès
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleViewDetails}
                        className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                      >
                        <EyeIcon size={16} />
                        Voir les détails
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donnees;
