import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Note from "@/lib/models/Note";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");

  try {
    const query = topicId ? { topicId } : {};
    const notes = await Note.find(query).sort({ updatedAt: -1 });
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const note = await Note.create(body);
    return NextResponse.json({ success: true, data: note }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create note" },
      { status: 400 }
    );
  }
}
