import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuestion extends Document {
  quizId: mongoose.Types.ObjectId;
  type: "mcq" | "trueFalse" | "fillBlank";
  question: string;
  options: string[]; // For MCQ only
  correctAnswer: string;
  explanation: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    type: {
      type: String,
      enum: ["mcq", "trueFalse", "fillBlank"],
      required: true,
    },
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String },
    marks: { type: Number, default: 1 },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Question: Model<IQuestion> =
  mongoose.models.Question ||
  mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
