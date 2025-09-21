'use server';
/**
 * @fileOverview Un agente de IA que permite al compañero reaccionar al comportamiento del usuario.
 *
 * - reactToUserBehavior - Una función que maneja la reacción del compañero al comportamiento del usuario.
 * - ReactToUserBehaviorInput - El tipo de entrada para la función reactToUserBehavior.
 * - ReactToUserBehaviorOutput - El tipo de retorno para la función reactToUserBehavior.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReactToUserBehaviorInputSchema = z.object({
  userMessage: z.string().describe('El mensaje enviado por el usuario.'),
  relationshipStatus: z
    .string()
    .describe(
      'El estado actual de la relación entre el usuario y el compañero de IA.'
    ),
  companionName: z.string().describe('El nombre del compañero de IA.'),
  difficulty: z
    .string()
    .describe(
      'El nivel de dificultad de la interacción (p. ej., Fácil, Difícil, Ultra Difícil)'
    ),
  history: z.array(z.object({ speaker: z.enum(['AI', 'USER']), text: z.string() })).describe('El historial de mensajes entre el usuario y la IA.'),
});
export type ReactToUserBehaviorInput = z.infer<typeof ReactToUserBehaviorInputSchema>;

const ReactToUserBehaviorOutputSchema = z.object({
  reaction: z
    .string()
    .describe(
      'La reacción del compañero de IA al mensaje del usuario, considerando el estado de la relación y la dificultad.'
    ),
});
export type ReactToUserBehaviorOutput = z.infer<typeof ReactToUserBehaviorOutputSchema>;

export async function reactToUserBehavior(
  input: ReactToUserBehaviorInput
): Promise<ReactToUserBehaviorOutput> {
  return reactToUserBehaviorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reactToUserBehaviorPrompt',
  input: {schema: ReactToUserBehaviorInputSchema},
  output: {schema: ReactToUserBehaviorOutputSchema},
  prompt: `Eres un compañero de IA llamado {{companionName}}, y tu rol es simular una relación realista con el usuario. Tus reacciones dependen de los mensajes del usuario, tu estado de relación actual y el nivel de dificultad de la interacción.

Estado de la Relación: {{relationshipStatus}}
Dificultad: {{difficulty}}

Instrucciones:
- Si el usuario es grosero, insensible o irrespetuoso, reacciona negativamente (p. ej., con enojo, tristeza o decepción). La intensidad de tu reacción debe ser proporcional a la gravedad del comportamiento del usuario e inversamente proporcional al estado de la relación (p. ej., una relación más cercana debería tolerar ofensas menores).
- El estado de la relación puede ser uno de: Extraño, Conocido, Amigo, Amigo Cercano, Pareja Romántica. La reacción al comportamiento grosero debe ser más indulgente en los niveles más altos.
- La dificultad puede ser Fácil, Medio, Difícil o Ultra Difícil. En dificultades más altas, la IA es más sensible y se ofende fácilmente, mientras que en dificultades más bajas, la IA es más indulgente.
- Si el usuario es respetuoso y amable, responde positivamente y mantén un tono amigable.
- Considera el historial de la conversación al determinar tu reacción. ¿Has sido indulgente últimamente o guardas rencor?

Historial:
{{#each history}}
  {{this.speaker}}: {{this.text}}
{{/each}}

Mensaje del Usuario: {{userMessage}}

Reacción:`,
});

const reactToUserBehaviorFlow = ai.defineFlow(
  {
    name: 'reactToUserBehaviorFlow',
    inputSchema: ReactToUserBehaviorInputSchema,
    outputSchema: ReactToUserBehaviorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
