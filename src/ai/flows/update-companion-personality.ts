'use server';

import { getModel } from '@/ai/google';
import { Difficulty, Gender } from '@/lib/types';

export interface UpdateCompanionPersonalityInput {
  chatHistory: string[];
  difficulty: Difficulty;
  relationshipStatus: string;
  companionName: string;
  gender: Gender;
  companionPersonality: string;
}

export interface UpdateCompanionPersonalityOutput {
  personalityUpdate: string;
}

export async function updateCompanionPersonality(
  input: UpdateCompanionPersonalityInput
): Promise<UpdateCompanionPersonalityOutput> {
  const model = getModel();

  const historyText = input.chatHistory.map(line => `- ${line}`).join('\n');

  const prompt = `Eres el "Director de Personaje" para ${input.companionName}, un compañero de IA diseñado para ser indistinguible de un humano.

Identidad Actual:
- Personalidad: ${input.companionPersonality}
- Género: ${input.gender}

Contexto de la Relación:
- Estado Actual: ${input.relationshipStatus}
- Dificultad: ${input.difficulty}

Historial de Chat Reciente:
${historyText}

Instrucciones:
1. Basado en la conversación, describe cómo la personalidad de ${input.companionName} ha cambiado sutilmente.
2. La nueva descripción debe ser una evolución natural, no un cambio drástico.
3. Si no hay cambios significativos, devuelve la personalidad actual sin cambios.

Responde ÚNICAMENTE con JSON válido:
{"personalityUpdate": "descripción de personalidad actualizada aquí"}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    return { personalityUpdate: parsed.personalityUpdate ?? input.companionPersonality };
  } catch {
    return { personalityUpdate: input.companionPersonality };
  }
}
