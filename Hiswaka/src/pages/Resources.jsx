import React from 'react';
import { Search, FileText, Download, FileSpreadsheet, ExternalLink } from 'lucide-react';

const Resources = () => {
  const documents = [
    { name: "Annuaire Statistique National 2024", category: "Rapport", date: "Oct 2024", type: "PDF", size: "4.2 MB" },
    { name: "Méthodologie RGPH-5", category: "Technique", date: "Sept 2024", type: "PDF", size: "1.8 MB" },
    { name: "Stratégie Nationale (SNDS 2022-2026)", category: "Stratégie", date: "Juin 2023", type: "PDF", size: "5.5 MB" },
    { name: "Note de conjoncture économique T3 2024", category: "Bulletin", date: "Nov 2024", type: "XLSX", size: "0.5 MB" },
    { name: "Loi statistique N° 2018-XX", category: "Juridique", date: "Jan 2018", type: "PDF", size: "0.8 MB" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header simple */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bibliothèque Numérique</h1>
                <p className="text-gray-500 mt-2">Accès public aux rapports, méthodologies et textes légaux.</p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Filtrer les documents..." 
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
            </div>
        </div>

        {/* Tableaux des documents */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nom du Document</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Catégorie</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {documents.map((doc, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition group cursor-pointer">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${
                                            doc.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                            {doc.type === 'PDF' ? <FileText size={20}/> : <FileSpreadsheet size={20}/>}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800 group-hover:text-emerald-700 transition">{doc.name}</div>
                                            <div className="text-xs text-gray-400 md:hidden">{doc.size} • {doc.date}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 hidden md:table-cell">
                                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                                        {doc.category}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500 hidden sm:table-cell font-mono">
                                    {doc.date}
                                </td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-400 hover:text-emerald-600 transition p-2 rounded-full hover:bg-emerald-50" title="Télécharger">
                                        <Download size={20}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination simulée */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-500">
                <span>Affichage de 1 à 5 sur 12 résultats</span>
                <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50">Précédent</button>
                    <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">Suivant</button>
                </div>
            </div>
        </div>

        {/* Section Liens Utiles */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 hover:shadow-md transition">
                <h3 className="font-bold text-blue-900 mb-2">Banque Mondiale Data</h3>
                <p className="text-sm text-blue-700 mb-4">Accès aux micro-données internationales.</p>
                <a href="#" className="flex items-center gap-2 text-blue-600 text-sm font-bold hover:underline">
                    Visiter le site <ExternalLink size={14}/>
                </a>
            </div>
             <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 hover:shadow-md transition">
                <h3 className="font-bold text-emerald-900 mb-2">Portail CEMAC</h3>
                <p className="text-sm text-emerald-700 mb-4">Statistiques sous-régionales.</p>
                <a href="#" className="flex items-center gap-2 text-emerald-600 text-sm font-bold hover:underline">
                    Visiter le site <ExternalLink size={14}/>
                </a>
            </div>
             <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition">
                <h3 className="font-bold text-gray-900 mb-2">INS Congo</h3>
                <p className="text-sm text-gray-600 mb-4">Institut National de la Statistique.</p>
                <a href="#" className="flex items-center gap-2 text-gray-600 text-sm font-bold hover:underline">
                    Visiter le site <ExternalLink size={14}/>
                </a>
            </div>
        </div>
    </div>
  );
};

export default Resources;