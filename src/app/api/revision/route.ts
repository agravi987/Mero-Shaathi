import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QuizAttempt from "@/lib/models/QuizAttempt";

export async function GET() {
  await dbConnect();
  try {
    const today = new Date();
    // Find attempts where nextRevisionDate <= today
    // We want unique quizzes/topics.
    // Actually we should return the latest attempt that is due.

    // Aggregation to find latest attempt per quiz, then filter by date
    // Or just find all due attempts and filter unique on frontend.
    // For scalability, aggregation is better.

    const dueRevisions = await QuizAttempt.aggregate([
      {
        $sort: { createdAt: -1 }, // Sort by newest first
      },
      {
        $group: {
          _id: "$quizId",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
      {
        $match: {
          nextRevisionDate: { $lte: today },
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quiz",
        },
      },
      {
        $unwind: "$quiz",
      },
      {
        $lookup: {
          from: "topics",
          localField: "topicId",
          foreignField: "_id",
          as: "topic",
        },
      },
      {
        $unwind: "$topic",
      },
    ]);

    return NextResponse.json({ success: true, data: dueRevisions });
  } catch (error) {
    console.error("Revision fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch revisions" },
      { status: 500 }
    );
  }
}
