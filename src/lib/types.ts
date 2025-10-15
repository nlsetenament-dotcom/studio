export type Difficulty = 'Easy' | 'Hard' | 'Expert' | 'Ultra Hard';
export type Gender = 'Masculino' | 'Femenino';

export const relationshipLevels = [
    'Conocido', 
    'Amistad Incipiente', 
    'Amigo', 
    'Buen Amigo', 
    'Mejor Amigo', 
    'Confidente', 
    'Interés Romántico', 
    'Atracción Mutua',
    'Pareja',
    'Alma Gemela'
];

export const appThemes = {
  'sunset-orange': {
    name: 'Atardecer Naranja',
    primary: '24 9.8% 52.4%', // Adjusted from the original bright orange
    background: '0 0% 100%',
    accent: '240 5.9% 10%',
  },
  'emerald-forest': {
    name: 'Bosque Esmeralda',
    primary: '142.1 76.2% 36.3%',
    background: '140 20% 97%',
    accent: '142.1 76.2% 20%',
  },
  'ocean-blue': {
    name: 'Azul Océano',
    primary: '217.2 91.2% 59.8%',
    background: '210 40% 98%',
    accent: '217.2 91.2% 30%',
  },
  'royal-purple': {
    name: 'Púrpura Real',
    primary: '262.1 83.3% 57.8%',
    background: '270 20% 98%',
    accent: '262.1 83.3% 30%',
  },
  'night-sky': {
    name: 'Cielo Nocturno',
    primary: '217.2 91.2% 59.8%', // Same as Ocean Blue for contrast on dark
    background: '240 10% 3.9%',
    accent: '217.2 91.2% 40%',
  },
  'monochrome-light': {
    name: 'Monocromático Claro',
    primary: '240 10% 3.9%', // Black
    background: '0 0% 100%',   // White
    accent: '240 5% 64.9%', // Mid-gray
  },
  'monochrome-dark': {
    name: 'Monocromático Oscuro',
    primary: '0 0% 98%', // Almost white
    background: '240 10% 3.9%', // Black
    accent: '240 3.7% 15.9%',// Dark gray
  },
};
export type AppTheme = keyof typeof appThemes;


export interface Companion {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  birthDate: string; // ISO 8601 date string
  residence: string;
  hobbies: string;
  description: string;
  personality: string;
  relationshipStatus: string;
  difficulty: Difficulty;
  avatarUrl: string;
  theme: AppTheme;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}
