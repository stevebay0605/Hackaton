import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, PieChart, Database, Calendar, Tag, Lock as LockIcon, Unlock as UnlockIcon, Loader2 } from 'lucide-react';
// import { indicators } from '../data/mockData'; // <-- ON ENLÈVE ÇA
import api from '../services/api'; // <-- ON IMPORTE L'API
import { useAuth } from '../context/AuthContext';

const DataCatalog = () => {
  const [indicators, setIndicators] = useState([]); // État pour stocker les données API
  const [loading, setLoading] = useState(true);     // État de chargement
  const [error, setError] = useState(null);         // État d'erreur

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const { isAuthenticated } = useAuth();

  // --- EFFET POUR CHARGER LES DONNÉES ---
 // Dans src/pages/DataCatalog.jsx

useEffect(() => {
  const fetchIndicators = async () => {
    try {
      setLoading(true);
      const response = await api.get('/indicators/indicators/');
      
      // --- CORRECTION ICI ---
      // Django renvoie souvent les données dans 'results' si la pagination est active
      if (Array.isArray(response.data)) {
          setIndicators(response.data);
      } else if (response.data.results && Array.isArray(response.data.results)) {
          setIndicators(response.data.results);
      } else {
          setIndicators([]); // Fallback si le format est inconnu
          console.error("Format de données API inattendu:", response.data);
      }
      // ----------------------
      
      setError(null);
    } catch (err) {
      console.error("Erreur chargement:", err);
      setError("Impossible de charger les données depuis le serveur.");
    } finally {
      setLoading(false);
    }
  };

  fetchIndicators();
}, []);
  // --------------------------------------

  // Le reste de la logique de filtrage reste identique, mais utilise l'état 'indicators'
 const categories = Array.isArray(indicators) 
    ? ['Tout', ...new Set(indicators.map(i => i.category || i.theme || 'Non classé'))]
    : ['Tout'];

  const filteredIndicators = indicators.filter(indicator => {
    const title = indicator.title || indicator.name; // Adaptez selon votre modèle
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tout' || (indicator.category || indicator.theme) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl m-4">
        <p>{error}</p>
        <p className="text-sm mt-2 text-gray-500">Vérifiez que le backend Django tourne sur le port 8000.</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* ... LE RESTE DU JSX EST IDENTIQUE À VOTRE VERSION PRÉCÉDENTE ... */}
      {/* Juste assurez-vous d'utiliser les bons noms de champs (ex: item.title vs item.name) selon votre modèle Django */}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIndicators.length > 0 ? (
            filteredIndicators.map((item) => (
                <Link to={`/donnees/${item.id}`} key={item.id} className="group bg-white rounded-xl border border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    {/* ... Contenu de la carte ... */}
                    <div className="p-6 flex-grow">
                         <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.title || item.name} {/* Adaptation dynamique */}
                         </h3>
                         {/* ... */}
                    </div>
                </Link>
            ))
        ) : (
            // ... État vide
             <div className="col-span-full py-12 text-center text-gray-500">Aucun résultat</div>
        )}
      </div>

    </div>
  );
};

export default DataCatalog;