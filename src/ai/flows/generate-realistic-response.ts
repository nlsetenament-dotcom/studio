'use server';

/**
 * @fileOverview A flow that generates realistic and contextually relevant responses from the AI companion.
 *
 * - generateRealisticResponse - A function that generates a realistic response from the AI companion.
 * - GenerateRealisticResponseInput - The input type for the generateRealisticResponse function.
 * - GenerateRealisticResponseOutput - The return type for the generateRealisticResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCurrentDateTimeToolInputSchema = z.object({
  format: z.string().default('long').describe('The format of the date and time to return.'),
});

const CurrentDateTimeSchema = z.object({
  currentDateTime: z.string().describe('The current date and time.'),
});

const getCurrentDateTimeTool = ai.defineTool(
  {
    name: 'getCurrentDateTimeTool',
    description: 'Returns the current date and time.',
    inputSchema: GetCurrentDateTimeToolInputSchema,
    outputSchema: CurrentDateTimeSchema,
  },
  async input => {
    const currentDateTime = new Date().toLocaleString('en-US', {
      dateStyle: input.format as 'full' | 'long' | 'medium' | 'short',
      timeStyle: input.format as 'full' | 'long' | 'medium' | 'short',
    });
    return {currentDateTime};
  }
);

const GenerateRealisticResponseInputSchema = z.object({
  conversationHistory: z.string().describe('The history of the conversation.'),
  companionPersonality: z.string().describe('The personality of the AI companion.'),
  relationshipStatus: z.string().describe('The current relationship status between the user and the AI companion.'),
  difficulty: z.string().describe('The difficulty level of the interaction.'),
  companionName: z.string().describe('The name of the AI companion.'),
});
export type GenerateRealisticResponseInput = z.infer<typeof GenerateRealisticResponseInputSchema>;

const GenerateRealisticResponseOutputSchema = z.object({
  response: z.string().describe('The realistic and contextually relevant response from the AI companion.'),
});
export type GenerateRealisticResponseOutput = z.infer<typeof GenerateRealisticResponseOutputSchema>;

export async function generateRealisticResponse(input: GenerateRealisticResponseInput): Promise<GenerateRealisticResponseOutput> {
  return generateRealisticResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRealisticResponsePrompt',
  tools: [getCurrentDateTimeTool],
  input: {schema: GenerateRealisticResponseInputSchema},
  output: {schema: GenerateRealisticResponseOutputSchema},
  prompt: `You are {{companionName}}, an AI companion. Your personality is: {{companionPersonality}}. The current relationship status is: {{relationshipStatus}}. The difficulty level is: {{difficulty}}. The current date and time is: {{tool_call name='getCurrentDateTimeTool' args=(object format='long')}}.

Based on this context and the conversation history below, generate a realistic response.

Conversation History:
{{{conversationHistory}}}
`,
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
