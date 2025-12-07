import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService, etlService } from '../services';
import api from '../services/api';
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
    { id: 1, code: 'SANTE_V2', label: 'Santé Publique (Morbidité/Mortalité)', format: 'OMS Standard' },
    { id: 2, code: 'ECO_IPC', label: 'Économie (Indice Prix Conso)', format: 'FMI/CEMAC' },
    { id: 3, code: 'DEMO_RGPH', label: 'Démographie (Recensement)', format: 'National' },
    { id: 4, code: 'AGRI_V1', label: 'Agriculture & Élevage', format: 'FAO' },
];

// --- COMPOSANT MODALE : DÉTAIL DEMANDE ---
const RequestModal = ({ request, onClose, onAction }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [action, setAction] = useState(null); // 'approve', 'reject', null
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!request) return null;

    // Générer un username basé sur le nom et l'email
    const generateUsername = () => {
        const name = request.requester_full_name.toLowerCase().replace(/\s+/g, '.');
        return name;
    };

    // Générer un mot de passe sécurisé
    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const username = generateUsername();
    const password = generatedPassword || generatePassword();

    // Simuler l'envoi d'email
    const simulateEmailSend = (email, user, pass) => {
        console.log('📧 EMAIL SIMULÉ');
        console.log('================');
        console.log(`À: ${email}`);
        console.log(`Sujet: Votre compte HISWACA a été créé`);
        console.log('');
        console.log(`Bonjour ${request.requester_full_name},`);
        console.log('');
        console.log('Votre demande d\'accès a été approuvée !');
        console.log('');
        console.log('Identifiants de connexion:');
        console.log(`- Nom d\'utilisateur: ${user}`);
        console.log(`- Mot de passe: ${pass}`);
        console.log('');
        console.log('Veuillez vous connecter et changer votre mot de passe dès que possible.');
        console.log('');
        console.log('Cordialement,');
        console.log('L\'équipe HISWACA');
        console.log('================');
        
        // Afficher une notification
        alert(`✅ Email simulé envoyé à ${email}\n\nVérifiez la console pour les détails.`);
    };

    const handleApprove = async () => {
        setLoading(true);
        setError(null);

        try {
            // Appel API avec le username et password générés
            const response = await api.post(`/requests/${request.id}/approve/`, {
                username,
                password
            });

            // Simuler l'envoi d'email
            simulateEmailSend(request.requester_email, username, password);

            setSuccess('Demande approuvée avec succès ! Compte créé et email envoyé.');
            setTimeout(() => {
                onAction(request.id, 'APPROVED');
                onClose();
            }, 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 
                            err.response?.data?.error ||
                            err.response?.data?.username?.[0] ||
                            'Erreur lors de l\'approbation';
            setError(errorMsg);
            console.error('Erreur approbation:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason) {
            setError('Veuillez entrer une raison de rejet');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.post(`/requests/${request.id}/reject/`, {
                rejection_reason: rejectionReason
            });

            // Simuler l'envoi d'email de rejet
            console.log('📧 EMAIL DE REJET SIMULÉ');
            console.log('================');
            console.log(`À: ${request.requester_email}`);
            console.log(`Sujet: Votre demande d\'accès HISWACA`);
            console.log('');
            console.log(`Bonjour ${request.requester_full_name},`);
            console.log('');
            console.log('Nous regrettons de vous informer que votre demande d\'accès a été rejetée.');
            console.log('');
            console.log(`Raison: ${rejectionReason}`);
            console.log('');
            console.log('Si vous avez des questions, veuillez nous contacter.');
            console.log('================');

            setSuccess('Demande rejetée avec succès et email envoyé.');
            setTimeout(() => {
                onAction(request.id, 'REJECTED');
                onClose();
            }, 3000);
        } catch (err) {
            const errorMsg = err.response?.data?.detail || 
                            err.response?.data?.error ||
                            'Erreur lors du rejet';
            setError(errorMsg);
            console.error('Erreur rejet:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50 sticky top-0">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Building size={20} className="text-emerald-600"/> {request.organization_name}
                        </h2>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Mail size={12}/> {request.requester_email}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-red-700">{error}</div>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-green-700">{success}</div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Informations</h3>
                        <div className="space-y-2 text-sm grid grid-cols-2 gap-4">
                            <div>
                                <strong>Nom:</strong> {request.requester_full_name}
                            </div>
                            <div>
                                <strong>Email:</strong> {request.requester_email}
                            </div>
                            <div>
                                <strong>Téléphone:</strong> {request.requester_phone || 'N/A'}
                            </div>
                            <div>
                                <strong>Date:</strong> {new Date(request.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">Motivation</h3>
                        <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm border border-gray-100">{request.motivation}</div>
                    </div>

                    {/* Documents fournis */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Documents Fournis</h3>
                        <div className="space-y-2">
                            {request.official_letter ? (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <FileText className="text-blue-600" size={20} />
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-blue-900">Lettre Officielle</div>
                                        <div className="text-xs text-blue-700">Document fourni par la structure</div>
                                    </div>
                                    <a 
                                        href={request.official_letter} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition"
                                    >
                                        Voir
                                    </a>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 italic">Aucune lettre officielle fournie</div>
                            )}

                            {request.supporting_documents ? (
                                <div className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                    <FileText className="text-purple-600" size={20} />
                                    <div className="flex-1">
                                        <div className="font-bold text-sm text-purple-900">Documents Justificatifs</div>
                                        <div className="text-xs text-purple-700">Documents supplémentaires</div>
                                    </div>
                                    <a 
                                        href={request.supporting_documents} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded hover:bg-purple-700 transition"
                                    >
                                        Voir
                                    </a>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 italic">Aucun document justificatif fourni</div>
                            )}
                        </div>
                    </div>

                    {request.status === 'PENDING' && !action && (
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => setAction('approve')}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                            >
                                Approuver
                            </button>
                            <button
                                onClick={() => setAction('reject')}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                            >
                                Rejeter
                            </button>
                        </div>
                    )}

                    {action === 'approve' && (
                        <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h3 className="font-bold text-green-900">Confirmation d'Approbation</h3>
                            
                            <div className="bg-white p-3 rounded-lg border border-green-200 space-y-2 text-sm">
                                <div>
                                    <label className="text-xs font-bold text-gray-600">Nom d'utilisateur (généré)</label>
                                    <div className="font-mono bg-gray-100 p-2 rounded mt-1 text-gray-900">{username}</div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-600">Mot de passe (généré)</label>
                                    <div className="font-mono bg-gray-100 p-2 rounded mt-1 text-gray-900 break-all">{password}</div>
                                    <p className="text-xs text-gray-600 mt-1">✉️ Cet identifiant sera envoyé par email à {request.requester_email}</p>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleApprove}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                                    Confirmer l'Approbation
                                </button>
                                <button
                                    onClick={() => setAction(null)}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 transition disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}

                    {action === 'reject' && (
                        <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
                            <h3 className="font-bold text-red-900">Rejeter la Demande</h3>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Raison du Rejet *</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Expliquez pourquoi cette demande est rejetée..."
                                    className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none h-24"
                                    disabled={loading}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={handleReject}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                                    Confirmer
                                </button>
                                <button
                                    onClick={() => setAction(null)}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-bold hover:bg-gray-300 transition disabled:opacity-50"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MODULE ETL COMPLET ---
const ETLModule = ({ uploads, onUploadSuccess }) => {
    const [status, setStatus] = useState('idle');
    const [logs, setLogs] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [file, setFile] = useState(null);
    const [period, setPeriod] = useState('');
    const [uploading, setUploading] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [outputFile, setOutputFile] = useState(null);

    const handleUpload = async () => {
        if (!selectedModel || !file) return;

        setStatus('processing');
        setLogs([]);
        setUploading(true);
        setOutputFile(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('file_format', file.name.endsWith('.csv') ? 'CSV' : 'EXCEL');
            // Envoyer l'ID numérique de la catégorie
            formData.append('category', selectedModel);
            // Envoyer la visibilité
            formData.append('visibility', isPublic ? 'PUBLIC' : 'PRIVATE');
            
            if (period) {
                formData.append('period', period);
            }

            // Logs de simulation
            const modelInfo = etlModels.find(m => m.id === parseInt(selectedModel));
            const modelName = modelInfo?.label || selectedModel;
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

            for (let i = 0; i < steps.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 600));
                setLogs(prev => [...prev, steps[i]]);
            }

            // Upload réel - envoyer directement avec api
            const response = await api.post('/etl/upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const result = response.data;
            setLogs(prev => [...prev, `✓ ${result.processed_rows || result.indicators_created || 0} indicateurs créés avec succès`]);
            
            // Récupérer le fichier de sortie
            if (result.output_file) {
                setOutputFile(result.output_file);
                setLogs(prev => [...prev, `✓ Fichier de sortie généré: ${result.output_file}`]);
            }
            
            setStatus('done');
            
            // Réinitialiser le formulaire après 30 secondes (ou manuellement)
            setTimeout(() => {
                setFile(null);
                setSelectedModel('');
                setPeriod('');
                setIsPublic(false);
                setStatus('idle');
                onUploadSuccess?.();
            }, 30000);
        } catch (err) {
            console.error('Erreur upload:', err);
            const errorMsg = err.response?.data?.error || err.response?.data?.detail || err.message;
            setLogs(prev => [...prev, `✗ Erreur: ${errorMsg}`]);
            setStatus('error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 opacity-50"></div>

                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                        <Database className="text-emerald-600"/> Configuration de l'Ingestion
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">1. Modèle de Données</label>
                            <select 
                                value={selectedModel}
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                disabled={uploading}
                            >
                                <option value="">-- Choisir un domaine --</option>
                                {etlModels.map(model => (
                                    <option key={model.id} value={model.id}>{model.label}</option>
                                ))}
                            </select>
                            {selectedModel && (
                                <div className="mt-2 text-xs text-emerald-600 font-medium">
                                    Format attendu : {etlModels.find(m => m.id === parseInt(selectedModel))?.format}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">2. Période</label>
                            <input 
                                type="month" 
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    <div className="relative z-10">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">3. Fichier Source</label>
                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer group ${file ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'}`}>
                            <input 
                                type="file" 
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden" 
                                id="etl-upload"
                                accept=".csv,.xlsx"
                                disabled={uploading}
                            />
                            <label htmlFor="etl-upload" className="cursor-pointer w-full h-full block">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 transition ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400 group-hover:scale-110'}`}>
                                    {file ? <FileSpreadsheet size={28}/> : <UploadCloud size={28}/>}
                                </div>
                                <h4 className="font-bold text-gray-900">{file ? file.name : "Glisser-déposer ou cliquer"}</h4>
                                <p className="text-xs text-gray-500 mt-1">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supporte .XLSX, .CSV"}</p>
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <input 
                            type="checkbox" 
                            id="visibility-toggle"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            disabled={uploading}
                            className="w-5 h-5 cursor-pointer accent-emerald-600"
                        />
                        <label htmlFor="visibility-toggle" className="cursor-pointer flex-1">
                            <span className="font-bold text-gray-900">Données publiques</span>
                            <p className="text-xs text-gray-600 mt-1">
                                {isPublic ? '✓ Ces données seront visibles à tous' : '🔒 Ces données seront privées'}
                            </p>
                        </label>
                    </div>

                    <button 
                        onClick={handleUpload}
                        disabled={uploading || !file || !selectedModel}
                        className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                            uploading || !file || !selectedModel
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                        }`}
                    >
                        {uploading ? <Loader2 className="animate-spin"/> : <Settings/>} 
                        {uploading ? 'Traitement en cours...' : 'Lancer le Pipeline ETL'}
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start">
                    <Activity className="text-blue-600 flex-shrink-0 mt-0.5" size={18}/>
                    <div className="text-sm text-blue-800">
                        <strong className="block mb-1">Standardisation Automatique</strong>
                        Le système convertira automatiquement les dates au format ISO-8601 et rejettera les lignes doublons.
                    </div>
                </div>
            </div>

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
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
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
                    <div className="space-y-3">
                        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between animate-in zoom-in shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle size={20}/></div>
                                <div>
                                    <div className="font-bold text-emerald-900 text-sm">Données validées</div>
                                    <div className="text-xs text-emerald-700">Prêt pour publication API</div>
                                </div>
                            </div>
                        </div>

                        {outputFile && (
                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between animate-in zoom-in shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Download size={20}/></div>
                                    <div>
                                        <div className="font-bold text-blue-900 text-sm">Fichier de résultats généré</div>
                                        <div className="text-xs text-blue-700">{outputFile}</div>
                                    </div>
                                </div>
                                <a 
                                    href={`${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}${outputFile}`}
                                    download={true}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition text-sm whitespace-nowrap"
                                >
                                    Télécharger
                                </a>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setFile(null);
                                setSelectedModel('');
                                setPeriod('');
                                setIsPublic(false);
                                setStatus('idle');
                                setOutputFile(null);
                                setLogs([]);
                            }}
                            className="w-full mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition"
                        >
                            Réinitialiser le formulaire
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- DASHBOARD PRINCIPAL ---
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [requestList, setRequestList] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [stats, setStats] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Charger les stats
        const statsData = await dashboardService.getStats();
        setStats(statsData);

        // Charger les uploads ETL
        const uploadsData = await etlService.getUploads();
        const uploadsList = uploadsData.results || uploadsData;
        setUploads(uploadsList);

        // Charger les indicateurs
        try {
          const indicatorsData = await api.get('/catalog/indicators/');
          setIndicators(indicatorsData.data.results || indicatorsData.data);
        } catch (err) {
          console.error('Erreur chargement indicateurs:', err);
        }

        // Charger les demandes d'accès
        try {
          const requestsData = await api.get('/requests/');
          setRequestList(requestsData.data.results || requestsData.data);
        } catch (err) {
          console.error('Erreur chargement demandes:', err);
        }

        // Générer les données d'activité
        const activity = [
          { name: 'Lun', uploads: 4, requests: 2 },
          { name: 'Mar', uploads: 7, requests: 5 },
          { name: 'Mer', uploads: 3, requests: 1 },
          { name: 'Jeu', uploads: 12, requests: 8 },
          { name: 'Ven', uploads: 9, requests: 3 },
          { name: 'Sam', uploads: 2, requests: 0 },
          { name: 'Dim', uploads: 1, requests: 1 },
        ];
        setActivityData(activity);

        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRequestAction = (id, newStatus) => {
    setRequestList(prev => prev.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
    ));
    setSelectedRequest(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-emerald-600" size={40} />
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

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
                {['Overview', 'ETL Pipeline', 'Indicateurs', 'Requests'].map((tab) => (
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
             <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
               {user?.first_name?.charAt(0) || 'A'}
             </div>
             <button
               onClick={handleLogout}
               className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-medium"
             >
               <LogOut size={16} />
               Déconnexion
             </button>
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
                        <div className="text-2xl font-bold">{stats?.users?.total || 0}</div>
                        <div className="text-xs text-gray-500 mt-1">{stats?.users?.admins || 0} admins</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase">Indicateurs</div>
                        <div className="text-2xl font-bold">{stats?.indicators?.total || 0}</div>
                        <div className="text-xs text-gray-500 mt-1">{stats?.indicators?.public || 0} publics</div>
                    </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase">Uploads ETL</div>
                        <div className="text-2xl font-bold text-emerald-600">{uploads.length}</div>
                        <div className="text-xs text-gray-500 mt-1">{uploads.filter(u => u.status === 'COMPLETED').length} complétés</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                         <div className="text-xs font-bold text-gray-400 uppercase">Demandes</div>
                         <div className="text-2xl font-bold text-orange-500">{stats?.access_requests?.pending || 0}</div>
                         <div className="text-xs text-gray-500 mt-1">en attente</div>
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

        {/* VIEW: ETL PIPELINE */}
        {activeTab === 'etl' && <ETLModule uploads={uploads} onUploadSuccess={() => {}} />}

        {/* VIEW: INDICATEURS */}
        {activeTab === 'indicateurs' && (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Gestion des Indicateurs</h2>
                        <p className="text-gray-500 mt-1">Créer, modifier ou supprimer les indicateurs</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/indicators')}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition flex items-center gap-2"
                    >
                        <Database size={20} /> Gérer les indicateurs
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 text-lg">Indicateurs créés ({indicators.length})</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Titre</th>
                                    <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Catégorie</th>
                                    <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Visibilité</th>
                                    <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Créé le</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {indicators.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            Aucun indicateur créé
                                        </td>
                                    </tr>
                                ) : (
                                    indicators.map((indicator) => (
                                        <tr key={indicator.id} className="hover:bg-gray-50/80 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 text-sm">{indicator.title}</div>
                                                <div className="text-xs text-gray-500 mt-1">{indicator.description?.substring(0, 50)}...</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {indicator.category?.name || indicator.category || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                                    indicator.visibility === 'PUBLIC'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {indicator.visibility || 'PRIVATE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                                {indicator.created_at ? new Date(indicator.created_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW: REQUESTS */}
        {activeTab === 'requests' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Demandes d'accès</h3>
                        <p className="text-sm text-gray-500">Validez les partenaires pour l'accès aux données.</p>
                    </div>
                    <div className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {requestList.filter(req => req.status === 'PENDING').length} En attente
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Organisation</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Contact</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Date</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase">Statut</th>
                            <th className="px-6 py-4 text-xs font-extrabold text-gray-400 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {requestList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                    Aucune demande pour le moment
                                </td>
                            </tr>
                        ) : (
                            requestList.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50/80 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                {(req.organization_name || req.org || '').substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{req.organization_name || req.org}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{req.requester_full_name || req.contact_person_name || req.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{new Date(req.created_at || req.date).toLocaleDateString()}</td>
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
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </main>

      {/* MODALE */}
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
