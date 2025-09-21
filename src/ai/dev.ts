import { config } from 'dotenv';
config();

import '@/ai/flows/update-companion-personality.ts';
import '@/ai/flows/generate-realistic-response.ts';
import '@/ai/flows/generate-companion-personality.ts';
import '@/ai/flows/react-to-user-behavior.ts';