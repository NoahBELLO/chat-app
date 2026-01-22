import { NextResponse } from "next/server";
import { saveMessage, getMessages } from "@/backend/services/messageService";

// GET /api/chat
export async function GET() {
  const messages = await getMessages();
  return NextResponse.json(messages);
}

// POST /api/chat
export async function POST(req) {
  const body = await req.json();

  if (!body.content || !body.role) {
    return NextResponse.json(
      { error: "content et role requis" },
      { status: 400 },
    );
  }

  const message = await saveMessage(body.content, body.role);
  return NextResponse.json(message);
}
