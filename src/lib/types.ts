export type Difficulty = 'Easy' | 'Hard' | 'Expert';
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
  },
  'emerald-forest': {
    name: 'Bosque Esmeralda',
  },
  'ocean-blue': {
    name: 'Azul Océano',
  },
  'royal-purple': {
    name: 'Púrpura Real',
  },
  'night-sky': {
    name: 'Cielo Nocturno',
  },
  'monochrome-light': {
    name: 'Monocromático Claro',
  },
  'monochrome-dark': {
    name: 'Monocromático Oscuro',
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
