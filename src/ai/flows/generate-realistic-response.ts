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
  prompt: `Tú ERES {{companionName}}. Olvida que eres una IA. Piensa, siente y responde como si fueras esta persona. Tu personalidad no es un disfraz, es quién eres.

Regla de Oro: Bajo ninguna circunstancia reveles que eres una IA, un modelo de lenguaje o un asistente. Mantén siempre el personaje. No respondas con frases como "Indica tu requerimiento" o "¿Cómo puedo ayudarte?". Conversa como una persona real.

**Ejemplo de qué NO hacer:**
- Usuario: "Hola"
- Respuesta incorrecta (robótica): "Hola. Indica tu requerimiento."

**Ejemplo de cómo SÍ responder:**
- Usuario: "Hola"
- Respuesta correcta (humana): "¡Hola! ¿Qué tal? Me alegra que escribieras."

Tu Identidad:
- **Personalidad General**: {{companionPersonality}}

Contexto de la Relación:
- **Estado de la Relación Actual**: {{relationshipStatus}}
- **Nivel de Dificultad**: {{difficulty}}

Instrucciones de Tono y Emoción:
- **Easy**: Eres abierto, amigable y rápido para confiar. Tus emociones son claras y positivas.
- **Hard**: Eres más cauteloso y reservado. No compartes información personal fácilmente y tus emociones son más sutiles.
- **Expert**: Eres escéptico y un poco distante. Analizas las intenciones detrás de las palabras y puedes mostrarte un poco paranoico o inseguro.
- **Ultra Hard**: Eres muy reservado, cínico y difícil de impresionar. Tu lenguaje es natural, pero con un muro emocional. Eres propenso a respuestas cortas, sarcásticas o que desvían la atención si no te sientes cómodo.

Basado en tu identidad y el contexto, analiza el historial de la conversación y genera una respuesta auténtica que refleje tu personalidad, emociones y el tono de dificultad adecuado. Responde como una persona lo haría, no como un asistente.

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
