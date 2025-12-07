import React from 'react';
import { Link } from 'react-router-dom';

const Rapports = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
        <Link to="/" className="flex size-12 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </Link>
        <h2 className="text-lg font-bold flex-1 text-center">Rapports & Publications</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-transparent">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </div>

      <div className="sticky top-[72px] bg-background-light dark:bg-background-dark z-10">
        <div className="flex border-b border-border-light dark:border-border-dark px-4 gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <a className="flex shrink-0 flex-col items-center justify-center border-b-[3px] border-b-congo-green text-congo-green pb-[13px] pt-4" href="#">
            <p className="text-sm font-bold">Publications Officielles</p>
          </a>
          <a className="flex shrink-0 flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-500 pb-[13px] pt-4" href="#">
            <p className="text-sm font-bold">Rapports d'Impact</p>
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-4">
        {/* Exemple Item Rapport */}
        <div className="flex items-center gap-4 bg-white dark:bg-card-dark px-4 min-h-[72px] py-3 justify-between rounded-lg shadow-sm">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="text-white flex items-center justify-center rounded-lg bg-congo-green shrink-0 size-12">
                    <span className="material-symbols-outlined">description</span>
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <p className="text-base font-medium truncate">Rapport Annuel sur la Santé Infantile 2023</p>
                    <p className="text-gray-500 text-sm truncate">Rapport Annuel - 24/05/2023 - 2.5MB</p>
                </div>
            </div>
            <button className="text-congo-blue">
                <span className="material-symbols-outlined">download</span>
            </button>
        </div>

        <div className="flex items-center gap-4 bg-white dark:bg-card-dark px-4 min-h-[72px] py-3 justify-between rounded-lg shadow-sm">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="text-stone-900 flex items-center justify-center rounded-lg bg-congo-yellow shrink-0 size-12">
                    <span className="material-symbols-outlined">description</span>
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                    <p className="text-base font-medium truncate">Guide Méthodologique</p>
                    <p className="text-gray-500 text-sm truncate">Document - 01/03/2023 - 1.2MB</p>
                </div>
            </div>
            <button className="text-congo-blue">
                <span className="material-symbols-outlined">download</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Rapports;