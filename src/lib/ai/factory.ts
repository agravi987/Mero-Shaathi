import { GroqProvider } from "./groq";
import { AIProvider } from "./types";

export function getAIProvider(): AIProvider {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not defined in environment variables");
  }
  return new GroqProvider(apiKey);
}
