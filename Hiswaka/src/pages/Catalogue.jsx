import React from 'react';
import { Link } from 'react-router-dom';

const Catalogue = () => {
  const checkboxSvg = "url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(248,249,252)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z%27/%3e%3c/svg%3e')";

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <div className="flex items-center p-4 pb-2 justify-between">
        <Link to="/" className="flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </Link>
        <h2 className="text-lg font-bold flex-1 text-center">Catalogue de Données</h2>
        <div className="flex size-12 shrink-0"></div>
      </div>

      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="flex items-center justify-center pl-4 rounded-l-lg border-r-0 bg-input-light dark:bg-input-dark text-subtext-light dark:text-subtext-dark">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg focus:outline-0 focus:ring-0 border-none h-full px-4 rounded-l-none border-l-0 pl-2 bg-input-light dark:bg-input-dark" placeholder="Rechercher par mot-clé..." />
          </div>
        </label>
      </div>

      <div className="flex flex-col p-4 gap-3">
        <details className="flex flex-col rounded-lg border bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark px-[15px] py-[7px] group">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-2 list-none">
            <p className="text-sm font-medium">Thème</p>
            <div className="group-open:rotate-180 transition-transform">
              <span className="material-symbols-outlined text-xl">expand_more</span>
            </div>
          </summary>
          <div className="pt-2 pb-1">
             {['Santé', 'Éducation', 'Économie', 'Démographie'].map(theme => (
                <label key={theme} className="flex gap-x-3 py-3 flex-row">
                    <input type="checkbox" className="h-5 w-5 rounded border-2 bg-transparent text-congo-green checked:bg-congo-green border-border-light dark:border-border-dark focus:ring-0" 
                    style={{'--checkbox-tick-svg': checkboxSvg}}
                    />
                    <p className="text-base font-normal">{theme}</p>
                </label>
             ))}
          </div>
        </details>
        {/* Autres filtres (Période, Source)... */}
      </div>

      <div className="flex px-4 py-3">
        <button className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-congo-green text-white text-base font-bold">
          Appliquer les filtres
        </button>
      </div>

      <div className="px-4 py-3 border-t border-border-light dark:border-border-dark">
        <h3 className="text-base font-bold">2 Résultats</h3>
      </div>

      <div className="flex flex-col gap-4 px-4 pb-24">
        {/* Exemple Résultat 1 */}
        <div className="flex items-start gap-4 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-4">
          <input type="checkbox" defaultChecked className="mt-1 h-5 w-5 rounded border-2 bg-transparent text-congo-green checked:bg-congo-green focus:ring-0" />
          <div className="flex flex-col flex-1">
            <h4 className="font-bold text-base">Taux de scolarisation par province</h4>
            <p className="text-sm mt-1 text-subtext-light dark:text-subtext-dark">Données annuelles sur le taux de scolarisation.</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-subtext-light dark:text-subtext-dark">
              <div className="flex items-center gap-1.5 bg-congo-yellow/20 text-[#b28e00] px-2 py-1 rounded-full">
                <span className="material-symbols-outlined !text-sm">school</span>
                <span>Éducation</span>
              </div>
              <span>2018-2022</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-t border-border-light dark:border-border-dark">
        <button className="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 bg-congo-blue text-white text-base font-bold gap-2">
          <span className="material-symbols-outlined">download</span>
          <span>Télécharger la sélection (2)</span>
        </button>
      </div>
    </div>
  );
};

export default Catalogue;