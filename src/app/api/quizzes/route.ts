import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/lib/models/Quiz";
import Topic from "@/lib/models/Topic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  try {
    const query = topicId
      ? { topicId, userId: session.user.id }
      : { userId: session.user.id };
    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: quizzes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quizzes" },
      { status: 500 },
    );
  }
}

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

    const quiz = await Quiz.create({ ...body, userId: session.user.id });
    return NextResponse.json({ success: true, data: quiz }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create quiz" },
      { status: 400 },
    );
  }
}
