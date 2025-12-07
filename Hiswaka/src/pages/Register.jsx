import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowRight, Building2, User, Mail, Lock, Loader2 } from 'lucide-react';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    organization: '', // Champ spécifique pour crédibiliser le profil "Pro"
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Appel à l'API Django
      // Assurez-vous que votre Serializer Django accepte ces champs
      await api.post('/auth/register/', formData);
      
      // Si succès, redirection vers le login avec un message (optionnel)
      navigate('/login', { state: { message: "Compte créé avec succès ! Connectez-vous." } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de l'inscription. Vérifiez vos données.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden pt-20">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 p-8 relative z-10 animate-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-700">
                <UserPlus size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Demande d'Accès Partenaire</h2>
            <p className="text-gray-500 text-sm mt-2">Rejoignez le réseau statistique national pour accéder aux micro-données.</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Prénom</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input name="first_name" type="text" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Jean"/>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Nom</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input name="last_name" type="text" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Dupont"/>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Organisation / Ministère</label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="organization" type="text" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="ex: Ministère de la Santé"/>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Email Professionnel</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="email" type="email" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="nom@institution.cg"/>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Mot de passe</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input name="password" type="password" required onChange={handleChange} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="••••••••"/>
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-800 text-white font-bold py-3 rounded-lg hover:bg-emerald-900 transition flex items-center justify-center gap-2 mt-6">
                {loading ? <Loader2 className="animate-spin" /> : <>Créer mon compte <ArrowRight size={18}/></>}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
            Déjà partenaire ? <Link to="/login" className="text-emerald-700 font-bold hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;