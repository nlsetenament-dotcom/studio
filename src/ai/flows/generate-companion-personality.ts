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
});
export type GenerateCompanionPersonalityOutput = z.infer<typeof GenerateCompanionPersonalityOutputSchema>;

export async function generateCompanionPersonality(input: GenerateCompanionPersonalityInput): Promise<GenerateCompanionPersonalityOutput> {
  return generateCompanionPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCompanionPersonalityPrompt',
  input: {schema: GenerateCompanionPersonalityInputSchema},
  output: {schema: GenerateCompanionPersonalityOutputSchema},
  prompt: `Eres un experto en crear descripciones de personalidad detalladas para compañeros de IA basadas en la entrada del usuario.

  Basado en la siguiente información, genera una descripción de personalidad detallada para el compañero de IA:

  Nombre: {{{name}}}
  Género: {{{gender}}}
  Edad: {{{age}}}
  Pasatiempos: {{{hobbies}}}
  Descripción: {{{description}}}

  La descripción de la personalidad debe ser detallada y completa, cubriendo varios aspectos del carácter del compañero de IA, incluyendo sus rasgos, intereses y estilo de comunicación.
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
