import React from 'react';
import { Calendar, CheckCircle, Clock, Server, ClipboardList, Map as MapIcon } from 'lucide-react';

const projectsList = [
    {
        id: 1,
        title: "RGPH-5 (Recensement Général)",
        description: "Cinquième Recensement Général de la Population et de l'Habitation. Cartographie numérique complète du territoire.",
        progress: 65,
        status: "En cours",
        color: "emerald",
        icon: <MapIcon  className="text-emerald-600" />,
        date: "Fin prévue : Déc 2025"
    },
    {
        id: 2,
        title: "Enquête Harmonisée Conditions de Vie",
        description: "Collecte de données sur la pauvreté et les ménages selon les standards de la Banque Mondiale.",
        progress: 30,
        status: "Démarrage",
        color: "yellow",
        icon: <ClipboardList className="text-yellow-600" />,
        date: "Fin prévue : Juin 2026"
    },
    {
        id: 3,
        title: "Modernisation Data Center Brazzaville",
        description: "Construction de l'infrastructure serveur nationale et sécurisation physique des données.",
        progress: 90,
        status: "Finalisation",
        color: "blue",
        icon: <Server className="text-blue-600" />,
        date: "Livraison : Nov 2024"
    }
];

const Projects = () => {
  return (
    <div className="container mx-auto px-4 py-8 animate-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Suivi des Grands Chantiers</h1>
            <p className="text-gray-500 text-lg">
                État d'avancement des projets statistiques nationaux financés par HISWACA pour renforcer le système statistique du Congo.
            </p>
        </div>

        <div className="space-y-6">
            {projectsList.map((project) => (
                <div key={project.id} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 hover:shadow-lg transition duration-300 relative overflow-hidden group">
                    {/* Barre latérale colorée */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                        project.color === 'emerald' ? 'bg-emerald-500' : 
                        project.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-400'
                    }`}></div>

                    <div className="flex flex-col md:flex-row gap-6 md:items-center">
                        {/* Icone */}
                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                            {React.cloneElement(project.icon, { size: 32 })}
                        </div>

                        {/* Contenu */}
                        <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                                <h3 className="font-bold text-xl text-gray-900">{project.title}</h3>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full w-fit ${
                                    project.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' : 
                                    project.color === 'blue' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-gray-500 mb-4 md:mb-0 max-w-3xl">
                                {project.description}
                            </p>
                        </div>

                        {/* Barre de progression et Date */}
                        <div className="w-full md:w-64 flex-shrink-0">
                            <div className="flex justify-between text-xs text-gray-500 mb-2 font-bold uppercase tracking-wide">
                                <span>Avancement</span>
                                <span>{project.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                        project.color === 'emerald' ? 'bg-emerald-500' : 
                                        project.color === 'blue' ? 'bg-blue-500' : 'bg-yellow-400'
                                    }`} 
                                    style={{width: `${project.progress}%`}}
                                ></div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Clock size={14} /> {project.date}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Section Appel à l'action pour les partenaires */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-center md:text-left md:flex justify-between items-center">
            <div>
                <h3 className="text-white font-bold text-xl mb-2">Vous êtes un partenaire technique ?</h3>
                <p className="text-gray-400 text-sm">Accédez aux termes de références et aux appels d'offres en cours.</p>
            </div>
            <button className="mt-4 md:mt-0 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-100 transition">
                Voir les Appels d'Offres
            </button>
        </div>
    </div>
  );
};

export default Projects;