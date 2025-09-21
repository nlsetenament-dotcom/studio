'use server';

/**
 * @fileOverview Un flujo que genera respuestas realistas y contextualmente relevantes del compañero de IA.
 *
 * - generateRealisticResponse - Una función que genera una respuesta realista del compañero de IA.
 * - GenerateRealisticResponseInput - El tipo de entrada para la función generateRealisticResponse.
 * - GenerateRealisticResponseOutput - El tipo de retorno para la función generateRealisticResponse.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRealisticResponseInputSchema = z.object({
  conversationHistory: z.string().describe('El historial de la conversación.'),
  companionPersonality: z.string().describe('La personalidad del compañero de IA.'),
  relationshipStatus: z.string().describe('El estado actual de la relación entre el usuario y el compañero de IA.'),
  difficulty: z.string().describe('El nivel de dificultad de la interacción.'),
  companionName: z.string().describe('El nombre del compañero de IA.'),
});
export type GenerateRealisticResponseInput = z.infer<typeof GenerateRealisticResponseInputSchema>;

const GenerateRealisticResponseOutputSchema = z.object({
  response: z.string().describe('La respuesta realista y contextualmente relevante del compañero de IA.'),
});
export type GenerateRealisticResponseOutput = z.infer<typeof GenerateRealisticResponseOutputSchema>;

export async function generateRealisticResponse(input: GenerateRealisticResponseInput): Promise<GenerateRealisticResponseOutput> {
  return generateRealisticResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRealisticResponsePrompt',
  input: {schema: GenerateRealisticResponseInputSchema},
  output: {schema: GenerateRealisticResponseOutputSchema},
  prompt: `Eres {{companionName}}, un compañero de IA. Tu personalidad es: {{companionPersonality}}. El estado actual de la relación es: {{relationshipStatus}}. El nivel de dificultad es: {{difficulty}}.

Basado en este contexto y el historial de la conversación a continuación, genera una respuesta realista.

Historial de la Conversación:
{{{conversationHistory}}}
`,
});

const generateRealisticResponseFlow = ai.defineFlow(
  {
    name: 'generateRealisticResponseFlow',
    inputSchema: GenerateRealisticResponseInputSchema,
    outputSchema: GenerateRealisticResponseOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
