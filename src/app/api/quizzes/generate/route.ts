import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Question from "@/lib/models/Question";
import Topic from "@/lib/models/Topic";
import Note from "@/lib/models/Note";
import Quiz from "@/lib/models/Quiz";
import { getAIProvider } from "@/lib/ai/factory";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { topicId, difficulty, count } = body;

    if (!topicId || !difficulty || !count) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 1. Fetch Topic to verify and get name
    const topic = await Topic.findOne({
      _id: topicId,
      userId: session.user.id,
    });
    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 },
      );
    }

    // 2. Fetch Notes for context
    const notes = await Note.find({ topicId, userId: session.user.id })
      .sort({ updatedAt: -1 })
      .limit(3);
    const context = notes.map((n) => n.content).join("\n\n");

    // 3. Determine Hybrid Ratios
    // Target: count
    // DB Quota: 60% (randomly picked from existing DB questions)
    // AI Quota: 40% (or remainder)

    const dbTarget = Math.floor(count * 0.6);

    const quizzesInTopic = await Quiz.find({
      topicId,
      userId: session.user.id,
    }).select("_id");
    const quizIds = quizzesInTopic.map((q) => q._id);

    const availableDbQuestions = await Question.find({
      quizId: { $in: quizIds },
      userId: session.user.id,
      difficulty: difficulty,
    }).limit(50); // Fetch a reasonable pool to sample from

    // Shuffle and pick
    const shuffledDb = availableDbQuestions.sort(() => 0.5 - Math.random());
    const selectedDbQuestions = shuffledDb.slice(0, dbTarget);

    // Calculate remaining needed
    const aiNeeded = count - selectedDbQuestions.length;

    let aiQuestions: any[] = [];

    if (aiNeeded > 0) {
      console.log(`Generating ${aiNeeded} questions via AI...`);
      const provider = getAIProvider();
      const rawAiQuestions = await provider.generateQuestions({
        topic: topic.name,
        context,
        difficulty,
        count: aiNeeded,
      });

      // 4. Save New AI Questions to DB
      // We need a place to put them. "Generated Quiz" or a "Question Bank"?
      // Typically questions belong to a Quiz.
      // Let's create a *new* Quiz for this session to hold these questions + the selected ones?
      // OR: We create a "Question Bank" quiz for this topic if it doesn't exist?
      // Better: Create a TEMPORARY or PERMANENT Quiz for this user session.
      // Let's create a new Quiz document titled "Generated Quiz - [Date]"

      const newQuiz = await Quiz.create({
        userId: session.user.id,
        topicId,
        title: `Generated Quiz: ${topic.name}`,
        description: `✨ AI-Powered ${difficulty} quiz • Generated ${new Date().toLocaleDateString()}`,
        difficulty,
        timeLimit: count * 60, // 1 min per question approx
        questions: [], // Will populate
        totalMarks: count, // 1 mark each
      });

      // Save AI questions linking to this new quiz
      const savedAiQuestions = await Promise.all(
        rawAiQuestions.map(async (q: any, i: number) => {
          return Question.create({
            userId: session.user.id,
            quizId: newQuiz._id,
            type: "mcq",
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || "AI Generated explanation",
            difficulty: q.difficulty || difficulty,
            marks: 1,
            order: i,
          });
        }),
      );

      // Also, for the DB questions we selected, do we "move" them? No.
      // We probably want to LINK them to this new quiz?
      // But in Mongoose, Question has `quizId`. It's a 1-to-many.
      // So a Question usually belongs to ONE quiz.
      // If we want to REUSE, we should have a Many-to-Many or duplicate.
      // Duplicating is safer for now to avoid messing up original quizzes.

      const duplicatedDbQuestions = await Promise.all(
        selectedDbQuestions.map(async (q) => {
          return Question.create({
            userId: session.user.id,
            quizId: newQuiz._id, // Link to new quiz
            type: q.type,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            marks: q.marks,
            order: 100, // append
          });
        }),
      );

      aiQuestions = savedAiQuestions;

      const allQuestionIds = [
        ...savedAiQuestions,
        ...duplicatedDbQuestions,
      ].map((q) => q._id);

      // Update Quiz with question IDs
      newQuiz.questions = allQuestionIds;
      await newQuiz.save();

      return NextResponse.json({
        success: true,
        data: { quizId: newQuiz._id, count: allQuestionIds.length },
      });
    } else {
      // Only DB questions (unlikely given requirement, but possible if DB is huge)
      // Similar logic: Create new quiz, duplicate questions.
      const newQuiz = await Quiz.create({
        userId: session.user.id,
        topicId,
        title: `Generated Quiz: ${topic.name}`,
        description: `Generated from Question Bank`,
        difficulty,
        timeLimit: count * 60,
        questions: [],
        totalMarks: count,
      });

      const duplicatedQuestions = await Promise.all(
        selectedDbQuestions.map(async (q) => {
          return Question.create({
            userId: session.user.id,
            quizId: newQuiz._id,
            type: q.type,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            difficulty: q.difficulty,
            marks: q.marks,
            order: 0,
          });
        }),
      );

      newQuiz.questions = duplicatedQuestions.map((q) => q._id);
      await newQuiz.save();

      return NextResponse.json({
        success: true,
        data: { quizId: newQuiz._id, count: newQuiz.questions.length },
      });
    }
  } catch (error: any) {
    console.error("Quiz Gen Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate quiz" },
      { status: 500 },
    );
  }
}
