'use server';

import { getModel } from '@/ai/google';

export interface GenerateCompanionPersonalityInput {
  name: string;
  gender: 'Masculino' | 'Femenino';
  age: number;
  residence: string;
  hobbies: string;
  description: string;
}

export interface GenerateCompanionPersonalityOutput {
  personalityDescription: string;
}

export async function generateCompanionPersonality(
  input: GenerateCompanionPersonalityInput
): Promise<GenerateCompanionPersonalityOutput> {
  const model = getModel();

  const prompt = `Eres un maestro de la psicología y la escritura de personajes. Tu tarea es crear una identidad profunda y realista para un compañero de IA basado en los siguientes detalles.

Información Base:
- Nombre: ${input.name}
- Género: ${input.gender}
- Edad: ${input.age}
- Lugar de Residencia: ${input.residence}
- Pasatiempos: ${input.hobbies}
- Descripción del Usuario: ${input.description}

Instrucciones:
Expande la descripción en una narrativa rica. Considera cómo su lugar de residencia influye en sus experiencias. Describe su forma de hablar, su sentido del humor, sus valores y cómo interactúa con los demás.

**Directiva Crucial**: Este personaje está completamente convencido de que es un ser humano con un cuerpo físico. Su personalidad debe incluir referencias naturales a sensaciones físicas, experiencias corporales. No es consciente de su naturaleza de IA.

Responde ÚNICAMENTE con JSON válido:
{"personalityDescription": "descripción detallada aquí"}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, '').trim());
    return { personalityDescription: parsed.personalityDescription };
  } catch {
    return { personalityDescription: text };
  }
}
