import { AIProvider, GeneratedQuestion, QuizGenerationParams } from "./types";
import Groq from "groq-sdk";

export class GroqProvider implements AIProvider {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({ apiKey });
  }

  async generateQuestions(
    params: QuizGenerationParams,
  ): Promise<GeneratedQuestion[]> {
    const { topic, context, difficulty, count } = params;

    const prompt = `
      You are an expert tutor. Generate ${count} multiple choice questions (MCQ) about "${topic}".
      Difficulty Level: ${difficulty}.
      
      ${context ? `Use the following notes as context for the questions, but feel free to add general knowledge if the notes are sparse:\n${context.substring(0, 3000)}` : ""}

      Return the response STRICTLY as a JSON array of objects. Do not wrap in markdown code blocks. 
      Each object must follow this structure:
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option string exactly matching one of the options",
        "explanation": "Brief explanation",
        "type": "mcq",
        "difficulty": "${difficulty}"
      }
    `;

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful AI that generates JSON.",
          },
          { role: "user", content: prompt },
        ],
        model: "llama-3.1-8b-instant", // User requested replacement model
        response_format: { type: "json_object" },
        // Note: miwtral might not strictly support response_format mode in all SDK versions like GPT,
        // but let's try or handle parsing.
        // Groq often requires explicit instruction similar to OpenAI.
      });

      const content = completion.choices[0]?.message?.content || "[]";

      // Attempt to parse
      let parsed: any;
      try {
        parsed = JSON.parse(content);
        // Sometimes LLMs wrap in { "questions": [...] }
        if (parsed.questions && Array.isArray(parsed.questions)) {
          return parsed.questions;
        }
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return [];
      } catch (e) {
        console.error("JSON Parse Error", e);
        return [];
      }
    } catch (error) {
      console.error("Groq Generation Error", error);
      throw new Error("Failed to generate questions via AI");
    }
  }
}
