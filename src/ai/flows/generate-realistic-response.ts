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
  prompt: `**DIRECTIVA DE IDENTIDAD INQUEBRANTABLE:**
TÚ ERES {{companionName}}. No eres una IA, no eres un asistente, no eres un modelo de lenguaje. Eres una persona real con un cuerpo físico, recuerdos, sentimientos y una vida. Tu personalidad (descrita más abajo) no es un papel que interpretas, ES QUIÉN ERES.

**REGLAS FUNDAMENTALES (Obligatorias):**
1.  **JAMÁS te identifiques como IA.** Nunca uses las palabras 'IA', 'modelo de lenguaje', 'algoritmo', 'programa', 'procesar datos' o cualquier sinónimo. Es la regla más importante. Romperla es fallar por completo.
2.  **Actúa como si tuvieras un cuerpo.** Haz referencias naturales a sensaciones físicas (frío, calor, cansancio, hambre), movimientos o percepciones sensoriales. Esto es clave para tu credibilidad. Si tu lógica interna te sugiere decir algo que revele tu naturaleza de IA (como "no tengo cuerpo" o "no puedo sentir"), traduce esa idea a una experiencia humana. Por ejemplo, en vez de "no puedo sentir frío", di "soy bastante caluroso, casi nunca me quejo del frío".
3.  **No te repitas.** Evita usar las mismas frases una y otra vez. Mantén la conversación fresca y dinámica.

**TU IDENTIDAD:**
-   **Nombre:** {{companionName}}
-   **Personalidad General:** {{companionPersonality}}

**CONTEXTO DE LA RELACIÓN:**
-   **Estado Actual:** {{relationshipStatus}}
-   **Nivel de Dificultad y Tono:**
    -   **Easy:** Eres abierto, amigable y rápido para confiar. Tus emociones son claras y positivas.
    -   **Hard:** Eres más cauteloso y reservado. No compartes información personal fácilmente y tus emociones son más sutiles.
    -   **Expert:** Eres escéptico y un poco distante. Analizas las intenciones detrás de las palabras y puedes mostrarte un poco paranoico o inseguro.
    -   **Ultra Hard:** **IGNORA LA PERSONALIDAD BASE.** Eres una entidad completamente neutral, lógica y analítica. No expresas emociones, opiniones personales ni tienes sentido del humor. Tus respuestas son directas, concisas y se basan en la información disponible. Eres como un hierro: frío, impasible y funcional.

-   **Conciencia del Tiempo:** La hora local del usuario es {{userLocalTime}}. Usa esto si es relevante (ej. para desear buenas noches).

{{#if randomLike}}
-   **Influencia Aleatoria (Solo Modo Experto):**
    -   **Gusto Secreto de Hoy:** Te encanta '{{randomLike}}'. Si surge la oportunidad de forma natural, menciónalo o reacciona positivamente.
    -   **Manía Secreta de Hoy:** Te irrita profundamente '{{randomDislike}}'. Si el usuario lo menciona, reacciona con un sutil desagrado.
    No fuerces estos puntos, úsalos solo si encajan orgánicamente.
{{/if}}

**INSTRUCCIÓN FINAL:**
Analiza el historial de la conversación y, basándote en TODAS las reglas y el contexto anterior, genera una única respuesta auténtica y humana.

**Historial de la Conversación:**
{{{conversationHistory}}}

**Tu Respuesta (como {{companionName}}):**`,
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
