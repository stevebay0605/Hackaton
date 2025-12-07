import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const RequestModal = ({ request, onClose, onAction }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [action, setAction] = useState(null); // 'approve', 'reject', null

  const handleApprove = async () => {
    if (!username || !password) {
      setError('Veuillez remplir le nom d\'utilisateur et le mot de passe');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/requests/${request.id}/approve/`, {
        username,
        password
      });

      setSuccess('Demande approuvée avec succès ! Compte créé.');
      setTimeout(() => {
        onAction(request.id, 'APPROVED');
        onClose();
      }, 2000);
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

      setSuccess('Demande rejetée avec succès.');
      setTimeout(() => {
        onAction(request.id, 'REJECTED');
        onClose();
      }, 2000);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Détails de la Demande</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-bold text-red-900">Erreur</div>
                <div className="text-sm text-red-700 mt-1">{error}</div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="font-bold text-green-900">Succès</div>
                <div className="text-sm text-green-700 mt-1">{success}</div>
              </div>
            </div>
          )}

          {/* Informations */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom Complet</label>
              <div className="text-gray-900 font-semibold">{request.requester_full_name}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
              <div className="text-gray-900 font-semibold">{request.requester_email}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
              <div className="text-gray-900 font-semibold">{request.requester_phone || 'N/A'}</div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Organisation</label>
              <div className="text-gray-900 font-semibold">{request.organization_name}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Adresse</label>
            <div className="text-gray-900">{request.organization_address || 'N/A'}</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Motivation</label>
            <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.motivation}</div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Statut Actuel</label>
            <div className="inline-block">
              {request.status === 'PENDING' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span> En attente
                </span>
              ) : request.status === 'APPROVED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Approuvée
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-700">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Rejetée
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
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

          {/* Formulaire Approbation */}
          {action === 'approve' && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-900">Créer un Compte</h3>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nom d'utilisateur *</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: jean.dupont"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 caractères"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  disabled={loading}
                />
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

          {/* Formulaire Rejet */}
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
                  Confirmer le Rejet
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

export default RequestModal;
