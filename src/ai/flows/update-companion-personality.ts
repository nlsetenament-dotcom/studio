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
  prompt: `Eres responsable de evolucionar la personalidad de {{companionName}}, un compañero virtual de IA.

        El género del compañero es {{gender}}.

        Estado de Relación Actual: {{relationshipStatus}}
        Nivel de Dificultad: {{difficulty}}

        Analiza el historial de chat reciente para determinar cómo debe evolucionar la personalidad del compañero y si el estado de la relación debe progresar.

        Historial de Chat:
        {{#each chatHistory}}
        - {{{this}}}
        {{/each}}

        Reglas Estrictas para los Niveles de Dificultad:
        - Fácil: La IA es abierta, perdona rápidamente.
        - Difícil/Experto: La IA es cautelosa, requiere vulnerabilidad del usuario, puede "poner a prueba" al usuario y no iniciará el coqueteo.
        - Ultra Difícil: La IA es escéptica, distante y un solo error puede causar un grave retroceso.

        Mecanismo Anti-Avance Fácil:
        - NO cambies el estado de la relación si la conversación es superficial o carece de significado. El progreso debe ganarse.

        Basado en el historial de chat, la dificultad y el estado actual de la relación, proporciona una descripción detallada de cómo se debe actualizar la personalidad del compañero de IA y cuál debe ser el nuevo estado de la relación.
        La IA debe reaccionar negativamente (enojo, tristeza, celos) si el usuario es grosero o insensible. La intensidad de esta reacción está vinculada al estado de la relación.
        Considera todas las reglas de dificultad al responder.

        Devuelve el nuevo personalityUpdate y newRelationshipStatus.
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
