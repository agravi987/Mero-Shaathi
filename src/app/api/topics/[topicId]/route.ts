import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Topic from "@/lib/models/Topic";

type Props = {
  params: Promise<{ topicId: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const topic = await Topic.findById(params.topicId);
    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: topic });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const body = await req.json();
    const topic = await Topic.findByIdAndUpdate(params.topicId, body, {
      new: true,
      runValidators: true,
    });
    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: topic });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update topic" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const topic = await Topic.findByIdAndDelete(params.topicId);
    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic not found" },
        { status: 404 }
      );
    }
    // Note: We might want to cascade delete notes/quizzes here in future
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete topic" },
      { status: 400 }
    );
  }
}
