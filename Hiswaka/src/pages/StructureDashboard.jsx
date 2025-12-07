import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Database, Download, Eye, Lock, Loader2, AlertTriangle, LogOut
} from 'lucide-react';

const StructureDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);

  // Récupérer les données attribuées à la structure
  useEffect(() => {
    fetchAssignedIndicators();
  }, []);

  const fetchAssignedIndicators = async () => {
    try {
      setLoading(true);
      // Récupérer les indicateurs attribués à l'utilisateur
      const response = await api.get('/catalog/indicators/my-indicators/');
      setIndicators(response.data.results || response.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIndicator = async (indicator) => {
    setSelectedIndicator(indicator);
    try {
      // Récupérer les points de données
      const response = await api.get(`/catalog/indicators/${indicator.id}/datapoints/`);
      setDataPoints(response.data);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleExport = async (format) => {
    if (!selectedIndicator) return;
    
    try {
      const response = await api.get(`/catalog/indicators/${selectedIndicator.id}/export/`, {
        params: { format: format },
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `indicateur_${selectedIndicator.id}_${format}.${format === 'csv' ? 'csv' : 'json'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erreur lors du téléchargement');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord - {user?.organization_name || 'Structure'}</h1>
            <p className="text-gray-500 text-sm">Accès aux données attribuées</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {indicators.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">Aucune donnée n'a été attribuée à votre structure</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Liste des indicateurs */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Database size={20} /> Données Disponibles
                </h2>
                <div className="space-y-2">
                  {indicators.map(indicator => (
                    <button
                      key={indicator.id}
                      onClick={() => handleSelectIndicator(indicator)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedIndicator?.id === indicator.id
                          ? 'bg-emerald-100 border border-emerald-500'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-bold text-sm text-gray-900">{indicator.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{indicator.category?.name || 'N/A'}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Détails et graphique */}
            <div className="lg:col-span-3 space-y-6">
              {selectedIndicator ? (
                <>
                  {/* Informations */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedIndicator.title}</h2>
                        <p className="text-gray-600 mt-2">{selectedIndicator.description}</p>
                      </div>
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                        <Eye size={14} /> Accessible
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Catégorie</div>
                        <div className="text-sm font-bold text-gray-900 mt-1">{selectedIndicator.category?.name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Dernière mise à jour</div>
                        <div className="text-sm font-bold text-gray-900 mt-1">
                          {selectedIndicator.last_update 
                            ? new Date(selectedIndicator.last_update).toLocaleDateString() 
                            : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Unité</div>
                        <div className="text-sm font-bold text-gray-900 mt-1">{selectedIndicator.unit || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Fréquence</div>
                        <div className="text-sm font-bold text-gray-900 mt-1">{selectedIndicator.frequency || 'Annuelle'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Graphique */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Évolution des données</h3>
                    {dataPoints.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataPoints}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        Aucune donnée disponible
                      </div>
                    )}
                  </div>

                  {/* Téléchargement */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-blue-900">Exporter les données</h3>
                      <p className="text-sm text-blue-700 mt-1">Téléchargez les données au format CSV ou JSON</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                      >
                        <Download size={18} /> CSV
                      </button>
                      <button
                        onClick={() => handleExport('json')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                      >
                        <Download size={18} /> JSON
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Database className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">Sélectionnez une donnée pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StructureDashboard;
