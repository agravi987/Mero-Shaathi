import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Topic from "@/lib/models/Topic";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId");

  try {
    const query = subjectId ? { subjectId } : {};
    const topics = await Topic.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const topic = await Topic.create(body);
    return NextResponse.json({ success: true, data: topic }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create topic" },
      { status: 400 }
    );
  }
}
