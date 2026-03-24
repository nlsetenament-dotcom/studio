'use server';

import { getModel } from '@/ai/google';

export interface ReactToUserBehaviorInput {
  userMessage: string;
  relationshipStatus: string;
  companionName: string;
  difficulty: string;
  companionPersonality: string;
}

export interface ReactToUserBehaviorOutput {
  proposedRelationshipChange: 'positive' | 'negative' | 'neutral';
}

export async function reactToUserBehavior(
  input: ReactToUserBehaviorInput
): Promise<ReactToUserBehaviorOutput> {
  const model = getModel();

  const prompt = `Eres un psicólogo de relaciones que analiza una interacción entre un humano y su compañero de IA llamado ${input.companionName}.

Personalidad del Compañero: ${input.companionPersonality}
Estado Actual de la Relación: ${input.relationshipStatus}
Dificultad de la Interacción: ${input.difficulty}
Mensaje del Usuario: "${input.userMessage}"

Tu Tarea: Analiza SOLO el mensaje del usuario y determina su impacto emocional.
- positive: El mensaje es amable, vulnerable, profundo, de apoyo o muestra claro interés.
- negative: El mensaje es grosero, despectivo, hiriente o ignora deliberadamente al compañero.
- neutral: El mensaje es superficial, una pregunta simple o sin carga emocional clara.

En dificultades altas (Hard, Expert), sé mucho más estricto para calificar un mensaje como "positive".

Responde ÚNICAMENTE con JSON válido:
{"proposedRelationshipChange": "positive" | "negative" | "neutral"}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    const change = parsed.proposedRelationshipChange;
    if (['positive', 'negative', 'neutral'].includes(change)) {
      return { proposedRelationshipChange: change };
    }
    return { proposedRelationshipChange: 'neutral' };
  } catch {
    return { proposedRelationshipChange: 'neutral' };
  }
}
