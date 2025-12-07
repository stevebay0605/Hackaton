import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, etlService, catalogService } from '../services';
import { LogOut, Upload, BarChart3, Users, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Admin = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploads, setUploads] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);

  // Redirection si pas admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
    }
  }, [isAdmin, navigate]);

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  // Charger les uploads ETL
  useEffect(() => {
    const loadUploads = async () => {
      try {
        const data = await etlService.getUploads();
        setUploads(data.results || data);
      } catch (err) {
        console.error('Erreur lors du chargement des uploads:', err);
      }
    };

    if (activeTab === 'etl') {
      loadUploads();
    }
  }, [activeTab]);

  // Gérer le logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Gérer l'upload ETL
  const handleETLUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const categoryId = prompt('Entrez l\'ID de la catégorie:');
      if (!categoryId) return;

      const result = await etlService.uploadAndProcess(file, categoryId, 'CSV');
      alert(`✓ ${result.processed_rows} indicateurs créés`);
      
      // Recharger les uploads
      const data = await etlService.getUploads();
      setUploads(data.results || data);
    } catch (err) {
      alert('Erreur lors de l\'upload: ' + (err.error || err.message));
    }
  };

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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            <p className="text-sm text-gray-600">Bienvenue, {user?.first_name || user?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'etl', label: 'ETL', icon: Upload },
              { id: 'requests', label: 'Demandes d\'accès', icon: FileText },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition ${
                    activeTab === tab.id
                      ? 'border-emerald-600 text-emerald-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
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

        {/* TAB: Dashboard */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8">
            {/* Cartes de Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Utilisateurs', value: stats.users?.total || 0, color: 'bg-blue-100 text-blue-600' },
                { label: 'Indicateurs', value: stats.indicators?.total || 0, color: 'bg-green-100 text-green-600' },
                { label: 'Demandes', value: stats.access_requests?.total || 0, color: 'bg-yellow-100 text-yellow-600' },
                { label: 'Uploads ETL', value: stats.etl?.total_uploads || 0, color: 'bg-purple-100 text-purple-600' },
              ].map((stat, idx) => (
                <div key={idx} className={`${stat.color} rounded-lg p-6`}>
                  <p className="text-sm font-medium opacity-75">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique Utilisateurs */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Distribution des Utilisateurs</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Admins', value: stats.users?.admins || 0 },
                        { name: 'Partners', value: stats.users?.partners || 0 },
                        { name: 'Public', value: stats.users?.public || 0 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                      <Cell fill="#3b82f6" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Graphique Indicateurs */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">État des Indicateurs</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'Public', value: stats.indicators?.public || 0 },
                      { name: 'Privé', value: stats.indicators?.private || 0 },
                      { name: 'Traité', value: stats.indicators?.processed || 0 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Détails */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Demandes d\'Accès</h3>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">En attente:</span> {stats.access_requests?.pending || 0}</p>
                  <p className="text-sm"><span className="font-medium">Approuvées:</span> {stats.access_requests?.approved || 0}</p>
                  <p className="text-sm"><span className="font-medium">Rejetées:</span> {stats.access_requests?.rejected || 0}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Système ETL</h3>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">En attente:</span> {stats.etl?.pending || 0}</p>
                  <p className="text-sm"><span className="font-medium">En traitement:</span> {stats.etl?.processing || 0}</p>
                  <p className="text-sm"><span className="font-medium">Complétés:</span> {stats.etl?.completed || 0}</p>
                  <p className="text-sm"><span className="font-medium">Échoués:</span> {stats.etl?.failed || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ETL */}
        {activeTab === 'etl' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4">Upload de Fichier</h3>
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition">
                <div className="text-center">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm font-medium text-gray-700">Cliquez pour sélectionner un fichier CSV</p>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleETLUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4">Historique des Uploads</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-4">Fichier</th>
                      <th className="text-left py-2 px-4">Statut</th>
                      <th className="text-left py-2 px-4">Lignes</th>
                      <th className="text-left py-2 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map(upload => (
                      <tr key={upload.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{upload.file_name}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            upload.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            upload.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                            upload.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {upload.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">{upload.total_rows}</td>
                        <td className="py-2 px-4 text-gray-500">{new Date(upload.uploaded_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: Demandes d'Accès */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Demandes d\'Accès aux Données</h3>
            <p className="text-gray-600">Aucune demande pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
