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
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}
