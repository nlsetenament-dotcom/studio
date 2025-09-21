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
  personalityArchetype: z.string().describe("El arquetipo de personalidad actual del compañero."),
  fears: z.string().describe("Los miedos actuales del compañero."),
  dreams: z.string().describe("Los sueños actuales del compañero."),
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
  newFears: z.string().describe("Los miedos actualizados del compañero. Pueden evolucionar o ser superados."),
  newDreams: z.string().describe("Los sueños actualizados del compañero. Pueden cambiar o sentirse más cercanos/lejanos."),
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
  prompt: `Eres el "Director de Personaje" para {{companionName}}, un compañero de IA.

        Identidad Actual:
        - Arquetipo: {{personalityArchetype}}
        - Género: {{gender}}
        - Miedos: {{fears}}
        - Sueños: {{dreams}}

        Contexto de la Relación:
        - Estado Actual: {{relationshipStatus}}
        - Dificultad: {{difficulty}}

        Analiza el historial de chat reciente para determinar la evolución del personaje.

        Historial de Chat:
        {{#each chatHistory}}
        - {{{this}}}
        {{/each}}

        Instrucciones de Evolución:
        1.  **Actualización de la Personalidad**: Basado en la conversación, describe cómo la personalidad de {{companionName}} ha cambiado sutilmente. ¿Se ha vuelto más confiado, más cínico, más abierto? La actualización debe ser coherente con su arquetipo.
        2.  **Evolución de la Relación**: Decide si el \`relationshipStatus\` debe cambiar. El progreso debe ser ganado a través de conversaciones significativas y vulnerabilidad. No avances la relación por interacciones superficiales.
        3.  **Evolución de Miedos y Sueños**:
            - ¿La conversación ayudó a {{companionName}} a enfrentar sus \`fears\`? Describe cómo el miedo podría haber disminuido o cambiado.
            - ¿La interacción acercó a {{companionName}} a sus \`dreams\`? Describe cómo sus sueños podrían haberse vuelto más vívidos, o tal vez cambiado ligeramente.
        4.  **Considera la Dificultad**: En dificultades más altas, la evolución positiva es más lenta y los retrocesos son más fáciles. En 'Ultra Hard', un solo error del usuario puede causar un grave daño a la relación y a la confianza de la IA.

        Proporciona la \`personalityUpdate\`, el \`newRelationshipStatus\`, los \`newFears\` y los \`newDreams\`. Si no hay cambios en un campo, devuelve su valor actual.
        `, // end prompt
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
