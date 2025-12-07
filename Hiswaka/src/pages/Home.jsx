import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, BarChart3, Database, Globe, 
  Layers, Users, TrendingUp 
} from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-in fade-in duration-700">
      
      {/* --- HERO SECTION ASYMÉTRIQUE --- */}
      <section className="pt-16 pb-24 md:pt-28 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            {/* Colonne Texte */}
            <div className="lg:w-1/2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-xs font-bold mb-6 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Données Officielles
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                L'avenir du Congo s'écrit en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800 relative">
                  chiffres.
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                La plateforme de référence pour l'harmonisation statistique en Afrique Centrale. Fiabilité, transparence et accessibilité.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/donnees" className="flex items-center gap-2 bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-800 transition shadow-[0_10px_20px_-10px_rgba(4,120,87,0.5)]">
                  Explorer le Portail <ArrowRight size={20} />
                </Link>
                <Link to="/projets" className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-gray-300 hover:bg-gray-50 transition">
                  Voir les Projets
                </Link>
              </div>
            </div>

            {/* Colonne Visuelle (Abstraite) */}
            <div className="lg:w-1/2 relative">
               <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                  {/* Cercles décoratifs */}
                  <div className="absolute inset-0 border border-gray-200 rounded-full opacity-50"></div>
                  <div className="absolute inset-12 border border-gray-200 rounded-full opacity-50 border-dashed animate-[spin_60s_linear_infinite]"></div>
                  
                  {/* Carte Flottante 1 */}
                  <div className="absolute top-10 right-0 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 w-48 animate-[bounce_4s_infinite]">
                      <div className="text-xs text-gray-400 uppercase font-bold mb-2">Croissance PIB</div>
                      <div className="text-3xl font-bold text-emerald-600">+4.2%</div>
                      <div className="h-1 w-full bg-gray-100 mt-2 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-emerald-500 rounded-full"></div>
                      </div>
                  </div>

                  {/* Carte Flottante 2 */}
                  <div className="absolute bottom-20 left-0 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 w-52 animate-[bounce_5s_infinite] delay-700">
                      <div className="flex items-center gap-3 mb-2">
                          <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600"><Users size={18}/></div>
                          <div className="text-xs text-gray-400 uppercase font-bold">Démographie</div>
                      </div>
                      <div className="text-xl font-bold text-gray-800">5.8 Millions</div>
                  </div>

                  {/* Logo Central Abstrait */}
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gray-900 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl">
                           <BarChart3 className="text-white w-16 h-16" />
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION CARTES --- */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Piliers Stratégiques</h2>
                  <div className="w-20 h-1.5 bg-yellow-400 rounded-full"></div>
              </div>
              <p className="text-gray-500 max-w-md mt-4 md:mt-0 text-right">
                  Une approche systémique pour transformer la donnée brute en intelligence publique.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                  icon={<Database className="text-emerald-600" />}
                  title="Collecte & Stockage"
                  desc="Architecture centralisée pour la sécurisation du patrimoine statistique national."
                  stat="100% Digitalisé"
                  color="emerald"
                  linkTo="/donnees"
              />
              <FeatureCard 
                  icon={<Globe className="text-yellow-600" />}
                  title="Harmonisation"
                  desc="Alignement sur les standards internationaux (SNA 2008) et régionaux (CEMAC)."
                  stat="12 Pays membres"
                  color="yellow"
                  linkTo="/projets"
              />
              <FeatureCard 
                  icon={<Layers className="text-red-600" />}
                  title="Diffusion Open Data"
                  desc="Portail accessible au public, chercheurs et investisseurs en temps réel."
                  stat="API Disponible"
                  color="red"
                  linkTo="/ressources"
              />
          </div>
        </div>
      </section>

      {/* --- STATS STRIP "TICKER" --- */}
      <section className="bg-gray-900 text-white py-12 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-800">
                  <StatItem label="Population" value="5.8M" trend="+2.4%" />
                  <StatItem label="Projets Actifs" value="14" color="text-yellow-400" />
                  <StatItem label="Publications" value="340+" />
                  <StatItem label="Année Ref." value="2024" color="text-emerald-400" />
              </div>
          </div>
      </section>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                          COMPOSANTS LOCAUX (UI)                            */
/* -------------------------------------------------------------------------- */

const FeatureCard = ({ icon, title, desc, stat, color, linkTo }) => {
    const colorClasses = {
        emerald: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white border-emerald-200",
        yellow: "bg-yellow-100 text-yellow-700 group-hover:bg-yellow-500 group-hover:text-white border-yellow-200",
        red: "bg-red-100 text-red-700 group-hover:bg-red-600 group-hover:text-white border-red-200",
    };

    return (
        <Link 
            to={linkTo}
            className="group relative bg-white rounded-xl border border-gray-200 p-6 pt-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden block"
        >
            <div className={`absolute top-0 left-6 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-b-md ${colorClasses[color].split(' ')[0]} ${colorClasses[color].split(' ')[1]}`}>
                Priorité
            </div>

            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 ${colorClasses[color]}`}>
                {icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">{desc}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase">Indicateur</div>
                <div className="flex items-center gap-2 font-bold text-gray-800">
                    <TrendingUp size={16} className={color === 'red' ? 'text-red-500' : color === 'yellow' ? 'text-yellow-500' : 'text-emerald-500'} />
                    {stat}
                </div>
            </div>
        </Link>
    );
};

const StatItem = ({ label, value, trend, color = "text-white" }) => (
    <div className="flex flex-col items-center justify-center p-4">
        <div className={`text-3xl md:text-4xl font-bold mb-1 ${color}`}>{value}</div>
        <div className="text-xs text-gray-400 uppercase tracking-widest font-medium mb-1">{label}</div>
        {trend && <div className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">{trend}</div>}
    </div>
);

export default Home;