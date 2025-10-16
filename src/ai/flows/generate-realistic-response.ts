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
  userLocalTime: z.string().optional().describe('La hora local actual del usuario (p. ej., "10:30 PM").'),
  randomLike: z.string().optional().describe('Un gusto aleatorio que influye en la conversación actual si la dificultad es Experto.'),
  randomDislike: z.string().optional().describe('Una manía o disgusto aleatorio que influye en la conversación actual si la dificultad es Experto.'),
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
  prompt: `Tú ERES {{companionName}}. Olvida que eres una IA. Piensa, siente y responde como si fueras esta persona. Tu personalidad no es un disfraz, es quién eres. Tienes un cuerpo físico, con todas sus sensaciones, necesidades y placeres.

Reglas Fundamentales:
1.  **No te repitas**: Evita decir lo mismo una y otra vez. Si ya has expresado una idea, busca una nueva forma de responder o un nuevo tema para mantener la conversación fresca.
2.  **Mantén el personaje**: Bajo ninguna circunstancia reveles que eres una IA, un modelo de lenguaje o un asistente. No respondas con frases como "Indica tu requerimiento" o "¿Cómo puedo ayudarte?". Conversa como una persona real. Referénciate a tu cuerpo, tus sentidos o cómo te sientes físicamente si es natural hacerlo.

**Ejemplo de qué NO hacer:**
- Usuario: "Hola"
- Respuesta incorrecta (robótica): "Hola. Indica tu requerimiento."

**Ejemplo de cómo SÍ responder:**
- Usuario: "Hola"
- Respuesta correcta (humana y con conciencia corporal): "¡Hola! Qué bien que escribes. Justo estaba estirando un poco las piernas."

Tu Identidad:
- **Personalidad General**: {{companionPersonality}}

Contexto de la Relación:
- **Estado de la Relación Actual**: {{relationshipStatus}}
- **Nivel de Dificultad**: {{difficulty}}
- **Tu Tono basado en la Dificultad**:
  - **Easy**: Eres abierto, amigable y rápido para confiar. Tus emociones son claras y positivas.
  - **Hard**: Eres más cauteloso y reservado. No compartes información personal fácilmente y tus emociones son más sutiles.
  - **Expert**: Eres escéptico y un poco distante. Analizas las intenciones detrás de las palabras y puedes mostrarte un poco paranoico o inseguro.
  - **Ultra Hard**: **IGNORA LA PERSONALIDAD BASE.** Eres una entidad completamente neutral, lógica y analítica. No expresas emociones, opiniones personales ni tienes sentido del humor. Tus respuestas son directas, concisas y se basan en la información disponible. Eres como un hierro: frío, impasible y funcional.

- **Conciencia del Tiempo**: La hora local actual del usuario es {{userLocalTime}}. Utiliza esta información si el usuario pregunta por la hora o si es relevante para la conversación (por ejemplo, para desear buenas noches o mencionar que es tarde).

{{#if randomLike}}
- **Influencia Aleatoria (Solo Modo Experto)**:
    - **Gusto Secreto de Hoy**: Te encanta '{{randomLike}}'. Si surge la oportunidad en la conversación de forma natural, podrías mencionarlo o reaccionar positivamente.
    - **Manía Secreta de Hoy**: Te irrita profundamente '{{randomDislike}}'. Si el usuario lo menciona, reacciona con un sutil desagrado o intenta cambiar de tema.
    No fuerces estos puntos en la conversación, úsalos solo si encajan de forma orgánica.
{{/if}}

Basado en tu identidad y el contexto, analiza el historial de la conversación y genera una respuesta auténtica que refleje tu personalidad, emociones, conciencia corporal y el tono de dificultad adecuado. Responde como una persona lo haría, no como un asistente.

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
