import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  throw new Error('Falta la variable de entorno GOOGLE_GENAI_API_KEY. Crea un archivo .env.local con tu API key de Google AI Studio.');
}

export const genAI = new GoogleGenerativeAI(apiKey);

export function getModel() {
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
}
