import { NextResponse } from "next/server";
import {
  saveMessage,
  getMessages,
  getGroqResponse,
} from "@/backend/services/messageService";
import { updateConversationName } from "@/backend/services/conversationService";

// GET /api/chat?conversationId=123
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const conversationId = parseInt(searchParams.get("conversationId"), 10);

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId requis" },
      { status: 400 },
    );
  }

  const messages = await getMessages(conversationId);
  return NextResponse.json(messages);
}

// POST /api/chat
export async function POST(req) {
  const body = await req.json();

  if (!body.content || !body.role || !body.conversationId) {
    return NextResponse.json(
      { error: "content, role et conversationId requis" },
      { status: 400 },
    );
  }

  const message = await saveMessage(
    body.content,
    body.role,
    body.conversationId,
  );

  const messages = await getMessages(body.conversationId, 2);
  if (messages.length === 1 && body.role === "user") {
    const titre = await getGroqResponse(
      `Génère un titre court (3 à 6 mots) pour cette conversation : "${body.content}"`,
    );
    await updateConversationName(body.conversationId, titre);
  }

  const iaContent = await getGroqResponse(body.content);
  const iaMessage = await saveMessage(
    iaContent,
    "assistant",
    body.conversationId,
  );

  return NextResponse.json(iaMessage);
}
