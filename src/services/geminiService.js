import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: 'YOUR_GEMINI_API_KEY' });

export const getGeminiFeedback = async (thesisText) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `You are an academic thesis advisor. Review this draft:\n\n${thesisText}`,
  });
  return response.text;
};