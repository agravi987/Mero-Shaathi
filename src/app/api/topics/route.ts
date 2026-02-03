import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
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
  const subjectId = searchParams.get("subjectId");

  try {
    const query = subjectId
      ? { subjectId, userId: session.user.id }
      : { userId: session.user.id };
    const topics = await Topic.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch topics" },
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
    const topic = await Topic.create({ ...body, userId: session.user.id });
    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create topic" },
      { status: 400 },
    );
  }
}
