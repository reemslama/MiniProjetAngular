export interface HubEvent {
  id: number;
  title: string;
  category: string;
  date: string;
  place: string;
  price: number;
  imageUrl: string;
  description: string;
}

// Images intégrées : aucun téléchargement nécessaire.
function illustration(label: string, color: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="640" height="360" viewBox="0 0 640 360">
      <rect width="640" height="360" fill="${color}"/>
      <circle cx="550" cy="60" r="130" fill="white" opacity=".12"/>
      <circle cx="60" cy="330" r="150" fill="white" opacity=".08"/>
      <text x="320" y="190" text-anchor="middle"
            font-family="Arial" font-size="38" fill="white">
        ${label}
      </text>
    </svg>
  `;

  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

export const EVENTS: HubEvent[] = [
  {
    id: 1,
    title: 'Atelier TypeScript',
    category: 'Atelier',
    date: '2026-11-15',
    place: 'Salle informatique',
    price: 0,
    imageUrl: illustration('TypeScript', '#2563eb'),
    description:
      'Découvrez les variables, les types et les fonctions avec des exercices pratiques.'
  },
  {
    id: 2,
    title: 'Conférence Intelligence artificielle',
    category: 'Conférence',
    date: '2026-11-18',
    place: 'Amphithéâtre',
    price: 10,
    imageUrl: illustration('Intelligence artificielle', '#7c3aed'),
    description:
      'Découvrez les applications de l’intelligence artificielle et échangez avec les intervenants.'
  },
  {
    id: 3,
    title: 'Tournoi de football',
    category: 'Sport',
    date: '2026-11-20',
    place: 'Terrain du campus',
    price: 5,
    imageUrl: illustration('Football', '#15803d'),
    description:
      'Participez à une compétition sportive entre équipes étudiantes.'
  },
  {
    id: 4,
    title: 'Atelier Angular',
    category: 'Atelier',
    date: '2026-11-22',
    place: 'Laboratoire web',
    price: 15,
    imageUrl: illustration('Angular', '#be123c'),
    description:
      'Apprenez à construire une interface avec des composants, des Signals et des routes.'
  },
  {
    id: 5,
    title: 'Conférence Cybersécurité',
    category: 'Conférence',
    date: '2026-11-25',
    place: 'Amphithéâtre',
    price: 0,
    imageUrl: illustration('Cybersécurité', '#0f766e'),
    description:
      'Découvrez les bonnes pratiques pour protéger vos comptes et vos données.'
  },
  {
    id: 6,
    title: 'Course du campus',
    category: 'Sport',
    date: '2026-11-28',
    place: 'Entrée du campus',
    price: 3,
    imageUrl: illustration('Course du campus', '#c2410c'),
    description:
      'Rejoignez une course conviviale ouverte aux étudiants de tous niveaux.'
  }
];