'use server';

import { generateCompanionPersonality } from '@/ai/flows/generate-companion-personality';
import { generateRealisticResponse } from '@/ai/flows/generate-realistic-response';
import { updateCompanionPersonality } from '@/ai/flows/update-companion-personality';
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

// --- Nueva Lógica de Actualización de Relación ---

const difficultyProbabilities: Record<Difficulty, number> = {
    'Easy': 0.8,       // 80%
    'Hard': 0.5,       // 50%
    'Expert': 0.175,   // 17.5%
    'Ultra Hard': 0.01, // 1%
};

const relationshipLevels = ['Conocido', 'Amigo', 'Buen Amigo', 'Mejor Amigo', 'Confidente', 'Alma Gemela'];

function getNextRelationshipLevel(currentStatus: string): string {
    const currentIndex = relationshipLevels.indexOf(currentStatus);
    if (currentIndex < relationshipLevels.length - 1) {
        return relationshipLevels[currentIndex + 1];
    }
    return currentStatus; // Ya está en el nivel máximo
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

        const updatedCompanion: Partial<Companion> = {
            personality: updateResult.personalityUpdate,
        };

        // Lógica de "Tirada de Dados"
        if (updateResult.proposedRelationshipChange === 'positive') {
            const roll = Math.random(); // Genera un número entre 0 y 1
            const requiredRoll = 1 - difficultyProbabilities[companion.difficulty]; // Invertimos: para 80% prob, necesita ser > 0.2

            if (roll > requiredRoll) {
                updatedCompanion.relationshipStatus = getNextRelationshipLevel(companion.relationshipStatus);
            }
        }
        
        // Aquí se podría añadir lógica para 'negative', por ejemplo, bajar de nivel. Por ahora lo mantenemos simple.

        const hasChanged = updatedCompanion.personality !== companion.personality || (updatedCompanion.relationshipStatus && updatedCompanion.relationshipStatus !== companion.relationshipStatus);

        return { success: true, updates: hasChanged ? updatedCompanion : null };
    } catch (error) {
        console.error('Error actualizando la personalidad:', error);
        return { error: 'No se pudo actualizar la personalidad del compañero.' };
    }
}