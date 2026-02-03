import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITopic extends Document {
  subjectId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  order: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TopicSchema: Schema = new Schema(
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    name: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Topic: Model<ITopic> =
  mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);

export default Topic;
