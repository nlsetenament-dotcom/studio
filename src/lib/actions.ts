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
  age: z.coerce.number().int().min(18).max(100),
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

export async function createCompanionAction(formData: FormData) {
  const validatedFields = createCompanionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: 'Invalid form data.' };
  }
  
  const { name, gender, age, hobbies, description, difficulty } = validatedFields.data;

  try {
    const personalityResult = await generateCompanionPersonality({ name, gender, age, hobbies, description });
    
    const companionAvatar = PlaceHolderImages.find(img => img.id === 'companion-avatar');

    const newCompanion: Companion = {
      id: crypto.randomUUID(),
      name,
      gender,
      age,
      hobbies,
      description,
      difficulty,
      personality: personalityResult.personalityDescription,
      relationshipStatus: 'Stranger',
      avatarUrl: companionAvatar?.imageUrl || 'https://picsum.photos/seed/companion/200/200',
    };

    return { success: true, companion: newCompanion };
  } catch (error) {
    console.error('Error creating companion:', error);
    return { error: 'Failed to create companion personality. Please try again.' };
  }
}

export async function getAIResponseAction(companion: Companion, messages: Message[]) {
  try {
    const conversationHistory = messages.map(msg => `${msg.sender === 'user' ? 'User' : companion.name}: ${msg.text}`).join('\n');
    
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
    console.error('Error generating AI response:', error);
    return { error: 'I... I can\'t think right now. Maybe we can talk later?' };
  }
}

export async function updatePersonalityAction(companion: Companion, messages: Message[]) {
    try {
        const recentHistory = messages.slice(-10).map(msg => `${msg.sender === 'user' ? 'User' : companion.name}: ${msg.text}`);

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
        console.error('Error updating personality:', error);
        return { error: 'Failed to update companion personality.' };
    }
}
