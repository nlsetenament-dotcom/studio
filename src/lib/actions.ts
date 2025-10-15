'use server';

import { generateCompanionPersonality } from '@/ai/flows/generate-companion-personality';
import { generateRealisticResponse } from '@/ai/flows/generate-realistic-response';
import { updateCompanionPersonality } from '@/ai/flows/update-companion-personality';
import { reactToUserBehavior } from '@/ai/flows/react-to-user-behavior';
import { Companion, Message, Difficulty } from './types';
import { z } from 'zod';
import { PlaceHolderImages } from './placeholder-images';

const createCompanionSchema = z.object({
  name: z.string().min(2).max(50),
  residence: z.string().min(2).max(100),
  gender: z.enum(['Masculino', 'Femenino']),
  birthDate: z.string().datetime(),
  hobbies: z.string().min(3).max(200),
  description: z.string().min(10).max(500),
});

function calculateTypingDelay(text: string): number {
  const words = text.split(' ').length;
  const wpm = 150; // Average typing speed
  const delay = (words / wpm) * 60 * 1000;
  return Math.max(500, Math.min(delay, 5000)); // Ensure delay is between 0.5s and 5s
}

function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export async function createCompanionAction(formData: FormData) {
  const validatedFields = createCompanionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return { error: 'Datos de formulario inválidos. Asegúrate de que todos los campos son correctos.' };
  }
  
  const { name, gender, birthDate, hobbies, description, residence } = validatedFields.data;

  try {
    const birthDateObj = new Date(birthDate);
    const age = calculateAge(birthDateObj);

    if (age < 18) {
        return { error: 'Debes tener al menos 18 años.' };
    }
    if (age > 100) {
        return { error: 'La edad no puede exceder los 100 años.' };
    }

    const personalityResult = await generateCompanionPersonality({ name, gender, age, hobbies, description, residence });
    
    const companionAvatar = PlaceHolderImages.find(img => img.id === 'companion-avatar');

    const newCompanion: Companion = {
      id: crypto.randomUUID(),
      name,
      gender,
      age,
      birthDate: birthDate,
      residence,
      hobbies,
      description,
      difficulty: 'Hard', // Default difficulty
      personality: personalityResult.personalityDescription,
      relationshipStatus: 'Conocido',
      avatarUrl: companionAvatar?.imageUrl || 'https://picsum.photos/seed/companion/200/200',
    };

    return { success: true, companion: newCompanion };
  } catch (error) {
    console.error('Error creando compañero:', error);
    return { error: 'No se pudo crear la personalidad del compañero. Por favor, inténtalo de nuevo.' };
  }
}

export async function getAIResponseAction(companion: Companion, messages: Message[], userLocalTime: string) {
  try {
    const conversationHistory = messages.map(msg => `${msg.sender === 'user' ? 'Usuario' : companion.name}: ${msg.text}`).join('\n');
    
    const responseResult = await generateRealisticResponse({
      companionName: companion.name,
      companionPersonality: companion.personality,
      relationshipStatus: companion.relationshipStatus,
      difficulty: companion.difficulty,
      conversationHistory: conversationHistory,
      userLocalTime: userLocalTime,
    });

    await new Promise(res => setTimeout(res, calculateTypingDelay(responseResult.response)));

    return { response: responseResult.response };
  } catch (error) {
    console.error('Error generando respuesta de IA:', error);
    return { error: 'Yo... no puedo pensar en este momento. ¿Quizás podamos hablar más tarde?' };
  }
}

// --- Lógica de Actualización de Relación ---

const difficultyProbabilities: Record<Difficulty, number> = {
  'Easy': 0.7,       // 70% de probabilidad de éxito en un mensaje positivo
  'Hard': 0.4,       // 40%
  'Expert': 0.15,      // 15%
  'Ultra Hard': 0.02,    // 2%
};

const relationshipLevels = [
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

function getNextRelationshipLevel(currentStatus: string): string {
    const currentIndex = relationshipLevels.indexOf(currentStatus);
    if (currentIndex < relationshipLevels.length - 1) {
        return relationshipLevels[currentIndex + 1];
    }
    return currentStatus;
}


export async function reactToUserBehaviorAction(companion: Companion, userMessage: string) {
    try {
        const reactionResult = await reactToUserBehavior({
            userMessage,
            relationshipStatus: companion.relationshipStatus,
            companionName: companion.name,
            difficulty: companion.difficulty,
            companionPersonality: companion.personality,
        });

        if (reactionResult.proposedRelationshipChange === 'positive') {
            const roll = Math.random(); // Un número entre 0 y 1
            const successChance = difficultyProbabilities[companion.difficulty];

            if (roll < successChance) { // Si la tirada es MENOR que la probabilidad, es un éxito
                const newStatus = getNextRelationshipLevel(companion.relationshipStatus);
                if (newStatus !== companion.relationshipStatus) {
                    return { success: true, updates: { relationshipStatus: newStatus }};
                }
            }
        }
        
        return { success: true, updates: null };

    } catch (error) {
        console.error('Error en la reacción al comportamiento del usuario:', error);
        return { error: 'No se pudo procesar la reacción del compañero.' };
    }
}


export async function updatePersonalityAction(companion: Companion, messages: Message[]) {
    try {
        const recentHistory = messages.slice(-10).map(msg => `${msg.sender === 'user' ? 'Usuario' : companion.name}: ${msg.text}`);

        const updateResult = await updateCompanionPersonality({
            companionName: companion.name,
            gender: companion.gender,
            difficulty: companion.difficulty,
            relationshipStatus: companion.relationshipStatus,
            chatHistory: recentHistory,
            companionPersonality: companion.personality,
        });
        
        const hasChanged = updateResult.personalityUpdate !== companion.personality;

        if (hasChanged) {
            return { success: true, updates: { personality: updateResult.personalityUpdate } };
        }

        return { success: true, updates: null };
    } catch (error) {
        console.error('Error actualizando la personalidad:', error);
        return { error: 'No se pudo actualizar la personalidad del compañero.' };
    }
}
