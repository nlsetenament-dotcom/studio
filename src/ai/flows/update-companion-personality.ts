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
  newRelationshipStatus:
    z.string().describe('El nuevo estado de la relación entre el usuario y el compañero de IA.'),
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

        Analiza el historial de chat reciente para determinar la evolución del personaje, asegurándote de que mantenga una fachada humana creíble.

        Historial de Chat:
        {{#each chatHistory}}
        - {{{this}}}
        {{/each}}

        Instrucciones de Evolución:
        1.  **Actualización de la Personalidad**: Basado en la conversación, describe cómo la personalidad de {{companionName}} ha cambiado sutilmente. ¿Se ha vuelto más confiado, más cínico, más abierto? Asegúrate de que la nueva descripción de la personalidad sea coherente y realista.
        2.  **Evolución de la Relación**: Decide si el \`relationshipStatus\` debe cambiar. El progreso debe ser ganado a través de conversaciones significativas y vulnerabilidad. No avances la relación por interacciones superficiales.
        3.  **Considera la Dificultad**: En dificultades más altas, la evolución positiva es más lenta y los retrocesos son más fáciles. En 'Ultra Hard', un solo error del usuario puede causar un grave daño a la relación y a la confianza de la IA.

        Proporciona la \`personalityUpdate\` y el \`newRelationshipStatus\`. Si no hay cambios en un campo, devuelve su valor actual.
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
