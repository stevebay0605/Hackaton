import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, BarChart3, FileText, Home } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Fonction pour vérifier si le lien est actif
  const isActive = (path) => location.pathname === path;

  // Classes communes
  const linkClasses = (path) => 
    `flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 font-body font-medium ${
      isActive(path) 
        ? 'text-hiswaca-green bg-green-50' 
        : 'text-gray-600 hover:text-hiswaca-green hover:bg-gray-50'
    }`;

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* LOGO AREA */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Simulation du Logo graphique (Triangle/Flèche) */}
              <div className="h-10 w-10 relative hidden sm:block">
                <div className="absolute h-full w-1/3 bg-hiswaca-green left-0 bottom-0 rounded-tl-full"></div>
                <div className="absolute h-2/3 w-1/3 bg-hiswaca-yellow left-1/3 bottom-0"></div>
                <div className="absolute h-full w-1 bg-hiswaca-red left-2/3 bottom-0"></div>
              </div>
              
              {/* Typographie Logo (Page 1 & 6) */}
              <div className="flex flex-col">
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-none">
                  <span className="text-hiswaca-green">HISWACA</span>
                  <span className="text-hiswaca-red ml-1">CONGO</span>
                </h1>
                <span className="text-[10px] sm:text-xs text-gray-500 font-body leading-tight hidden md:block">
                  Harmonizing Statistics in West & Central Africa
                </span>
              </div>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className={linkClasses('/')}>
              <Home size={18} /> Accueil
            </Link>
            <Link to="/donnees" className={linkClasses('/donnees')}>
              <BarChart3 size={18} /> Données
            </Link>
            <Link to="/rapports" className={linkClasses('/rapports')}>
              <FileText size={18} /> Rapports
            </Link>
          </nav>

          {/* ACTION BUTTONS */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/login"
              className="px-5 py-2.5 rounded text-sm font-bold text-gray-700 hover:bg-gray-100 transition font-body"
            >
              Connexion
            </Link>
            <Link 
              to="/register"
              className="px-5 py-2.5 rounded text-sm font-bold text-white bg-hiswaca-green hover:bg-opacity-90 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 font-body"
            >
              S'inscrire
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-hiswaca-green hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-hiswaca-green hover:bg-gray-50">
              Accueil
            </Link>
            <Link to="/donnees" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-hiswaca-green hover:bg-gray-50">
              Hub de Données
            </Link>
            <Link to="/rapports" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-hiswaca-green hover:bg-gray-50">
              Rapports & Documents
            </Link>
            <div className="pt-4 pb-2 border-t border-gray-100 mt-2">
              <Link to="/login" className="block w-full text-center px-4 py-2 text-gray-600 font-bold">
                Se connecter
              </Link>
              <Link to="/register" className="block w-full text-center px-4 py-2 mt-2 bg-hiswaca-green text-white rounded font-bold mx-auto w-11/12">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;