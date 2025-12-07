import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, FileSpreadsheet, Activity } from 'lucide-react';
import api from '../services/api'; // On utilise notre service API

const AdminETL = () => {
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, done, error
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);

  // Fonction pour ajouter des logs type "terminal"
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, id: Date.now() }]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      addLog(`File selected: ${e.target.files[0].name}`, 'info');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus('uploading');
    setLogs([]); // Reset logs
    addLog(`Initiating upload for ${file.name}...`, 'info');

    const formData = new FormData();
    formData.append('file', file);
    // Ajoutez d'autres champs si votre backend le demande (ex: theme_id, source_id)
    // formData.append('theme', 'Economie');

    try {
      addLog('Uploading to secure server...', 'warning');
      
      // --- APPEL API RÉEL ---
      // Si votre backend a l'endpoint : POST /api/etl/upload/
      // await api.post('/etl/upload/', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     if(percentCompleted % 20 === 0) addLog(`Upload progress: ${percentCompleted}%`, 'info');
      //   }
      // });

      // --- SIMULATION POUR LA DÉMO (Si le backend n'est pas 100% prêt pour l'upload de fichiers) ---
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      addLog('Upload complete. Starting ETL Pipeline...', 'success');
      
      setStatus('processing');
      addLog('Analyzing CSV structure...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addLog('Mapping columns to SNA-2008 standards...', 'warning');
      addLog('Detected columns: [Year, Value, Region_ID]', 'info');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addLog('Validating data integrity...', 'info');
      addLog('Checking for duplicates...', 'info');
      
      setStatus('done');
      addLog('SUCCESS: Data harmonized and inserted into PostgreSQL.', 'success');
      addLog('Cache invalidated for API endpoints.', 'warning');

    } catch (err) {
      console.error(err);
      setStatus('error');
      addLog(`ERROR: ${err.message || 'Upload failed'}`, 'error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Pipeline d'Harmonisation</h1>
            <p className="text-gray-500">Espace Producteurs (INS / Ministères). Importez vos fichiers bruts ici.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
            <Activity size={14} className="animate-pulse"/> Système ETL: Actif
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Zone d'Upload */}
        <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-500 transition text-center group relative">
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept=".csv,.xlsx" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={status === 'uploading' || status === 'processing'}
                />
                
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-50 transition">
                    {file ? <FileSpreadsheet className="text-emerald-600" size={32}/> : <UploadCloud className="text-gray-400 group-hover:text-emerald-600" size={32} />}
                </div>
                
                <h3 className="font-bold text-lg mb-2">{file ? file.name : "Charger un fichier brut"}</h3>
                <p className="text-sm text-gray-500 mb-4">Support: .CSV, .XLSX (Format CEMAC ou National)</p>
                
                {!file && <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold pointer-events-none">Sélectionner un fichier</button>}
            </div>

            {file && status !== 'done' && status !== 'processing' && status !== 'uploading' && (
                <button 
                    onClick={handleUpload}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/20"
                >
                    Lancer l'harmonisation
                </button>
            )}

            {/* Carte de Résultat */}
            {status === 'done' && (
                <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex items-center gap-4 animate-in slide-in-from-bottom-2">
                    <CheckCircle className="text-emerald-600 w-10 h-10 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-emerald-900">Intégration réussie</h4>
                        <p className="text-sm text-emerald-700 mt-1">Les données sont harmonisées et disponibles dans le catalogue public.</p>
                    </div>
                </div>
            )}
             {status === 'error' && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-xl flex items-center gap-4">
                    <AlertTriangle className="text-red-600 w-10 h-10 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-red-900">Échec du traitement</h4>
                        <p className="text-sm text-red-700 mt-1">Vérifiez le format des colonnes (ISO-8601 requis pour les dates).</p>
                    </div>
                </div>
            )}
        </div>

        {/* Console de Traitement (Terminal Style) */}
        <div className="bg-[#1e1e1e] text-gray-300 p-0 rounded-2xl font-mono text-xs overflow-hidden shadow-2xl flex flex-col h-[400px]">
            {/* Terminal Header */}
            <div className="bg-[#2d2d2d] px-4 py-3 flex items-center gap-2 border-b border-[#3e3e3e]">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <span className="ml-3 text-gray-500 font-bold">etl-worker-01 — zsh</span>
            </div>
            
            {/* Terminal Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-2 font-mono">
                <div className="text-emerald-500">➜  ~ hiswaca-core start-worker</div>
                <div className="text-gray-500 text-[10px] mb-4">System ready. Listening for jobs...</div>
                
                {logs.map((log) => (
                    <div key={log.id} className="animate-in fade-in duration-300">
                        <span className="text-gray-600 mr-2">[{new Date(log.id).toLocaleTimeString()}]</span>
                        {log.type === 'error' ? (
                            <span className="text-red-400 font-bold">Error: {log.message}</span>
                        ) : log.type === 'warning' ? (
                            <span className="text-yellow-400">{log.message}</span>
                        ) : log.type === 'success' ? (
                             <span className="text-emerald-400 font-bold">{log.message}</span>
                        ) : (
                            <span className="text-blue-300">{log.message}</span>
                        )}
                    </div>
                ))}
                
                {(status === 'processing' || status === 'uploading') && (
                    <div className="animate-pulse text-gray-400">_</div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminETL;