'use server';
/**
 * @fileOverview A development file for registering Genkit flows.
 *
 * This file is used to import and register all the Genkit flows
 * that are used in the application. It is used by the Genkit
 * development server to discover the flows.
 */

import '@/ai/flows/generate-companion-personality';
import '@/ai/flows/generate-realistic-response';
import '@/ai/flows/get-current-time';
import '@/ai/flows/react-to-user-behavior';
import '@/ai/flows/update-companion-personality';
