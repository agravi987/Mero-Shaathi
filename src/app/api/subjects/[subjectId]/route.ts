import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subject from "@/lib/models/Subject";
import Topic from "@/lib/models/Topic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

type Props = {
  params: Promise<{ subjectId: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  const params = await props.params;
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const subject = await Subject.findOne({
      _id: params.subjectId,
      userId: session.user.id,
    });
    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Subject not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: subject });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch subject" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, props: Props) {
  const params = await props.params;
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
    const subject = await Subject.findOneAndUpdate(
      { _id: params.subjectId, userId: session.user.id },
      body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Subject not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: subject });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update subject" },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest, props: Props) {
  const params = await props.params;
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const subject = await Subject.findOneAndDelete({
      _id: params.subjectId,
      userId: session.user.id,
    });
    if (!subject) {
      return NextResponse.json(
        { success: false, error: "Subject not found" },
        { status: 404 },
      );
    }
    // Cleanup topics
    await Topic.deleteMany({ subjectId: params.subjectId });

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete subject" },
      { status: 400 },
    );
  }
}
