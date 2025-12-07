import React from 'react';
import { Link } from 'react-router-dom';

const Mission = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border-light bg-background-light/80 px-4 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/80">
        <Link to="/" className="flex size-10 items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </Link>
        <h1 className="text-lg font-bold">Mission et Partenaires</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="rounded-xl border border-congo-green/30 bg-white p-6 shadow-sm dark:border-congo-green/50 dark:bg-card-dark congo-stripe-decoration">
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-congo-green dark:text-congo-yellow">Notre Mission</h2>
          <p className="mt-2 text-base font-normal leading-relaxed text-gray-600 dark:text-gray-400">
            L'objectif principal du projet HISWACA est d'harmoniser les données statistiques nationales du Congo...
          </p>
        </div>

        <h3 className="mt-10 text-[22px] font-bold text-text-light dark:text-text-dark">Nos Partenaires</h3>
        <div className="mt-4 flex flex-col gap-3">
          {/* Partenaire: Banque Mondiale */}
          <div className="flex items-center gap-4 rounded-xl bg-white p-4 dark:bg-card-dark">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-congo-blue/10 p-2">
              <img className="h-full w-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdhTTG9s9nfmbSbVLI7Sm9-FutykYrLcgR1lCq4iu0qgSmRh7JPyu1qCmbTopzHd-rEdkOaJ-YbBJFKhDEKwW3vXRizpG930sPJxRJg9QFuz31l148bwAuHUIhnY8p8QYQYUEw76rB3wGEVIb3DBoyIcHql198OUKOyuVVqci82jWGKaR-LXnd12YLn5vezLy7GXncu7sc-x9NYPElr6n1l0bLrzjKWdrQGCRG8IMervFunal2hELN1p09Dh587gtPTSiVBR-BN6Y" alt="BM Logo" />
            </div>
            <div className="flex-1">
              <p className="text-base font-medium">La Banque Mondiale</p>
              <p className="mt-1 text-sm text-gray-500">Principal bailleur de fonds.</p>
            </div>
          </div>
           {/* Autres partenaires (INS, PRATIC...) à ajouter ici en suivant le modèle */}
        </div>
      </main>
    </div>
  );
};

export default Mission;