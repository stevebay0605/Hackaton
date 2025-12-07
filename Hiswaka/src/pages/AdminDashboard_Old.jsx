import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, etlService } from '../services';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, Database, FileSpreadsheet, Bell, Search, 
  Settings, ArrowUpRight, UploadCloud, CheckCircle, 
  Activity, Download, X, FileText, Building, Mail, Calendar, AlertTriangle, LogOut, Loader2
} from 'lucide-react';

// --- DONNÉES MODÈLES ETL ---
const etlModels = [
    { id: 'SANTE_V2', label: 'Santé Publique (Morbidité/Mortalité)', format: 'OMS Standard' },
    { id: 'ECO_IPC', label: 'Économie (Indice Prix Conso)', format: 'FMI/CEMAC' },
    { id: 'DEMO_RGPH', label: 'Démographie (Recensement)', format: 'National' },
    { id: 'AGRI_V1', label: 'Agriculture & Élevage', format: 'FAO' },
];

// --- COMPOSANT MODALE : DÉTAIL DEMANDE ---
const RequestModal = ({ request, onClose, onAction }) => {
    if (!request) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Building size={20} className="text-emerald-600"/> {request.org}
                        </h2>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="bg-white border border-gray-200 px-2 py-0.5 rounded text-xs font-bold uppercase">{request.type}</span>
                            <span className="flex items-center gap-1"><Mail size={12}/> {request.email}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Motif</h3>
                        <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm border border-gray-100">{request.reason}</div>
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Pièces Jointes</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {request.files.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-emerald-400 hover:bg-emerald-50 transition cursor-pointer group">
                                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center"><FileText size={20}/></div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-sm font-bold text-gray-700 truncate">{file}</div>
                                        <div className="text-xs text-gray-400">PDF • Document</div>
                                    </div>
                                    <Download size={16} className="text-gray-400 group-hover:text-emerald-600"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={() => onAction(request.id, 'REJECTED')} className="px-4 py-2 text-red-600 font-bold text-sm hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100">Refuser</button>
                    <button onClick={() => onAction(request.id, 'APPROVED')} className="px-6 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center gap-2"><CheckCircle size={16}/> Valider</button>
                </div>
            </div>
        </div>
    );
};

// --- MODULE ETL CORRIGÉ (AVEC SÉLECTEUR) ---
const ETLModule = () => {
    const [status, setStatus] = useState('idle');
    const [logs, setLogs] = useState([]);
    
    // NOUVEAUX ÉTATS POUR LA SÉLECTION
    const [selectedModel, setSelectedModel] = useState('');
    const [file, setFile] = useState(null);
    const [period, setPeriod] = useState('');

    const runSimulation = () => {
        if (!selectedModel || !file) return;

        setStatus('processing');
        setLogs([]);
        
        // Simulation des logs basés sur le modèle choisi
        const modelName = etlModels.find(m => m.id === selectedModel)?.label;
        const steps = [
            `Initialisation du pipeline v2.4...`,
            `Chargement du schéma SQL: ${selectedModel}...`,
            `Analyse du fichier: "${file.name}"...`,
            `Vérification de la période: ${period || 'Non spécifiée'}...`,
            `Nettoyage des colonnes (Strip whitespace)...`,
            `Validation des types de données (Domaine: ${modelName})...`,
            `Détection d'anomalies : 0 trouvé.`,
            `Insertion en base de données...`,
            `Génération du fichier de sortie...`
        ];
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                setLogs(prev => [...prev, step]);
                if(index === steps.length -1) setStatus('done');
            }, index * 800);
        });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Colonne Gauche : Configuration */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    {/* Décoration d'arrière-plan */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-50"></div>

                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                        <Database className="text-emerald-600"/> Configuration de l'Ingestion
                    </h3>
                    
                    {/* ZONE DE SÉLECTION (CORRIGÉE) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Modèle de Données (SQL)</label>
                            <div className="relative">
                                <select 
                                    value={selectedModel}
                                    onChange={(e) => setSelectedModel(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium appearance-none cursor-pointer"
                                    disabled={status === 'processing'}
                                >
                                    <option value="">-- Choisir un domaine --</option>
                                    {etlModels.map(model => (
                                        <option key={model.id} value={model.id}>{model.label}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                            </div>
                            {selectedModel && (
                                <div className="mt-2 text-xs text-emerald-600 font-medium">
                                    Format attendu : {etlModels.find(m => m.id === selectedModel).format}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">2. Période de Référence</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                                <input 
                                    type="month" 
                                    value={period}
                                    onChange={(e) => setPeriod(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                    disabled={status === 'processing'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ZONE D'UPLOAD */}
                    <div className="relative z-10">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">3. Fichier Source</label>
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer group ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'}`}>
                            <input 
                                type="file" 
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden" 
                                id="etl-upload"
                                accept=".csv,.xlsx"
                                disabled={status === 'processing'}
                            />
                            <label htmlFor="etl-upload" className="cursor-pointer w-full h-full block">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 group-hover:scale-110'}`}>
                                    {file ? <FileSpreadsheet size={28}/> : <UploadCloud size={28}/>}
                                </div>
                                <h4 className="font-bold text-gray-900">{file ? file.name : "Glisser-déposer ou cliquer"}</h4>
                                <p className="text-xs text-gray-500 mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supporte .XLSX, .CSV (Format CEMAC)"}</p>
                            </label>
                        </div>
                    </div>

                    {/* BOUTON ACTION */}
                    <button 
                        onClick={runSimulation}
                        disabled={status === 'processing' || !file || !selectedModel}
                        className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                            status === 'processing' || !file || !selectedModel
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                        }`}
                    >
                        {status === 'processing' ? <Activity className="animate-spin"/> : <Settings/>} 
                        {status === 'processing' ? 'Traitement en cours...' : 'Lancer le Pipeline ETL'}
                    </button>
                </div>

                {/* ALERTE INFO (Statique) */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                    <Activity className="text-blue-600 flex-shrink-0 mt-0.5" size={18}/>
                    <div className="text-sm text-blue-800">
                        <strong className="block mb-1">Standardisation Automatique</strong>
                        Le système convertira automatiquement les dates au format ISO-8601 et rejettera les lignes doublons selon le modèle choisi.
                    </div>
                </div>
            </div>

            {/* Colonne Droite : Logs & Résultat */}
            <div className="space-y-6">
                <div className="bg-gray-900 text-gray-300 p-5 rounded-2xl font-mono text-xs h-[500px] flex flex-col shadow-xl border border-gray-800">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-gray-500 ml-2 font-bold">etl-worker.log</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {logs.length === 0 && <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-50">
                            <Activity size={32} className="mb-2"/>
                            <span>En attente de job...</span>
                        </div>}
                        {logs.map((log, i) => (
                            <div key={i} className="animate-in fade-in slide-in-from-left-2 break-all">
                                <span className="text-emerald-500 mr-2">➜</span> {log}
                            </div>
                        ))}
                        {status === 'done' && <div className="text-emerald-400 font-bold mt-4 border-t border-gray-800 pt-2">PROCESS COMPLETED SUCCESSFULLY.</div>}
                    </div>
                </div>

                {status === 'done' && (
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between animate-in zoom-in shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle size={20}/></div>
                            <div>
                                <div className="font-bold text-emerald-900 text-sm">Données validées</div>
                                <div className="text-xs text-emerald-700">Prêt pour publication API</div>
                            </div>
                        </div>
                        <button className="p-2 bg-white rounded-lg text-emerald-700 hover:text-emerald-900 shadow-sm border border-emerald-100">
                            <Download size={18}/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- DASHBOARD PRINCIPAL ---
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [requestList, setRequestList] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleRequestAction = (id, newStatus) => {
    setRequestList(prev => prev.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
    ));
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
                <span className="font-extrabold text-xl tracking-tight text-gray-900">HISWACA<span className="text-emerald-600">.io</span></span>
            </div>
            <div className="hidden md:flex bg-gray-100/50 p-1 rounded-xl">
                {['Overview', 'ETL Pipeline', 'Requests'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                            activeTab === tab.toLowerCase().split(' ')[0]
                            ? 'bg-white text-emerald-700 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">JD</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        
        {/* VIEW: OVERVIEW */}
        {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase">Utilisateurs</div>
                        <div className="text-2xl font-bold">1,240</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase">Données (TB)</div>
                        <div className="text-2xl font-bold">4.2</div>
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase">API Calls</div>
                        <div className="text-2xl font-bold text-emerald-600">98%</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <div className="text-xs font-bold text-gray-400 uppercase">En attente</div>
                         <div className="text-2xl font-bold text-orange-500">{requestList.filter(r => r.status === 'PENDING').length}</div>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-[350px]">
                    <h3 className="font-bold mb-4">Activité de la Plateforme</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#9ca3af'}}/>
                            <YAxis axisLine={false} tickLine={false} tick={{fill:'#9ca3af'}}/>
                            <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}/>
                            <Bar dataKey="uploads" fill="#10b981" radius={[4,4,0,0]} barSize={40} name="Imports"/>
                            <Bar dataKey="requests" fill="#3b82f6" radius={[4,4,0,0]} barSize={40} name="Demandes"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )}

        {/* VIEW: ETL PIPELINE (CORRIGÉ) */}
        {activeTab === 'etl' && <ETLModule />}

        {/* VIEW: REQUESTS */}
        {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Demandes en attente</h3>
                        <p className="text-sm text-gray-500">Validez les partenaires pour l'accès API.</p>
                    </div>
                    <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {requestList.filter(r => r.status === 'PENDING').length} Nouvelles
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Organisation</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Statut</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requestList.map((req) => (
                            <tr key={req.id} className="hover:bg-gray-50/80 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                            {req.org.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{req.org}</div>
                                            <div className="text-xs text-gray-500">{req.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{req.date}</td>
                                <td className="px-6 py-4">
                                    {req.status === 'PENDING' ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> En attente
                                        </span>
                                    ) : req.status === 'APPROVED' ? (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Validé</span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Rejeté</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => setSelectedRequest(req)}
                                        className="text-gray-400 hover:text-emerald-600 font-bold text-sm flex items-center gap-1 ml-auto transition hover:bg-emerald-50 px-3 py-1.5 rounded-lg"
                                    >
                                        Examiner <ArrowUpRight size={16}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </main>

      {/* MODALE (En dehors du flux principal pour le z-index) */}
      {selectedRequest && (
        <RequestModal 
            request={selectedRequest} 
            onClose={() => setSelectedRequest(null)} 
            onAction={handleRequestAction}
        />
      )}

    </div>
  );
};

export default AdminDashboard;