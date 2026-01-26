import { NextResponse } from "next/server";
import {
  saveMessage,
  getMessages,
  getGroqResponse,
} from "@/backend/services/messageService";
import {
  createConversation,
  updateConversationName,
} from "@/backend/services/conversationService";

const MAX_HISTORY = 5;

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

  if (!body.content || !body.role) {
    return NextResponse.json(
      { error: "content et role requis" },
      { status: 400 },
    );
  }

  let conversation;
  let isNewConversation = false;

  let conversationId = undefined;
  if (body.conversationId !== undefined && body.conversationId !== null && body.conversationId !== "") {
    conversationId = parseInt(body.conversationId, 10);
    if (isNaN(conversationId)) throw new Error("Invalid conversationId");
  }

  if (conversationId) {
    conversation = { id: conversationId };
  } else {
    conversation = await createConversation();
    isNewConversation = true;
    if (!conversation) {
      return NextResponse.json(
        { error: "Impossible de créer une conversation" },
        { status: 500 },
      );
    }
  }

  const message = await saveMessage(body.content, body.role, conversation.id);

  const history = await getMessages(conversation.id);
  const limitedHistory = history.slice(-MAX_HISTORY);
  const formattedHistory = limitedHistory.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  if (!history.some((m) => m.id === message.id)) {
    formattedHistory.push({ role: message.role, content: message.content });
  }

  if (isNewConversation) {
    const titre = await getGroqResponse([
      {
        role: "user",
        content: `Génère un titre court (3 à 6 mots) pour cette conversation : "${body.content}"`,
      },
    ]);
    await updateConversationName(conversation.id, titre);
  }

  const iaContent = await getGroqResponse(formattedHistory);
  const iaMessage = await saveMessage(iaContent, "assistant", conversation.id);

  return NextResponse.json({ ...iaMessage, conversationId: conversation.id });
}
