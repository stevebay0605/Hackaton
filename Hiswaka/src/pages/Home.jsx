import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BarChart3, Database, Globe,
  Layers, Users, TrendingUp, Sparkles
} from 'lucide-react';

const Home = () => {
  return (
    <div className="animate-in fade-in duration-700">

      {/* --- HERO SECTION ASYMÉTRIQUE --- */}
      <section className="pt-16 pb-24 md:pt-28 md:pb-32 overflow-hidden relative">
        {/* Motif de fond subtil */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)`,
            color: '#4ba320'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Colonne Texte */}
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4ba320]/10 border border-[#4ba320]/20 text-[#4ba320] rounded-full text-xs font-bold mb-6 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Données Officielles</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-display font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                L'avenir du Congo s'écrit en{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ba320] to-[#2d6713] relative inline-block">
                  chiffres.
                  <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#eee40d] opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed font-body">
                La plateforme de référence pour l'harmonisation statistique en Afrique Centrale.
                <span className="font-semibold text-gray-800"> Fiabilité, transparence et accessibilité.</span>
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/donnees"
                  className="group flex items-center gap-2 bg-[#4ba320] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#3d8a1a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
                >
                  Explorer le Portail
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/demande"
                  className="flex items-center gap-2 bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-[#4ba320] hover:bg-gray-50 transition-all"
                >
                  Devenir Partenaire
                </Link>
              </div>
            </div>

            {/* Colonne Visuelle (Abstraite) */}
            <div className="lg:w-1/2 relative">
               <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                  {/* Cercles décoratifs */}
                  <div className="absolute inset-0 border-2 border-gray-200 rounded-full opacity-40"></div>
                  <div className="absolute inset-12 border-2 border-gray-300 rounded-full opacity-30 border-dashed animate-[spin_60s_linear_infinite]"></div>

                  {/* Carte Flottante 1 - Croissance PIB */}
                  <div className="absolute top-10 right-0 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-52 animate-[bounce_4s_ease-in-out_infinite] hover:scale-105 transition-transform">
                      <div className="text-xs text-gray-400 uppercase font-bold mb-2 tracking-wider">Croissance PIB</div>
                      <div className="text-4xl font-bold text-[#4ba320]">+4.2%</div>
                      <div className="h-2 w-full bg-gray-100 mt-3 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-gradient-to-r from-[#4ba320] to-[#2d6713] rounded-full"></div>
                      </div>
                  </div>

                  {/* Carte Flottante 2 - Démographie */}
                  <div className="absolute bottom-20 left-0 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 w-56 animate-[bounce_5s_ease-in-out_infinite] hover:scale-105 transition-transform" style={{animationDelay: '0.7s'}}>
                      <div className="flex items-center gap-3 mb-3">
                          <div className="bg-[#eee40d]/20 p-2.5 rounded-lg text-[#eee40d]">
                            <Users size={20}/>
                          </div>
                          <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">Démographie</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">5.8 Millions</div>
                      <div className="text-xs text-gray-500 mt-1">Population 2024</div>
                  </div>

                  {/* Logo Central Abstrait */}
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-gray-700 rounded-3xl rotate-12 flex items-center justify-center shadow-2xl hover:rotate-6 transition-transform duration-300">
                           <BarChart3 className="text-white w-16 h-16" />
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION CARTES PILIERS --- */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                  <div className="inline-block mb-3">
                    <span className="text-sm font-bold text-[#4ba320] uppercase tracking-wider">Notre Mission</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold text-gray-900 mb-3">Piliers Stratégiques</h2>
                  <div className="w-24 h-2 bg-gradient-to-r from-[#eee40d] to-[#eee40d]/50 rounded-full"></div>
              </div>
              <p className="text-gray-600 max-w-md mt-6 md:mt-0 md:text-right font-body leading-relaxed">
                  Une approche systémique pour transformer la donnée brute en intelligence publique.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                  icon={<Database className="text-[#4ba320]" />}
                  title="Collecte & Stockage"
                  desc="Architecture centralisée pour la sécurisation du patrimoine statistique national."
                  stat="100% Digitalisé"
                  color="green"
                  linkTo="/donnees"
              />
              <FeatureCard
                  icon={<Globe className="text-[#eee40d]" />}
                  title="Harmonisation"
                  desc="Alignement sur les standards internationaux (SNA 2008) et régionaux (CEMAC)."
                  stat="12 Pays membres"
                  color="yellow"
                  linkTo="/projets"
              />
              <FeatureCard
                  icon={<Layers className="text-[#e41e12]" />}
                  title="Diffusion Open Data"
                  desc="Portail accessible au public, chercheurs et investisseurs en temps réel."
                  stat="API Disponible"
                  color="red"
                  linkTo="/donnees"
              />
          </div>
        </div>
      </section>

      {/* --- STATS STRIP "TICKER" --- */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          {/* Accents de couleur */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#4ba320] rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#eee40d] rounded-full blur-3xl opacity-10"></div>

          <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <StatItem label="Population" value="5.8M" trend="+2.4%" />
                  <StatItem label="Projets Actifs" value="14" color="text-[#eee40d]" />
                  <StatItem label="Publications" value="340+" />
                  <StatItem label="Année Ref." value="2024" color="text-[#4ba320]" />
              </div>
          </div>
      </section>

      {/* --- SECTION CTA --- */}
      <section className="py-20 bg-gradient-to-br from-[#4ba320] to-[#2d6713] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Prêt à contribuer au développement ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto font-body">
            Rejoignez le réseau des partenaires statistiques et accédez aux micro-données certifiées.
          </p>
          <Link
            to="/demande"
            className="inline-flex items-center gap-3 bg-white text-[#4ba320] px-10 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Soumettre une demande
            <ArrowRight className="w-6 h-6" />
          </Link>
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
        green: {
          bg: "bg-[#4ba320]/10",
          text: "text-[#4ba320]",
          hoverBg: "group-hover:bg-[#4ba320]",
          border: "border-[#4ba320]/20",
          accent: "text-[#4ba320]"
        },
        yellow: {
          bg: "bg-[#eee40d]/10",
          text: "text-[#eee40d]",
          hoverBg: "group-hover:bg-[#eee40d]",
          border: "border-[#eee40d]/20",
          accent: "text-[#eee40d]"
        },
        red: {
          bg: "bg-[#e41e12]/10",
          text: "text-[#e41e12]",
          hoverBg: "group-hover:bg-[#e41e12]",
          border: "border-[#e41e12]/20",
          accent: "text-[#e41e12]"
        },
    };

    const colors = colorClasses[color];

    return (
        <Link
            to={linkTo}
            className="group relative bg-white rounded-2xl border-2 border-gray-200 p-8 pt-10 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden block"
        >
            <div className={`absolute top-0 left-8 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-b-lg ${colors.bg} ${colors.text} ${colors.border} border-t-0 border-2`}>
                Priorité
            </div>

            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 border-2 ${colors.bg} ${colors.text} ${colors.hoverBg} group-hover:text-white ${colors.border} group-hover:scale-110`}>
                {icon}
            </div>

            <h3 className="text-xl font-display font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed font-body">{desc}</p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Indicateur</div>
                <div className={`flex items-center gap-2 font-bold text-gray-800`}>
                    <TrendingUp size={16} className={colors.accent} />
                    <span>{stat}</span>
                </div>
            </div>

            {/* Accent décoratif */}
            <div className={`absolute -right-8 -bottom-8 w-24 h-24 ${colors.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        </Link>
    );
};

const StatItem = ({ label, value, trend, color = "text-white" }) => (
    <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all">
        <div className={`text-4xl md:text-5xl font-display font-bold mb-2 ${color}`}>{value}</div>
        <div className="text-xs text-gray-300 uppercase tracking-widest font-medium mb-2">{label}</div>
        {trend && (
          <div className="flex items-center gap-1 text-xs text-[#4ba320] bg-[#4ba320]/20 px-3 py-1 rounded-full font-bold">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
    </div>
);

export default Home;
