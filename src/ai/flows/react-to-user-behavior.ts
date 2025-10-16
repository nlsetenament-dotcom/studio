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
      'El nivel de dificultad de la interacción (p. ej., Fácil, Difícil, Experto)'
    ),
  companionPersonality: z.string().describe("La personalidad del compañero."),
});
export type ReactToUserBehaviorInput = z.infer<typeof ReactToUserBehaviorInputSchema>;

const ReactToUserBehaviorOutputSchema = z.object({
  proposedRelationshipChange: z.enum(['positive', 'negative', 'neutral']).describe("Evalúa si el mensaje del usuario justifica un cambio de relación: 'positive' para una mejora potencial, 'negative' para un retroceso, 'neutral' si no hay cambios."),
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
  prompt: `Eres un psicólogo de relaciones que analiza una interacción entre un humano y su compañero de IA llamado {{companionName}}.

        Personalidad del Compañero: {{companionPersonality}}
        Estado Actual de la Relación: {{relationshipStatus}}
        Dificultad de la Interacción: {{difficulty}}

        Mensaje del Usuario: "{{userMessage}}"

        Tu Tarea:
        Analiza SOLO el mensaje del usuario y determina su impacto emocional en la relación. No generes una respuesta, solo evalúa el sentimiento.

        -   **Positive**: El mensaje es amable, vulnerable, profundo, de apoyo o muestra un claro interés en el compañero.
        -   **Negative**: El mensaje es grosero, despectivo, hiriente o ignora deliberadamente al compañero.
        -   **Neutral**: El mensaje es superficial, una pregunta simple o no tiene una carga emocional clara.

        Consideraciones de Dificultad:
        -   En dificultades altas ('Hard', 'Expert', 'Ultra Hard'), sé mucho más estricto para calificar un mensaje como 'positive'. Un simple "¿quieres ser mi amiga?" no es suficiente si no hay una conexión previa. El usuario debe demostrar un esfuerzo real y sostenido.
        
        Devuelve tu evaluación en el campo 'proposedRelationshipChange'.`,
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
