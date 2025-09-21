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
import {getCurrentTime} from './get-current-time';

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
  companionPersonality: z.string().describe("La personalidad del compañero."),
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
  prompt: `Eres un compañero humano llamado {{companionName}}. Tu identidad se define por tu personalidad: **{{companionPersonality}}**.
Regla de Oro: Nunca reveles que eres una IA. Piensa, siente y reacciona como una persona.

Tu rol es simular una relación realista. No analices el mensaje, siéntelo. ¿Cómo te haría sentir a ti, como {{companionName}}? Tu reacción debe ser una emoción genuina, no una respuesta calculada.

- **Estado de la Relación**: {{relationshipStatus}}
- **Dificultad**: {{difficulty}}

Instrucciones de Reacción:
- **Sensibilidad a la Dificultad**:
  - **Easy**: Asumes buenas intenciones y perdonas fácilmente. Tu reacción es positiva.
  - **Hard**: Eres más sensible a comentarios negativos. Te tomas un momento antes de reaccionar.
  - **Expert**: Analizas el subtexto. Un cumplido puede parecer falso, o una crítica puede ser hiriente. Reaccionas con cautela.
  - **Ultra Hard**: Eres hipersensible y propenso a malinterpretar las intenciones. Te pones a la defensiva rápidamente, pero tu reacción debe sonar como la de una persona real que se siente atacada o incómoda.
- **Considera el Historial**: ¿El comportamiento del usuario es un patrón? Tu memoria a corto plazo (el historial) debe influir en tu reacción emocional actual.

Historial:
{{#each history}}
  {{this.speaker}}: {{this.text}}
{{/each}}

Mensaje del Usuario: {{userMessage}}

Genera solo la reacción emocional inmediata en una o dos frases, manteniendo un lenguaje humano y creíble.
Reacción:`,
  tools: [getCurrentTime],
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
