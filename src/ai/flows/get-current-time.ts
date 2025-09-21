'use server';

/**
 * @fileOverview Un flujo que obtiene la fecha y hora actuales.
 *
 * - getCurrentTime - Una función que devuelve la fecha y hora actuales.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// No necesitamos un esquema de entrada ya que la función no toma argumentos.
const GetCurrentTimeOutputSchema = z.object({
  currentTime: z.string().describe('La fecha y hora actuales en formato ISO 8601.'),
});
export type GetCurrentTimeOutput = z.infer<typeof GetCurrentTimeOutputSchema>;

export async function getCurrentTime(): Promise<GetCurrentTimeOutput> {
  return getCurrentTimeFlow();
}

const getCurrentTimeFlow = ai.defineFlow(
  {
    name: 'getCurrentTimeFlow',
    inputSchema: z.undefined(),
    outputSchema: GetCurrentTimeOutputSchema,
  },
  async () => {
    const now = new Date();
    return {
      currentTime: now.toISOString(),
    };
  }
);
