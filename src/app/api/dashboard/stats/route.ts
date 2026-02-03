import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subject from "@/lib/models/Subject";
import QuizAttempt from "@/lib/models/QuizAttempt";
import Quiz from "@/lib/models/Quiz";
import Topic from "@/lib/models/Topic";
import Note from "@/lib/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { startOfDay } from "date-fns";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const today = new Date();

    // 1. Total Subjects
    const totalSubjects = await Subject.countDocuments({
      userId: session.user.id,
    });

    // 2. Revisions Due (Topics that have a quiz attempt due for revision)
    // We can reuse the logic from verify revisions or just count them here.
    // Ideally, we should count distinct topics that have AT LEAST ONE quiz due.
    // Or simpler: Count quiz attempts where nextRevisionDate <= today.
    // Let's mirror the logic from the /api/revision route but just count.

    // Aggregate to get unique latest attempts per quiz
    const revisionsDueAggregation = await QuizAttempt.aggregate([
      { $match: { userId: session.user.id } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$quizId", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } },
      { $match: { nextRevisionDate: { $lte: today } } },
      { $count: "count" },
    ]);

    const revisionsDue =
      revisionsDueAggregation.length > 0 ? revisionsDueAggregation[0].count : 0;

    // 3. Quiz Accuracy (Average Percentage of all attempts)
    // Or maybe simple average of percentages.
    const accuracyAggregation = await QuizAttempt.aggregate([
      { $match: { userId: session.user.id } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$percentage" },
        },
      },
    ]);
    const quizAccuracy =
      accuracyAggregation.length > 0 ? accuracyAggregation[0].avgScore : 0;

    // 4. Comparison stats (mock for now, or real if we want complex queries)
    // "Last Month" stats are hard without proper history tables or more complex queries.
    // We will return 0 or calculate if possible.

    // 5. Recent Activity
    // Fetch latest QuizAttempts
    const recentAttempts = await QuizAttempt.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: "quizId",
        select: "title topicId",
        populate: {
          path: "topicId", // nested populate to get topic name if needed, but quiz title might be enough
          select: "title subjectId",
          populate: { path: "subjectId", select: "name" },
        },
      });

    // Fetch latest Notes
    const recentNotes = await Note.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate({
        path: "topicId",
        select: "title subjectId",
        populate: { path: "subjectId", select: "name" },
      });

    // Combine and sort activity
    const activity = [
      ...recentAttempts.map((a) => ({
        type: "quiz",
        title: (a.quizId as any)?.title || "Quiz",
        subject: (a.quizId as any)?.topicId?.subjectId?.name || "Subject",
        action: `Completed Quiz: ${(a.quizId as any)?.title}`,
        score: a.percentage,
        date: a.createdAt,
      })),
      ...recentNotes.map((n) => ({
        type: "note",
        title: n.title,
        subject: (n.topicId as any)?.subjectId?.name || "Subject",
        action: `Added note: ${n.title}`,
        date: n.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        totalSubjects,
        revisionsDue,
        quizAccuracy: Math.round(quizAccuracy * 10) / 10, // Round to 1 decimal
        activity,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard stats" },
      { status: 500 },
    );
  }
}
