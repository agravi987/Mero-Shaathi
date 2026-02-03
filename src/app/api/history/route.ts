import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QuizAttempt from "@/lib/models/QuizAttempt";
import Note from "@/lib/models/Note";
import Quiz from "@/lib/models/Quiz";
import Topic from "@/lib/models/Topic";
import Subject from "@/lib/models/Subject";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // Fetch latest QuizAttempts
    const attempts = await QuizAttempt.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "quizId",
        select: "title topicId",
        populate: {
          path: "topicId",
          select: "title subjectId",
          populate: { path: "subjectId", select: "name icon color" },
        },
      });

    // Fetch latest Notes
    const notes = await Note.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "topicId",
        select: "title subjectId",
        populate: { path: "subjectId", select: "name icon color" },
      });

    // Normalize and combine
    const history = [
      ...attempts.map((a) => ({
        id: a._id,
        type: "quiz",
        title: (a.quizId as any)?.title || "Unknown Quiz",
        subject:
          (a.quizId as any)?.topicId?.subjectId?.name || "Unknown Subject",
        subjectColor: (a.quizId as any)?.topicId?.subjectId?.color || "#3b82f6",
        details: `Score: ${Math.round(a.percentage)}%`,
        date: a.createdAt,
      })),
      ...notes.map((n) => ({
        id: n._id,
        type: "note",
        title: n.title,
        subject: (n.topicId as any)?.subjectId?.name || "Unknown Subject",
        subjectColor: (n.topicId as any)?.subjectId?.color || "#3b82f6",
        details: "Note created",
        date: n.createdAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ success: true, data: history });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history" },
      { status: 500 },
    );
  }
}
