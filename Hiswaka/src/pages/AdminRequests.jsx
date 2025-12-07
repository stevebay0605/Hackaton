import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, FileText, Download, Building, Calendar, Search } from 'lucide-react';
import api from '../services/api';

const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null); // Pour la modale de détail
  const [filter, setFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED

  // Simulation chargement données (Remplacer par API réelle)
  useEffect(() => {
    // api.get('/requests/list/').then(res => setRequests(res.data));
    
    // MOCK DATA pour l'exemple
    setRequests([
        { id: 1, name: "Dr. Jean Malonga", org: "OMS Congo", date: "2024-12-06", status: "PENDING", reason: "Analyse mortalité infantile", email: "jean@oms.org" },
        { id: 2, name: "Marie Ngouabi", org: "Université Marien Ngouabi", date: "2024-12-05", status: "PENDING", reason: "Thèse doctorale économie", email: "marie.n@umng.cg" },
        { id: 3, name: "Pierre Dubois", org: "Banque Mondiale", date: "2024-12-01", status: "APPROVED", reason: "Suivi projet PND", email: "pdubois@worldbank.org" },
    ]);
  }, []);

  const handleAction = async (id, action) => {
    try {
        // action = 'approve' ou 'reject'
        // await api.post(`/requests/${id}/${action}/`);
        
        // Mise à jour locale optimiste
        setRequests(prev => prev.map(req => 
            req.id === id ? { ...req, status: action === 'approve' ? 'APPROVED' : 'REJECTED' } : req
        ));
        setSelectedRequest(null);
        alert(`Demande ${action === 'approve' ? 'Approuvée' : 'Rejetée'}. Un email a été envoyé.`);
    } catch (err) {
        console.error(err);
    }
  };

  const filteredRequests = requests.filter(r => r.status === filter);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Demandes d'Accès</h1>
                <p className="text-gray-500">Validez les accréditations des partenaires institutionnels.</p>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-lg">
                {['PENDING', 'APPROVED', 'REJECTED'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition ${filter === f ? 'bg-white shadow text-emerald-800' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {f === 'PENDING' ? 'En attente' : f === 'APPROVED' ? 'Validées' : 'Rejetées'}
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                        <th className="p-4">Organisation / Demandeur</th>
                        <th className="p-4">Date demande</th>
                        <th className="p-4">Motif</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredRequests.map(req => (
                        <tr key={req.id} className="hover:bg-gray-50 transition">
                            <td className="p-4">
                                <div className="font-bold text-gray-900">{req.org}</div>
                                <div className="text-sm text-gray-500">{req.name}</div>
                            </td>
                            <td className="p-4 text-sm text-gray-500 flex items-center gap-2">
                                <Calendar size={14}/> {req.date}
                            </td>
                            <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                {req.reason}
                            </td>
                            <td className="p-4 text-right">
                                <button onClick={() => setSelectedRequest(req)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg font-bold text-sm inline-flex items-center gap-1">
                                    <Eye size={16}/> Examiner
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredRequests.length === 0 && (
                        <tr><td colSpan="4" className="p-8 text-center text-gray-400">Aucune demande dans cette catégorie.</td></tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* MODALE DE DETAIL */}
        {selectedRequest && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Détail de la demande #{selectedRequest.id}</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Building size={14}/> {selectedRequest.org} • {selectedRequest.email}
                            </div>
                        </div>
                        <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
                    </div>
                    
                    <div className="p-6 space-y-6 bg-gray-50/50">
                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Motivation</h4>
                            <p className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 text-sm leading-relaxed">
                                {selectedRequest.reason} <br/>
                                (Lorem ipsum dolor sit amet, description détaillée du projet de recherche...)
                            </p>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">Pièces Jointes</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 cursor-pointer hover:border-emerald-500 transition">
                                    <div className="bg-red-50 text-red-600 p-2 rounded"><FileText size={20}/></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold truncate">Lettre_Officielle.pdf</div>
                                        <div className="text-xs text-gray-400">2.4 MB</div>
                                    </div>
                                    <Download size={16} className="text-gray-400"/>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3 cursor-pointer hover:border-emerald-500 transition">
                                    <div className="bg-blue-50 text-blue-600 p-2 rounded"><FileText size={20}/></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold truncate">Identite_Scan.jpg</div>
                                        <div className="text-xs text-gray-400">1.1 MB</div>
                                    </div>
                                    <Download size={16} className="text-gray-400"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
                        {selectedRequest.status === 'PENDING' && (
                            <>
                                <button 
                                    onClick={() => handleAction(selectedRequest.id, 'reject')}
                                    className="px-4 py-2 border border-red-200 text-red-700 rounded-lg font-bold hover:bg-red-50 flex items-center gap-2"
                                >
                                    <XCircle size={18}/> Rejeter
                                </button>
                                <button 
                                    onClick={() => handleAction(selectedRequest.id, 'approve')}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-200"
                                >
                                    <CheckCircle size={18}/> Valider & Créer Compte
                                </button>
                            </>
                        )}
                        {selectedRequest.status !== 'PENDING' && (
                            <div className="text-sm text-gray-500 italic flex items-center">
                                Cette demande a déjà été traitée.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminRequests;