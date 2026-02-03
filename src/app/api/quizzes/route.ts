import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/lib/models/Quiz";
import Topic from "@/lib/models/Topic";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  try {
    const query = topicId ? { topicId } : {};
    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: quizzes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();

    // Setup references
    if (body.questions) {
      // Questions are handled separately or linked here?
      // In this design, usually we create questions then link, OR create nested.
      // For simplicity, let's assume body might contain question IDs or we create quiz first then add questions.
    }

    const quiz = await Quiz.create(body);
    return NextResponse.json({ success: true, data: quiz }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create quiz" },
      { status: 400 }
    );
  }
}
