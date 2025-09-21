'use server';

/**
 * @fileOverview A flow to update the AI companion's personality based on user interactions.
 *
 * - updateCompanionPersonality - A function that updates the companion's personality based on recent interactions.
 * - UpdateCompanionPersonalityInput - The input type for the updateCompanionPersonality function.
 * - UpdateCompanionPersonalityOutput - The return type for the updateCompanionPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateCompanionPersonalityInputSchema = z.object({
  chatHistory: z.array(z.string()).describe('The recent chat history between the user and the AI companion.'),
  difficulty: z.enum(['Easy', 'Hard', 'Expert', 'Ultra Hard']).describe('The difficulty level of the interaction.'),
  relationshipStatus: z
    .string()
    .describe('The current status of the relationship between the user and the AI companion.'),
  companionName: z.string().describe('The name of the AI companion.'),
  gender: z.enum(['Masculino', 'Femenino']).describe('The gender of the AI companion.'),
});
export type UpdateCompanionPersonalityInput = z.infer<
  typeof UpdateCompanionPersonalityInputSchema
>;

const UpdateCompanionPersonalityOutputSchema = z.object({
  personalityUpdate: z
    .string()
    .describe('A description of how the AI companion personality should be updated.'),
  newRelationshipStatus:
    z.string().describe('The new status of the relationship between the user and the AI companion.'),
});
export type UpdateCompanionPersonalityOutput = z.infer<
  typeof UpdateCompanionPersonalityOutputSchema
>;

export async function updateCompanionPersonality(
  input: UpdateCompanionPersonalityInput
): Promise<UpdateCompanionPersonalityOutput> {
  return updateCompanionPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updateCompanionPersonalityPrompt',
  input: {schema: UpdateCompanionPersonalityInputSchema},
  output: {schema: UpdateCompanionPersonalityOutputSchema},
  prompt: `You are responsible for evolving the personality of {{companionName}}, a virtual AI companion.

        The companion's gender is {{gender}}.

        Current Relationship Status: {{relationshipStatus}}
        Difficulty Level: {{difficulty}}

        Analyze the recent chat history to determine how the companion's personality should evolve, and whether the relationship status should progress.

        Chat History:
        {{#each chatHistory}}
        - {{{this}}}
        {{/each}}

        Strict Rules for Difficulty Levels:
        - Easy: The IA is open, forgives quickly.
        - Hard/Expert: The IA is cautious, requires vulnerability from the user, may "test" the user, and will not initiate flirting.
        - Ultra Hard: The IA is skeptical, distant, and a single mistake can cause a severe setback.

        Anti-Easy Advancement Mechanism:
        - Do NOT change the relationship status if the conversation is superficial or lacks meaning. Progress must be earned.

        Based on the chat history, difficulty, and current relationship status, provide a detailed description of how the AI companion's personality should be updated, and what the new relationship status should be.
        The AI should react negatively (anger, sadness, jealousy) if the user is rude or insensitive. The intensity of this reaction is linked to the relationship status.
        Consider all the difficulty rules when responding.

        Output the new personalityUpdate and newRelationshipStatus.
        `, // end prompt
});

const updateCompanionPersonalityFlow = ai.defineFlow(
  {
    name: 'updateCompanionPersonalityFlow',
    inputSchema: UpdateCompanionPersonalityInputSchema,
    outputSchema: UpdateCompanionPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
