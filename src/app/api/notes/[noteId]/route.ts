import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Note from "@/lib/models/Note";

type Props = {
  params: Promise<{ noteId: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const note = await Note.findById(params.noteId);
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const body = await req.json();
    const note = await Note.findByIdAndUpdate(params.noteId, body, {
      new: true,
      runValidators: true,
    });
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: note });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update note" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest, props: Props) {
  const params = await props.params;

  await dbConnect();
  try {
    const note = await Note.findByIdAndDelete(params.noteId);
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete note" },
      { status: 400 }
    );
  }
}
