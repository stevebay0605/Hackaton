import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Database, ArrowRight,User ,LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
    const { user, logout } = useAuth(); // Utiliser le context

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 relative selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      
      {/* TEXTURE DE FOND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* HEADER */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm fixed w-full z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-emerald-800 rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
                <div className="absolute w-full h-1/3 bg-yellow-400 bottom-0 rotate-12 scale-150 translate-y-2"></div>
                <div className="absolute w-1/3 h-full bg-red-600 right-0 top-0"></div>
                <span className="relative z-10 text-white font-bold text-lg">H</span>
            </div>
            <div className="leading-tight">
              <div className="font-bold text-xl tracking-tight text-gray-900">HISWACA</div>
              <div className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">DataHub Congo</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { path: '/', label: 'Accueil' },
              { path: '/donnees', label: 'Données' },
              { path: '/projets', label: 'Projets' },
              { path: '/ressources', label: 'Ressources' },
            ].map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
             {/* <Link to="/admin" className="text-sm font-medium text-gray-500 hover:text-emerald-700">Admin</Link> */}
             <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-emerald-700">Connexion</Link>
             <Link to="/demande" className="text-sm font-medium text-gray-500 hover:text-emerald-700">Demande</Link>
             <Link to="/donnees" className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700 transition shadow-lg">
                <Database size={16} /> Portail
             </Link>
             
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu (Simplifié) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 flex flex-col space-y-2 shadow-xl absolute w-full z-50">
             {/* <Link to="/donnees" onClick={() => setIsMenuOpen(false)} className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 font-medium">Données</Link> */}
             {/* ... autres liens ... */}
          </div>
        )}
      </header>
                <div className="hidden md:flex items-center gap-3">
             
             {user ? (
                 <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-2 py-1.5 rounded-full border border-gray-200">
                    <div className="flex flex-col text-right leading-tight">
                        <span className="text-xs font-bold text-gray-900">{user.name}</span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase">{user.organization}</span>
                    </div>
                    <button onClick={logout} className="p-2 bg-white rounded-full text-gray-500 hover:text-red-500 shadow-sm transition" title="Déconnexion">
                        <LogOut size={14} />
                    </button>
                 </div>
             ) : (
                 <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-emerald-700 transition">
                    Connexion Partenaire
                 </Link>
             )}

             <Link to="/donnees" className="...">...</Link>
          </div>


      {/* CONTENU PRINCIPAL */}
      <main className="relative z-10 pt-20 flex-grow">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-16 pb-8 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 flex">
            <div className="w-1/3 bg-emerald-600"></div>
            <div className="w-1/3 bg-yellow-400"></div>
            <div className="w-1/3 bg-red-600"></div>
        </div>
        <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">&copy; 2025 HISWACA Congo - Banque Mondiale.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;