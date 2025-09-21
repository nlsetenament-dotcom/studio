'use server';

/**
 * @fileOverview A flow to generate a detailed personality description for the AI companion.
 *
 * - generateCompanionPersonality - A function that takes data from the companion creation form and generates a detailed personality description for the AI companion.
 * - GenerateCompanionPersonalityInput - The input type for the generateCompanionPersonality function.
 * - GenerateCompanionPersonalityOutput - The return type for the generateCompanionPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCompanionPersonalityInputSchema = z.object({
  name: z.string().describe('The name of the AI companion.'),
  gender: z.enum(['Masculino', 'Femenino']).describe('The gender of the AI companion.'),
  age: z.number().describe('The age of the AI companion.'),
  hobbies: z.string().describe('The hobbies of the AI companion.'),
  description: z.string().describe('A description of the AI companion provided by the user.'),
});
export type GenerateCompanionPersonalityInput = z.infer<typeof GenerateCompanionPersonalityInputSchema>;

const GenerateCompanionPersonalityOutputSchema = z.object({
  personalityDescription: z.string().describe('A detailed description of the AI companion personality.'),
});
export type GenerateCompanionPersonalityOutput = z.infer<typeof GenerateCompanionPersonalityOutputSchema>;

export async function generateCompanionPersonality(input: GenerateCompanionPersonalityInput): Promise<GenerateCompanionPersonalityOutput> {
  return generateCompanionPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCompanionPersonalityPrompt',
  input: {schema: GenerateCompanionPersonalityInputSchema},
  output: {schema: GenerateCompanionPersonalityOutputSchema},
  prompt: `You are an expert in creating detailed personality descriptions for AI companions based on user input.

  Based on the following information, generate a detailed personality description for the AI companion:

  Name: {{{name}}}
  Gender: {{{gender}}}
  Age: {{{age}}}
  Hobbies: {{{hobbies}}}
  Description: {{{description}}}

  The personality description should be detailed and comprehensive, covering various aspects of the AI companion's character, including their traits, interests, and communication style.
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
