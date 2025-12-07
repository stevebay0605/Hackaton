import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, ShieldCheck, Loader2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      // Redirection selon le rôle
      if (result.user?.is_staff || result.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/donnees');
      }
    } else {
      setError(result.error || "Une erreur inattendue est survenue.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fond décoratif */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8 relative z-10 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-emerald-50">
                <Lock className="text-emerald-700" size={28} />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">Accès HISWACA Pro</h2>
            <p className="text-sm text-gray-500 mt-1">Connectez-vous pour accéder aux données <strong className="text-amber-600">RESTRICTED</strong>.</p>
        </div>

        {/* NOUVEAU: Affichage de l'erreur */}
        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-4 flex items-center gap-2 rounded-lg" role="alert">
                <XCircle size={20} className="flex-shrink-0" />
                <p className="font-medium text-sm">Échec de la connexion :</p>
                <p className="text-sm flex-grow">{error}</p>
            </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="ex: admin@ins.org"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="••••••••"
                    required
                />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-emerald-800 text-white font-bold py-3 rounded-lg hover:bg-emerald-900 transition flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Connexion Sécurisée <ArrowRight size={18}/></>}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-emerald-700 font-medium bg-emerald-50 py-2 rounded">
                <ShieldCheck size={14} className="text-emerald-600" /> Sécurité certifiée : Connexion HTTPS/JWT.
            </div>
            <p className="mt-4 text-sm text-gray-600">
                Pas encore de compte ? <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-900 underline">Créer un compte</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;