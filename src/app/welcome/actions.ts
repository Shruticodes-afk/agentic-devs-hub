"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateOnboardingMessage(name: string, city: string, chapterSlug: string | null, eventTitle: string | null) {
  if (!genAI) {
    return `Welcome to the Agentic Devs Collective, ${name}! We're thrilled to have you join our community in ${city}.`;
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction:
        "You are a friendly, concise onboarding assistant for the Agentic Devs Collective community platform. Write a personalized 2-3 sentence welcome message for a new user. Keep it natural, conversational, and direct. Do not use emojis, markdown, or boilerplate language.",
    });

    let prompt = `Write a welcome message for ${name} who just joined from ${city}.`;
    if (chapterSlug) {
      prompt += ` Mention their local chapter.`;
    }
    if (eventTitle) {
      prompt += ` Also casually mention that there is an upcoming event they can register for: "${eventTitle}".`;
    }

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error in onboarding:", error);
    return `Welcome to the Agentic Devs Collective, ${name}! We're thrilled to have you join our community in ${city}.`;
  }
}
