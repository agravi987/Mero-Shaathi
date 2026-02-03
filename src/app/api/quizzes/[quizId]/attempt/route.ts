import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/lib/models/Quiz";
import QuizAttempt from "@/lib/models/QuizAttempt";
import Question from "@/lib/models/Question";
import { calculateNextRevision } from "@/lib/utils/spacedRepetition";
import mongoose from "mongoose";

type Props = {
  params: Promise<{ quizId: string }>;
};

export async function POST(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const body = await req.json();
    const { answers, timeTaken } = body; // answers: { questionId: string, userAnswer: string }[]

    const quiz = await Quiz.findById(params.quizId).populate("questions");
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    let score = 0;
    const totalMarks = quiz.totalMarks || 0;
    const processedAnswers = [];
    let totalCorrect = 0;

    // Map questions for easy lookup
    const questionMap = new Map(
      (quiz.questions as any[]).map((q) => [q._id.toString(), q])
    );

    for (const ans of answers) {
      const question = questionMap.get(ans.questionId);
      if (question) {
        const isCorrect =
          String(ans.userAnswer).toLowerCase().trim() ===
          String(question.correctAnswer).toLowerCase().trim();

        if (isCorrect) {
          score += question.marks;
          totalCorrect++;
        }

        processedAnswers.push({
          questionId: question._id,
          userAnswer: ans.userAnswer,
          isCorrect,
          timeTaken: ans.timeTaken || 0,
        });
      }
    }

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;

    // Spaced Repetition Logic
    // Convert percentage to quality (0-5)
    // < 50% = 0-2 (fail)
    // 50-70% = 3 (hard)
    // 70-90% = 4 (good)
    // > 90% = 5 (easy)
    let quality = 0;
    if (percentage >= 90) quality = 5;
    else if (percentage >= 70) quality = 4;
    else if (percentage >= 50) quality = 3;
    else if (percentage >= 30) quality = 2;
    else if (percentage >= 10) quality = 1;
    else quality = 0;

    // Get previous attempt to get previous SM-2 state?
    // For simplicity, we calculate based on CURRENT performance for now,
    // or retrieve previous attempt for this topic/quiz.
    // In a strict SM-2, we track item-level repetition. Here we track Quiz-level.

    // Find latest attempt for this quiz to get previous state
    const lastAttempt = await QuizAttempt.findOne({
      quizId: params.quizId,
    }).sort({ createdAt: -1 });

    const currentRevData = lastAttempt
      ? {
          easeFactor: lastAttempt.easeFactor,
          interval: lastAttempt.interval,
          repetitionCount: lastAttempt.revisionCount,
        }
      : undefined;

    const revisionData = calculateNextRevision(quality, currentRevData);

    const nextRevisionDate = new Date();
    nextRevisionDate.setDate(
      nextRevisionDate.getDate() + revisionData.interval
    );

    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      topicId: quiz.topicId,
      // SubjectId should be fetched from Quiz->Topic->Subject or sent in body.
      // Ideally Quiz should populate Topic to get SubjectId or store SubjectId in Quiz.
      // For now let's assume valid IDs or fetch.
      // We need subjectId for the model.
      // Let's fetch topic to get subjectId
      subjectId: (
        await Question.db.model("Topic").findById(quiz.topicId)
      ).subjectId,

      answers: processedAnswers,
      score,
      totalMarks,
      percentage,
      timeTaken,

      // SM-2
      nextRevisionDate,
      revisionCount: revisionData.repetitionCount,
      easeFactor: revisionData.easeFactor,
      interval: revisionData.interval,
    });

    return NextResponse.json({ success: true, data: attempt });
  } catch (error: any) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit quiz attempt" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const attempts = await QuizAttempt.find({ quizId: params.quizId }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: attempts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch attempts" },
      { status: 500 }
    );
  }
}
