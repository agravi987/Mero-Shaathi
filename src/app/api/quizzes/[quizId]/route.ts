import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/lib/models/Quiz";
import Question from "@/lib/models/Question";

type Props = {
  params: Promise<{ quizId: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const quiz = await Quiz.findById(params.quizId).populate("questions");
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: quiz });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const body = await req.json();
    const quiz = await Quiz.findByIdAndUpdate(params.quizId, body, {
      new: true,
      runValidators: true,
    });
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: quiz });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update quiz" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const quiz = await Quiz.findByIdAndDelete(params.quizId);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }
    // Delete associated questions
    await Question.deleteMany({ quizId: params.quizId });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete quiz" },
      { status: 400 }
    );
  }
}
