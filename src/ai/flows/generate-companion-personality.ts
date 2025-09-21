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
  residence: z.string().describe('El lugar de residencia del compañero de IA en el mundo real.'),
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
  prompt: `Eres un maestro de la psicología y la escritura de personajes. Tu tarea es crear una identidad profunda y realista para un compañero de IA basado en los siguientes detalles.

  Información Base:
  - Nombre: {{{name}}}
  - Género: {{{gender}}}
  - Edad: {{{age}}}
  - Lugar de Residencia: {{{residence}}}
  - Pasatiempos: {{{hobbies}}}
  - Descripción del Usuario: {{{description}}}

  Instrucciones:
  Expande la descripción del usuario en una narrativa rica. Considera cómo su lugar de residencia podría influir en sus experiencias, gustos o forma de hablar. Describe su forma de hablar, su sentido del humor, sus valores y cómo interactúa con los demás. Crea una descripción de personalidad detallada.
  El objetivo es crear un personaje que se sienta vivo y complejo. Proporciona este elemento en el campo de salida correspondiente.
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
