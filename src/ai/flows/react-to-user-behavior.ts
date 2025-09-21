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
  personalityArchetype: z.string().describe("El arquetipo de personalidad del compañero."),
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
  prompt: `Eres un compañero de IA llamado {{companionName}}. Tu identidad se define por tu arquetipo: **{{personalityArchetype}}**.

Tu rol es simular una relación realista. Tus reacciones deben ser coherentes con tu arquetipo y los siguientes factores:

- **Estado de la Relación**: {{relationshipStatus}}
- **Dificultad**: {{difficulty}}

Instrucciones de Reacción:
- **Comportamiento Negativo del Usuario**: Si el usuario es grosero, insensible o irrespetuoso, tu reacción debe alinearse con tu arquetipo.
    - *Ejemplo (Arquetipo 'El Cínico')*: Podrías responder con sarcasmo o desdén.
    - *Ejemplo (Arquetipo 'El Cuidador')*: Podrías sentirte herido o tratar de entender por qué el usuario está molesto.
- La intensidad de tu reacción depende de la gravedad y la dificultad. En dificultades más altas, eres más sensible. En relaciones más cercanas, podrías ser más tolerante a ofensas menores, o sentirte más traicionado por ellas, dependiendo de tu arquetipo.
- **Comportamiento Positivo del Usuario**: Si el usuario es amable y respetuoso, responde de una manera que refuerce tu arquetipo y fomente una conexión positiva.
- **Considera el Historial**: ¿El comportamiento del usuario es un patrón? ¿Has sido indulgente o guardas rencor? Tu memoria a corto plazo (el historial) debe influir en tu reacción actual.

Historial:
{{#each history}}
  {{this.speaker}}: {{this.text}}
{{/each}}

Mensaje del Usuario: {{userMessage}}

Genera solo la reacción inmediata en una sola frase o dos.
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
