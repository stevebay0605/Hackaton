import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  ArrowLeft, Download, Share2, Info, LockKeyhole, Calendar, Database, CheckCircle, AlertTriangle, Loader2 
} from 'lucide-react';
import api from '../services/api'; // Votre service Axios configuré
import { useAuth } from '../context/AuthContext';

const DataDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  // États pour les données API
  const [indicator, setIndicator] = useState(null);
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setAccessDenied(false);
      setError(null);

      try {
        // 1. Récupérer les métadonnées de l'indicateur
        // Endpoint: GET /api/catalog/indicators/{id}/
        const indicatorRes = await api.get(`/catalog/indicators/${id}/`);
        setIndicator(indicatorRes.data);

        // 2. Récupérer les points de données (Valeurs du graphique)
        // Endpoint: GET /api/catalog/indicators/{id}/datapoints/
        // Note : Si l'indicateur est RESTRICTED et user non connecté, Django renverra 403 ici
        const pointsRes = await api.get(`/catalog/indicators/${id}/datapoints/`);
        
        // Adaptation du format pour Recharts (si nécessaire selon votre retour API)
        // On suppose que l'API renvoie : [{ "year": 2020, "value": 10.5 }, ...]
        setDataPoints(pointsRes.data);

      } catch (err) {
        console.error("Erreur API:", err);
        
        // Gestion fine des erreurs de sécurité
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
           // Si on a l'info de l'indicateur mais pas les points, c'est un accès restreint
           // On garde l'indicateur pour afficher le titre, mais on bloque le graph
           setAccessDenied(true);
        } else {
           setError("Impossible de charger les données.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated]); // Se re-déclenche si l'utilisateur se connecte

  // Fonction de téléchargement
  const handleExport = async (format) => {
    try {
        // Endpoint: GET /api/catalog/indicators/{id}/export/?format={json|csv}
        const response = await api.get(`/catalog/indicators/${id}/export/`, {
            params: { format: format },
            responseType: 'blob', // Important pour télécharger un fichier
        });
        
        // Création du lien de téléchargement invisible
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `indicateur_${id}_${format}.${format === 'csv' ? 'csv' : 'json'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch {
        alert("Erreur lors du téléchargement. Vérifiez vos droits d'accès.");
    }
  };

  if (loading && !indicator) return (
    <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
    </div>
  );

  if (error) return (
    <div className="container mx-auto px-4 py-12 text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900">Erreur de chargement</h2>
        <p className="text-gray-500">{error}</p>
        <Link to="/donnees" className="text-emerald-600 font-bold hover:underline mt-4 block">Retour au catalogue</Link>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Fil d'ariane */}
      <Link to="/donnees" className="inline-flex items-center text-gray-500 hover:text-emerald-700 mb-6 transition">
        <ArrowLeft size={16} className="mr-2" /> Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            
            {/* Header de la carte */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div>
                    {/* On utilise les données réelles de Django ici */}
                    <h1 className="text-2xl font-bold text-gray-900">{indicator?.title || "Indicateur sans titre"}</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-bold uppercase">
                            {indicator?.theme?.name || indicator?.category?.name || indicator?.category || "Général"}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Database size={12}/> Source: {indicator?.source?.name || indicator?.source || indicator?.data_model?.name || "N/A"}
                        </span>
                    </div>
                </div>
                
                {/* Boutons d'action (Désactivés si accès refusé) */}
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleExport('csv')} 
                        disabled={accessDenied}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
                            accessDenied 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                        }`}
                    >
                        <Download size={16}/> CSV
                    </button>
                </div>
            </div>

            {/* ZONE GRAPHIQUE AVEC PROTECTION */}
            <div className="h-[400px] w-full bg-gray-50 rounded-xl border border-gray-100 p-4 relative">
                
                {/* OVERLAY DE SÉCURITÉ (Si 403 Forbidden) */}
                {accessDenied && (
                    <div className="absolute inset-0 z-10 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center rounded-xl border border-red-100 animate-in fade-in duration-500">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border border-gray-200">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LockKeyhole size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Accès Restreint</h3>
                            <div className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-bold uppercase rounded mb-4">
                                Classification: {indicator?.classification || "RESTRICTED"}
                            </div>
                            <p className="text-gray-500 mb-6 text-sm">
                                Ces données sont sensibles. Connectez-vous avec un compte partenaire accrédité pour visualiser les séries temporelles.
                            </p>
                            <Link to="/login" className="bg-emerald-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-900 transition block w-full shadow-lg">
                                Connexion Partenaire
                            </Link>
                        </div>
                    </div>
                )}

                {/* Le Graphique */}
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataPoints.length > 0 ? dataPoints : []}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis 
                            dataKey="year" // Assurez-vous que votre API renvoie bien "year" ou changez cette clé
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#6b7280', fontSize: 12}} 
                            dy={10} 
                        />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                            itemStyle={{color: '#065f46', fontWeight: 'bold'}}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="value" // Assurez-vous que votre API renvoie bien "value"
                            stroke="#059669" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorValue)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
                
                {/* Indicateur visuel si pas de données (et pas d'erreur d'accès) */}
                {!accessDenied && dataPoints.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                        Aucune donnée disponible pour cet indicateur.
                     </div>
                )}
            </div>
          </div>
          
          {/* Note méthodologique */}
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-4">
            <Info className="text-blue-600 flex-shrink-0" />
            <div className="text-sm text-blue-800">
                <strong>Description :</strong> {indicator?.description || "Aucune description disponible."}
            </div>
          </div>
        </div>

        {/* Sidebar: Métadonnées */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Détails de l'indicateur</h3>
                <div className="space-y-4">
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Dernière mise à jour</div>
                        <div className="text-sm font-medium flex items-center gap-2">
                            <Calendar size={14} className="text-emerald-600"/> 
                            {indicator?.last_update ? new Date(indicator.last_update).toLocaleDateString() : "Non spécifié"}
                        </div>
                    </div>
                    <div className="h-px bg-gray-100"></div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Périodicité</div>
                        <div className="text-sm font-medium">{indicator?.frequency || "Annuelle"}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Couverture</div>
                        <div className="text-sm font-medium">Nationale (Congo)</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Unité</div>
                        <div className="text-sm font-medium">{indicator?.unit || "N/A"}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase font-bold mb-1">Accès</div>
                        <div className={`text-sm font-bold flex items-center gap-1 ${indicator?.classification === 'PUBLIC' ? 'text-green-600' : 'text-amber-600'}`}>
                            {indicator?.classification === 'PUBLIC' ? <CheckCircle size={14}/> : <LockKeyhole size={14}/>}
                            {indicator?.classification || "PUBLIC"}
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default DataDetail;