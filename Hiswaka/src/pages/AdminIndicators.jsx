import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  Edit2, Trash2, Plus, Search, Loader2, AlertTriangle, CheckCircle, Eye, EyeOff
} from 'lucide-react';

const AdminIndicators = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [newIndicator, setNewIndicator] = useState({
    title: '',
    description: '',
    category: '',
    visibility: 'PRIVATE'
  });

  // Récupérer les indicateurs
  useEffect(() => {
    fetchIndicators();
  }, []);

  const fetchIndicators = async () => {
    try {
      setLoading(true);
      const response = await api.get('/catalog/indicators/');
      setIndicators(response.data.results || response.data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un indicateur
  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet indicateur ?')) return;
    
    try {
      await api.delete(`/catalog/indicators/${id}/`);
      setIndicators(indicators.filter(ind => ind.id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Erreur lors de la suppression';
      alert(errorMsg);
      console.error('Erreur suppression:', err);
    }
  };

  // Modifier un indicateur
  const handleEdit = async (id) => {
    try {
      await api.patch(`/catalog/indicators/${id}/`, editData);
      setIndicators(indicators.map(ind => 
        ind.id === id ? { ...ind, ...editData } : ind
      ));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || 'Erreur lors de la modification';
      alert(errorMsg);
      console.error('Erreur modification:', err);
    }
  };

  // Créer un nouvel indicateur
  const handleCreate = async () => {
    if (!newIndicator.title || !newIndicator.category) {
      alert('Veuillez remplir les champs obligatoires');
      return;
    }

    try {
      const response = await api.post('/catalog/indicators/', newIndicator);
      setIndicators([...indicators, response.data]);
      setNewIndicator({
        title: '',
        description: '',
        category: '',
        visibility: 'PRIVATE'
      });
      setShowForm(false);
    } catch (err) {
      alert('Erreur lors de la création');
    }
  };

  // Filtrer les indicateurs
  const filteredIndicators = indicators.filter(ind =>
    ind.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ind.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Indicateurs</h1>
        <p className="text-gray-500">Créer, modifier ou supprimer les indicateurs de données</p>
      </div>

      {/* Barre de recherche et bouton créer */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher un indicateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-2"
        >
          <Plus size={20} /> Nouvel Indicateur
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Créer un nouvel indicateur</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Titre"
              value={newIndicator.title}
              onChange={(e) => setNewIndicator({ ...newIndicator, title: e.target.value })}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              type="text"
              placeholder="Catégorie"
              value={newIndicator.category}
              onChange={(e) => setNewIndicator({ ...newIndicator, category: e.target.value })}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <textarea
              placeholder="Description"
              value={newIndicator.description}
              onChange={(e) => setNewIndicator({ ...newIndicator, description: e.target.value })}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none md:col-span-2"
              rows="3"
            />
            <select
              value={newIndicator.visibility}
              onChange={(e) => setNewIndicator({ ...newIndicator, visibility: e.target.value })}
              className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="PRIVATE">Privé</option>
              <option value="PUBLIC">Public</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
            >
              Créer
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste des indicateurs */}
      <div className="space-y-3">
        {filteredIndicators.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">Aucun indicateur trouvé</p>
          </div>
        ) : (
          filteredIndicators.map(indicator => (
            <div key={indicator.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
              {editingId === indicator.id ? (
                // Mode édition
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.title || indicator.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <textarea
                    value={editData.description || indicator.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    rows="2"
                  />
                  <select
                    value={editData.visibility || indicator.visibility}
                    onChange={(e) => setEditData({ ...editData, visibility: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="PRIVATE">Privé</option>
                    <option value="PUBLIC">Public</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(indicator.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 transition"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{indicator.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        indicator.visibility === 'PUBLIC' 
                          ? 'bg-green-100 text-green-800 flex items-center gap-1' 
                          : 'bg-amber-100 text-amber-800 flex items-center gap-1'
                      }`}>
                        {indicator.visibility === 'PUBLIC' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {indicator.visibility}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{indicator.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Catégorie: {indicator.category?.name || indicator.category}</span>
                      <span>ID: {indicator.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => {
                        setEditingId(indicator.id);
                        setEditData(indicator);
                      }}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(indicator.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminIndicators;
