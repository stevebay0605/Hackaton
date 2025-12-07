import React from 'react';
import { Link } from 'react-router-dom';

const Visualisation = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
      <div className="flex items-center p-4 pb-2 justify-between bg-background-light dark:bg-background-dark sticky top-0 z-10">
        <Link to="/" className="flex size-10 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </Link>
        <h1 className="text-lg font-bold flex-1 text-center">Visualisation de Données</h1>
        <div className="flex size-10 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined">share</span>
        </div>
      </div>

      <div className="flex gap-3 px-4 pt-2 pb-3 overflow-x-auto">
        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-congo-green text-white pl-4 pr-3">
          <p className="text-sm font-medium">PIB</p>
          <span className="material-symbols-outlined text-base">expand_more</span>
        </button>
        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white pl-4 pr-3">
          <p className="text-sm font-medium">Scolarisation</p>
          <span className="material-symbols-outlined text-base">expand_more</span>
        </button>
      </div>

      <div className="flex px-4 py-3">
        <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 p-1">
          <label className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-white has-[:checked]:dark:bg-background-dark has-[:checked]:text-congo-green has-[:checked]:shadow-sm transition-all">
            <span className="truncate text-sm font-medium">Graphique</span>
            <input defaultChecked className="hidden" name="view-toggle" type="radio" value="Graphique"/>
          </label>
          <label className="flex cursor-pointer h-full grow items-center justify-center rounded-lg px-2 has-[:checked]:bg-white has-[:checked]:dark:bg-background-dark has-[:checked]:text-congo-green has-[:checked]:shadow-sm transition-all">
            <span className="truncate text-sm font-medium">Carte</span>
            <input className="hidden" name="view-toggle" type="radio" value="Carte"/>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 px-4 py-3">
        <div className="flex w-full flex-1 flex-col gap-2 rounded-xl bg-background-light dark:bg-gray-900/50 p-4 shadow-sm border border-border-light dark:border-border-dark">
          <p className="text-base font-medium">Évolution du PIB (2000-2023)</p>
          <p className="text-3xl font-bold text-congo-green dark:text-congo-yellow">+5.2%</p>
          
          <div className="flex min-h-[180px] flex-1 flex-col gap-6 py-4">
            {/* SVG Chart converti en JSX */}
            <svg fill="none" height="148" preserveAspectRatio="none" viewBox="-3 0 478 150" width="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H326.769H0V109Z" fill="url(#paint0_linear)"></path>
              <path d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" stroke="#DE2440" strokeLinecap="round" strokeWidth="3"></path>
              <defs>
                <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear" x1="236" x2="236" y1="1" y2="149">
                  <stop stopColor="#DE2440" stopOpacity="0.25"></stop>
                  <stop offset="1" stopColor="#DE2440" stopOpacity="0"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between">
                {['2000', '2005', '2010', '2015', '2020'].map(year => (
                    <p key={year} className="text-xs font-medium text-gray-500">{year}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <button className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-congo-blue text-white shadow-lg">
        <span className="material-symbols-outlined text-3xl">filter_list</span>
      </button>
    </div>
  );
};

export default Visualisation;