export const indicators = [
  {
    id: 1,
    title: "Taux de croissance du PIB",
    category: "Économie",
    source: "INS Congo",
    lastUpdate: "2024-10-01",
    value: "+4.2%",
    description: "Évolution annuelle de la richesse nationale.",
    data: [
      { year: '2020', value: -1.5 },
      { year: '2021', value: 1.2 },
      { year: '2022', value: 2.8 },
      { year: '2023', value: 3.5 },
      { year: '2024', value: 4.2 },
    ]
  },
  {
    id: 2,
    title: "Taux de scolarisation primaire",
    category: "Éducation",
    source: "Ministère Éducation / UNESCO",
    lastUpdate: "2023-12-01",
    value: "88%",
    description: "Pourcentage d'enfants en âge d'être scolarisés qui le sont.",
    data: [
      { year: '2020', value: 82 },
      { year: '2021', value: 84 },
      { year: '2022', value: 85 },
      { year: '2023', value: 88 },
    ]
  },

    { id: 3,
    title: "Cartographie détaillée des pathologies (District)",
    category: "Santé",
    source: "Ministère de la Santé / OMS",
    lastUpdate: "2024-02-15",
    isRestricted: true, // PRIVÉ (Cadenas)
    value: "Confidentiel",
    description: "Données désagrégées au niveau district sanitaire. Accès réservé aux chercheurs et partenaires.",
    data: [ /* données... */ ]
  },
  // Ajoutez d'autres indicateurs ici...
];