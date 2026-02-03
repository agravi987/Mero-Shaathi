import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QuizAttempt from "@/lib/models/QuizAttempt";
import Subject from "@/lib/models/Subject";
import { startOfDay, subDays, format } from "date-fns";

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    // 1. Subject Mastery (Average Score per Object)
    // We need to aggregate attempts by Subject.
    // However, QuizAttempt stores 'quizId', 'topicId', 'subjectId'.
    // If we populated subjectId correctly on creation, this is easy.
    // Let's check QuizAttempt model. Yes, it has subjectId.

    const masteryAggregation = await QuizAttempt.aggregate([
      {
        $group: {
          _id: "$subjectId",
          avgScore: { $avg: "$percentage" },
          attempts: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "_id",
          as: "subject",
        },
      },
      { $unwind: "$subject" },
      {
        $project: {
          subjectName: "$subject.name",
          avgScore: 1,
          attempts: 1,
        },
      },
    ]);

    // 2. Daily Activity (Last 7 Days)
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(today, 6 - i);
      return format(d, "yyyy-MM-dd");
    });

    const activityAggregation = await QuizAttempt.aggregate([
      {
        $match: {
          createdAt: { $gte: subDays(startOfDay(today), 6) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          quizCount: { $sum: 1 },
        },
      },
    ]);

    // Merge with full 7 days to fill zeros
    const activityData = last7Days.map((date) => {
      const found = activityAggregation.find((a) => a._id === date);
      return {
        date: format(new Date(date), "EEE"), // Mon, Tue...
        quizzes: found ? found.quizCount : 0,
        // We could also count notes if note model had subjectId or needed separate query
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        mastery: masteryAggregation.map((m) => ({
          subject: m.subjectName,
          score: Math.round(m.avgScore),
          attempts: m.attempts,
        })),
        activity: activityData,
      },
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch progress stats" },
      { status: 500 },
    );
  }
}
