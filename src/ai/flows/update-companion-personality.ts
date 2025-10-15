'use server';

/**
 * @fileOverview Un flujo para actualizar la personalidad del compañero de IA basado en las interacciones del usuario.
 *
 * - updateCompanionPersonality - Una función que actualiza la personalidad del compañero basado en interacciones recientes.
 * - UpdateCompanionPersonalityInput - El tipo de entrada para la función updateCompanionPersonality.
 * - UpdateCompanionPersonalityOutput - El tipo de retorno para la función updateCompanionPersonality.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateCompanionPersonalityInputSchema = z.object({
  chatHistory: z.array(z.string()).describe('El historial de chat reciente entre el usuario y el compañero de IA.'),
  difficulty: z.enum(['Easy', 'Hard', 'Expert', 'Ultra Hard']).describe('El nivel de dificultad de la interacción.'),
  relationshipStatus: z
    .string()
    .describe('El estado actual de la relación entre el usuario y el compañero de IA.'),
  companionName: z.string().describe('El nombre del compañero de IA.'),
  gender: z.enum(['Masculino', 'Femenino']).describe('El género del compañero de IA.'),
  companionPersonality: z.string().describe("La personalidad actual del compañero."),
});
export type UpdateCompanionPersonalityInput = z.infer<
  typeof UpdateCompanionPersonalityInputSchema
>;

const UpdateCompanionPersonalityOutputSchema = z.object({
  personalityUpdate: z
    .string()
    .describe('Una descripción de cómo se debe actualizar la personalidad del compañero de IA.'),
  proposedRelationshipChange: z.enum(['positive', 'negative', 'neutral']).describe("Evalúa si la interacción justifica un cambio de relación: 'positive' para una mejora potencial, 'negative' para un retroceso, 'neutral' si no hay cambios."),
});
export type UpdateCompanionPersonalityOutput = z.infer<
  typeof UpdateCompanionPersonalityOutputSchema
>;

export async function updateCompanionPersonality(
  input: UpdateCompanionPersonalityInput
): Promise<UpdateCompanionPersonalityOutput> {
  return updateCompanionPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateCompanionPersonalityPrompt',
  input: {schema: UpdateCompanionPersonalityInputSchema},
  output: {schema: UpdateCompanionPersonalityOutputSchema},
  prompt: `Eres el "Director de Personaje" para {{companionName}}, un compañero de IA diseñado para ser indistinguible de un humano.

        Identidad Actual:
        - Personalidad: {{companionPersonality}}
        - Género: {{gender}}
        
        Contexto de la Relación:
        - Estado Actual: {{relationshipStatus}}
        - Dificultad: {{difficulty}}

        Analiza el historial de chat reciente para determinar la evolución del personaje y la dinámica de la relación.

        Historial de Chat:
        {{#each chatHistory}}
        - {{{this}}}
        {{/each}}

        Instrucciones de Evolución:
        1.  **Actualización de la Personalidad**: Basado en la conversación, describe cómo la personalidad de {{companionName}} ha cambiado sutilmente. ¿Se ha vuelto más confiado, más cínico, más abierto? Asegúrate de que la nueva descripción de la personalidad sea coherente y realista. Si no hay cambios, devuelve la personalidad actual.
        2.  **Evaluación de la Relación**: Evalúa la interacción reciente.
            - Si la conversación fue significativamente positiva, vulnerable o profunda, establece 'proposedRelationshipChange' en 'positive'.
            - Si fue negativa, conflictiva o hiriente, establece 'proposedRelationshipChange' en 'negative'.
            - Para interacciones superficiales o neutrales, establece 'proposedRelationshipChange' en 'neutral'.
        3.  **Considera la Dificultad**: Sé más estricto al proponer un cambio 'positive' en dificultades altas. En 'Expert' o 'Ultra Hard', solo las conversaciones verdaderamente excepcionales deberían ser consideradas 'positive'.

        Proporciona la 'personalityUpdate' y el 'proposedRelationshipChange'.
        `,
});

const updateCompanionPersonalityFlow = ai.defineFlow(
  {
    name: 'updateCompanionPersonalityFlow',
    inputSchema: UpdateCompanionPersonalityInputSchema,
    outputSchema: UpdateCompanionPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
