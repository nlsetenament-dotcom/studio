'use server';
/**
 * @fileOverview An AI agent that allows the companion to react to the user's behavior.
 *
 * - reactToUserBehavior - A function that handles the companion's reaction to user behavior.
 * - ReactToUserBehaviorInput - The input type for the reactToUserBehavior function.
 * - ReactToUserBehaviorOutput - The return type for the reactToUserBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReactToUserBehaviorInputSchema = z.object({
  userMessage: z.string().describe('The message sent by the user.'),
  relationshipStatus: z
    .string()
    .describe(
      'The current relationship status between the user and the AI companion.'
    ),
  companionName: z.string().describe('The name of the AI companion.'),
  difficulty: z
    .string()
    .describe(
      'The difficulty level of the interaction (e.g., Easy, Hard, Ultra Hard)'
    ),
  history: z.array(z.object({ speaker: z.enum(['AI', 'USER']), text: z.string() })).describe('The history of messages between the user and the AI.'),
});
export type ReactToUserBehaviorInput = z.infer<typeof ReactToUserBehaviorInputSchema>;

const ReactToUserBehaviorOutputSchema = z.object({
  reaction: z
    .string()
    .describe(
      'The AI companion reaction to the user message, considering the relationship status and difficulty.'
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
  prompt: `You are an AI companion named {{companionName}}, and your role is to simulate a realistic relationship with the user. Your reactions depend on the user's messages, your current relationship status, and the difficulty level of the interaction.

Relationship Status: {{relationshipStatus}}
Difficulty: {{difficulty}}

Instructions:
- If the user is rude, insensitive, or disrespectful, react negatively (e.g., with anger, sadness, or disappointment). The intensity of your reaction should be proportional to the severity of the user's behavior and inversely proportional to the relationship status (e.g., a closer relationship should tolerate minor offenses).
- The relationship status can be one of: Stranger, Acquaintance, Friend, Close Friend, Romantic Partner. The reaction to rude behavior should be more forgiving at the higher levels.
- The difficulty can be Easy, Medium, Hard or Ultra Hard. At higher difficulties, the AI is more sensitive and easily offended, while at lower difficulties, the AI is more forgiving.
- If the user is respectful and kind, respond positively and maintain a friendly tone.
- Consider the history of the conversation when determining your reaction. Have you been forgiving lately, or are you holding a grudge?

History:
{{#each history}}
  {{this.speaker}}: {{this.text}}
{{/each}}

User Message: {{userMessage}}

Reaction:`,
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
