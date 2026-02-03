import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  icon: string; // Lucide icon name
  color: string; // Theme color
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String, default: "Book" },
    color: { type: String, default: "#3b82f6" },
  },
  { timestamps: true },
);

// Prevent overwriting model during hot reload
const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;
