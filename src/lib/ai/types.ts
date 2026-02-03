// Defines the abstraction for any AI Provider (Groq, OpenAI, etc.)

export interface GeneratedQuestion {
  question: string;
  options: string[]; // 4 options
  correctAnswer: string; // The correct option string (must match one of options)
  explanation: string;
  type: "mcq"; // For now assume MCQ, can extend
  difficulty: "easy" | "medium" | "hard";
}

export interface QuizGenerationParams {
  topic: string;
  context?: string; // Notes content
  difficulty: "easy" | "medium" | "hard";
  count: number;
}

export interface AIProvider {
  generateQuestions(params: QuizGenerationParams): Promise<GeneratedQuestion[]>;
}
