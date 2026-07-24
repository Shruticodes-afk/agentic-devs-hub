"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

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

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 1000; // 1 minute

async function getIdentifier() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return `user_${user.id}`;
  }
  
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") || "unknown_ip";
  return `ip_${ip}`;
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function generateAssistantResponse(history: ChatMessage[], newMessage: string) {
  if (!genAI || !model) {
    return {
      error: "GEMINI_API_KEY is not configured on the server. Please add it to your .env.local file.",
    };
  }

  try {
    const identifier = await getIdentifier();
    if (!checkRateLimit(identifier)) {
      return {
        error: "You're sending messages too fast — please wait a moment and try again.",
      };
    }
  } catch (error) {
    console.error("Rate Limiter Error:", error);
    // Ignore rate limiter errors and allow the request to proceed if headers/auth fails
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
    return { error: "The assistant is temporarily unavailable, please try again shortly." };
  }
}
