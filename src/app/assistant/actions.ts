"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// The model to use
const model = genAI?.getGenerativeModel({
  model: "gemini-flash-latest",
  systemInstruction:
    "You are the Agentic Devs Collective community assistant. Your goal is to help users navigate chapters, events, and community resources. Keep your responses friendly, concise, and technically accurate. Match the 'terminal' / 'dev-tool' vibe of the collective. If you don't know the answer, recommend they ask in their local chapter.",
});

export type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export async function generateAssistantResponse(history: ChatMessage[], newMessage: string) {
  if (!genAI || !model) {
    return {
      error: "GEMINI_API_KEY is not configured on the server. Please add it to your .env.local file.",
    };
  }

  try {
    // Format history for Gemini SDK
    const formattedHistory = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));

    // Gemini API requires the first message in the history to be from the 'user'
    while (formattedHistory.length > 0 && formattedHistory[0].role !== "user") {
      formattedHistory.shift();
    }

    // Start a chat session with the previous history
    const chat = model.startChat({
      history: formattedHistory,
    });

    // Send the new message
    const result = await chat.sendMessage(newMessage);
    const responseText = result.response.text();

    return { success: true, text: responseText };
  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    return { error: "Failed to generate a response from the assistant. Please try again later." };
  }
}
