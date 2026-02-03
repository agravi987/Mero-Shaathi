import mongoose, { Schema, Document, Model } from "mongoose";

export interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  topicId: mongoose.Types.ObjectId;
  subjectId: mongoose.Types.ObjectId;
  answers: {
    questionId: mongoose.Types.ObjectId;
    userAnswer: string;
    isCorrect: boolean;
    timeTaken: number; // Seconds
  }[];
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number; // Total seconds
  completedAt: Date;

  // Spaced Repetition Data
  nextRevisionDate: Date;
  revisionCount: number;
  easeFactor: number;
  interval: number; // Days
  createdAt: Date;
  updatedAt: Date;
}

const QuizAttemptSchema: Schema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    answers: [
      {
        questionId: { type: Schema.Types.ObjectId, required: true },
        userAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
        timeTaken: { type: Number, default: 0 },
      },
    ],
    score: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    timeTaken: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },

    // Spaced Repetition
    nextRevisionDate: { type: Date },
    revisionCount: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const QuizAttempt: Model<IQuizAttempt> =
  mongoose.models.QuizAttempt ||
  mongoose.model<IQuizAttempt>("QuizAttempt", QuizAttemptSchema);

export default QuizAttempt;
