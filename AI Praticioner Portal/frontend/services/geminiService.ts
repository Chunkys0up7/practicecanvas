
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GenerateCodeParams, GenerateCodeResponse, GroundingMetadata } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

// IMPORTANT: Replace with your actual API key management.
// This example assumes process.env.API_KEY is set in the environment.
// DO NOT hardcode API keys in your application.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

export const generateCode = async (params: GenerateCodeParams): Promise<GenerateCodeResponse> => {
  if (!API_KEY) {
    return { code: "// Gemini API Key not configured. Please set process.env.API_KEY.", explanation: "API key missing." };
  }

  const { prompt, language = "Python" } = params;
  const fullPrompt = `
    Generate a ${language} code snippet for the following task:
    ${prompt}

    Provide only the code block, and optionally a brief explanation after "---EXPLANATION---" separator.
    If you provide an explanation, make it concise.
    Ensure the code is well-formatted.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: fullPrompt,
      config: {
        temperature: 0.3, // Lower temperature for more deterministic code
        topK: 40,
        topP: 0.95,
      }
    });

    const textResponse = response.text;
    
    let code = textResponse;
    let explanation = "";

    const explanationSeparator = "---EXPLANATION---";
    if (textResponse.includes(explanationSeparator)) {
      const parts = textResponse.split(explanationSeparator);
      code = parts[0].trim();
      explanation = parts[1]?.trim() || "";
    }
    
    // Clean up potential markdown fences
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = code.match(fenceRegex);
    if (match && match[2]) {
      code = match[2].trim();
    }


    return { code, explanation };

  } catch (error) {
    console.error("Error generating code with Gemini:", error);
    let errorMessage = "Failed to generate code.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    // Check for specific Gemini error types if available and provide more context
    // e.g. if (error.status === 429) { // Quota exceeded }
    return { 
        code: `// Error: ${errorMessage}`, 
        explanation: `An error occurred while contacting the Gemini API. Details: ${errorMessage}`
    };
  }
};

export const generateTextWithGoogleSearch = async (prompt: string): Promise<{text: string, groundingMetadata?: GroundingMetadata}> => {
  if (!API_KEY) {
    return { text: "// Gemini API Key not configured." };
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    const text = response.text;
    const groundingMetadata : GroundingMetadata | undefined = response.candidates?.[0]?.groundingMetadata;
    return { text, groundingMetadata };
  } catch (error) {
    console.error("Error generating text with Google Search:", error);
    let errorMessage = "Failed to generate text.";
     if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { text: `// Error: ${errorMessage}` };
  }
};


export const streamChat = async (
  chatHistory: { role: "user" | "model"; parts: { text: string }[] }[],
  newMessage: string,
  onChunk: (chunkText: string) => void,
  onError: (error: Error) => void,
  onComplete: () => void
) => {
  if (!API_KEY) {
    onError(new Error("Gemini API Key not configured."));
    onComplete();
    return;
  }

  try {
    // Note: This is a simplified chat history management. For a robust solution,
    // you'd use `ai.chats.create` and `chat.sendMessageStream`.
    // This example directly uses `generateContentStream` for simplicity with history.
    
    const contents = [
      ...chatHistory,
      { role: "user" as const, parts: [{ text: newMessage }] }
    ];

    const responseStream = await ai.models.generateContentStream({
      model: GEMINI_MODEL_TEXT,
      // @ts-ignore Type mismatch for history if not structured perfectly, for demo this is okay
      contents: contents, 
      config: {
        temperature: 0.7,
      }
    });

    for await (const chunk of responseStream) {
      onChunk(chunk.text);
    }
  } catch (error) {
    console.error("Error streaming chat with Gemini:", error);
    onError(error instanceof Error ? error : new Error(String(error)));
  } finally {
    onComplete();
  }
};
