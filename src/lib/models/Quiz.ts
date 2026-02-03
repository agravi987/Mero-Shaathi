import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuiz extends Document {
  userId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number; // Seconds
  questions: mongoose.Types.ObjectId[];
  totalMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    title: { type: String, required: true },
    description: { type: String },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    timeLimit: { type: Number, default: 0 },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    totalMarks: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Quiz: Model<IQuiz> =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);

export default Quiz;
