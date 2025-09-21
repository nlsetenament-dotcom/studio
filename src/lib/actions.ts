'use server';

import { generateCompanionPersonality } from '@/ai/flows/generate-companion-personality';
import { generateRealisticResponse } from '@/ai/flows/generate-realistic-response';
import { updateCompanionPersonality } from '@/ai/flows/update-companion-personality';
import { Companion, Message } from './types';
import { z } from 'zod';
import { PlaceHolderImages } from './placeholder-images';

const createCompanionSchema = z.object({
  name: z.string().min(2).max(50),
  gender: z.enum(['Masculino', 'Femenino']),
  birthDate: z.string().datetime(),
  hobbies: z.string().min(3).max(200),
  description: z.string().min(10).max(500),
  difficulty: z.enum(['Easy', 'Hard', 'Expert', 'Ultra Hard']),
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
    return { error: 'Datos de formulario inválidos. Asegúrate de que la fecha de nacimiento sea válida.' };
  }
  
  const { name, gender, birthDate, hobbies, description, difficulty } = validatedFields.data;

  try {
    const birthDateObj = new Date(birthDate);
    const age = calculateAge(birthDateObj);

    if (age < 18) {
        return { error: 'Debes tener al menos 18 años.' };
    }
    if (age > 100) {
        return { error: 'La edad no puede exceder los 100 años.' };
    }

    const personalityResult = await generateCompanionPersonality({ name, gender, age, hobbies, description });
    
    const companionAvatar = PlaceHolderImages.find(img => img.id === 'companion-avatar');

    const newCompanion: Companion = {
      id: crypto.randomUUID(),
      name,
      gender,
      age,
      birthDate: birthDate,
      hobbies,
      description,
      difficulty,
      personality: personalityResult.personalityDescription,
      relationshipStatus: 'Desconocido',
      avatarUrl: companionAvatar?.imageUrl || 'https://picsum.photos/seed/companion/200/200',
    };

    return { success: true, companion: newCompanion };
  } catch (error) {
    console.error('Error creando compañero:', error);
    return { error: 'No se pudo crear la personalidad del compañero. Por favor, inténtalo de nuevo.' };
  }
}

export async function getAIResponseAction(companion: Companion, messages: Message[]) {
  try {
    const conversationHistory = messages.map(msg => `${msg.sender === 'user' ? 'Usuario' : companion.name}: ${msg.text}`).join('\n');
    
    const responseResult = await generateRealisticResponse({
      companionName: companion.name,
      companionPersonality: companion.personality,
      relationshipStatus: companion.relationshipStatus,
      difficulty: companion.difficulty,
      conversationHistory: conversationHistory,
    });

    await new Promise(res => setTimeout(res, calculateTypingDelay(responseResult.response)));

    return { response: responseResult.response };
  } catch (error) {
    console.error('Error generando respuesta de IA:', error);
    return { error: 'Yo... no puedo pensar en este momento. ¿Quizás podamos hablar más tarde?' };
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
        });

        const updatedCompanion: Partial<Companion> = {
            personality: updateResult.personalityUpdate,
            relationshipStatus: updateResult.newRelationshipStatus,
        };

        return { success: true, updates: updatedCompanion };
    } catch (error) {
        console.error('Error actualizando la personalidad:', error);
        return { error: 'No se pudo actualizar la personalidad del compañero.' };
    }
}
