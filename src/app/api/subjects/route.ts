import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Subject from "@/lib/models/Subject";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const subjects = await Subject.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: subjects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch subjects" },
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
    const subject = await Subject.create({ ...body, userId: session.user.id });
    return NextResponse.json({ success: true, data: subject }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create subject" },
      { status: 400 },
    );
  }
}
