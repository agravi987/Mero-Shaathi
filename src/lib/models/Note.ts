import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  topicId: mongoose.Types.ObjectId;
  title: string;
  content: string; // Markdown/Rich text
  highlights: string[];
  isImportant: boolean; // Renamed from tags logic for clarity
  needsRevision: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    highlights: [{ type: String }],
    isImportant: { type: Boolean, default: false },
    needsRevision: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Note: Model<INote> =
  mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;
