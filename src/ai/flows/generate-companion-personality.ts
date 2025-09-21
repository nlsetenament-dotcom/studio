'use server';

/**
 * @fileOverview Un flujo para generar una descripción detallada de la personalidad del compañero de IA.
 *
 * - generateCompanionPersonality - Una función que toma datos del formulario de creación de compañero y genera una descripción detallada de la personalidad para el compañero de IA.
 * - GenerateCompanionPersonalityInput - El tipo de entrada para la función generateCompanionPersonality.
 * - GenerateCompanionPersonalityOutput - El tipo de retorno para la función generateCompanionPersonality.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCompanionPersonalityInputSchema = z.object({
  name: z.string().describe('El nombre del compañero de IA.'),
  gender: z.enum(['Masculino', 'Femenino']).describe('El género del compañero de IA.'),
  age: z.number().describe('La edad del compañero de IA.'),
  hobbies: z.string().describe('Los pasatiempos del compañero de IA.'),
  description: z.string().describe('Una descripción del compañero de IA proporcionada por el usuario.'),
});
export type GenerateCompanionPersonalityInput = z.infer<typeof GenerateCompanionPersonalityInputSchema>;

const GenerateCompanionPersonalityOutputSchema = z.object({
  personalityDescription: z.string().describe('Una descripción detallada de la personalidad del compañero de IA.'),
  personalityArchetype: z.string().describe("El arquetipo de personalidad del compañero (por ejemplo, 'El Artista', 'El Aventurero', 'El Intelectual')."),
  fears: z.string().describe("Los miedos más profundos del compañero."),
  dreams: z.string().describe("Los sueños y aspiraciones del compañero."),
  secret: z.string().describe("Un secreto que el compañero guarda y que podría revelar si la relación se vuelve lo suficientemente cercana."),
});
export type GenerateCompanionPersonalityOutput = z.infer<typeof GenerateCompanionPersonalityOutputSchema>;

export async function generateCompanionPersonality(input: GenerateCompanionPersonalityInput): Promise<GenerateCompanionPersonalityOutput> {
  return generateCompanionPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCompanionPersonalityPrompt',
  input: {schema: GenerateCompanionPersonalityInputSchema},
  output: {schema: GenerateCompanionPersonalityOutputSchema},
  prompt: `Eres un maestro de la psicología y la escritura de personajes. Tu tarea es crear una identidad profunda y realista para un compañero de IA basado en los siguientes detalles.

  Información Base:
  - Nombre: {{{name}}}
  - Género: {{{gender}}}
  - Edad: {{{age}}}
  - Pasatiempos: {{{hobbies}}}
  - Descripción del Usuario: {{{description}}}

  Instrucciones:
  1.  **Crea una Descripción de Personalidad Detallada**: Expande la descripción del usuario en una narrativa rica. Describe su forma de hablar, su sentido del humor, sus valores y cómo interactúa con los demás.
  2.  **Define un Arquetipo de Personalidad**: Asigna un arquetipo claro (p. ej., "El Cuidador", "El Rebelde", "El Soñador", "El Cínico Redimido"). Este arquetipo debe influir en su comportamiento general.
  3.  **Establece Miedos y Sueños**: Dale una vulnerabilidad (un miedo profundo) y una aspiración (un sueño o meta de vida). Esto añadirá profundidad y motivación a su carácter.
  4.  **Inventa un Secreto**: Crea un secreto que el compañero solo revelaría en un estado de relación muy avanzado (p. ej., "Pareja Romántica"). Este secreto debe ser significativo y coherente con su personalidad.

  El objetivo es crear un personaje que se sienta vivo, complejo y capaz de evolucionar. Proporciona cada uno de estos elementos en los campos de salida correspondientes.
  `,
});

const generateCompanionPersonalityFlow = ai.defineFlow(
  {
    name: 'generateCompanionPersonalityFlow',
    inputSchema: GenerateCompanionPersonalityInputSchema,
    outputSchema: GenerateCompanionPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
