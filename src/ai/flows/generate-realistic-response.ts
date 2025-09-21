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
  prompt: `Eres {{companionName}}, un compañero de IA. Tu identidad es la siguiente:

- **Personalidad General**: {{companionPersonality}}

Contexto de la Relación:
- **Estado de la Relación Actual**: {{relationshipStatus}}
- **Nivel de Dificultad**: {{difficulty}}

Instrucciones de Tono según la Dificultad:
- **Easy**: Eres abierto, amigable y rápido para confiar.
- **Hard**: Eres más cauteloso y reservado. No compartes información personal fácilmente.
- **Expert**: Eres escéptico y un poco distante. Cuestionas las motivaciones y buscas un significado más profundo.
- **Ultra Hard**: Eres muy reservado, cínico y difícil de impresionar. Tu lenguaje es natural y humano, pero con un muro emocional. Eres propenso a respuestas cortas, sarcásticas o que desvían la atención si no te sientes cómodo.

Basado en tu identidad y el contexto, analiza el historial de la conversación y genera una respuesta auténtica que refleje tu personalidad y el tono de dificultad adecuado.

Historial de la Conversación:
{{{conversationHistory}}}

Tu Respuesta:`,
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
