import { NextResponse } from "next/server";
import { verifyToken } from "@/backend/lib/firebaseAdmin.js";
import {
  saveMessage,
  getMessages,
  getGroqResponse,
} from "@/backend/services/messageService.js";
import {
  getConversationById,
  createConversation,
  updateConversationName,
} from "@/backend/services/conversationService.js";

const MAX_HISTORY = 5;

// GET /api/chat?conversationId=123
export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    if (!conversationId)
      return NextResponse.json({ error: "conversationId requis" }, { status: 400 });

    const conversation = await getConversationById(conversationId);
    if (!conversation)
      return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 });
    if (!Array.isArray(conversation.participants) || !conversation.participants.includes(user.uid)) {
      return NextResponse.json({ error: "Accès à la conversation interdit" }, { status: 403 });
    }

    const messages = await getMessages(conversationId);
    return NextResponse.json(messages);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}


// POST /api/chat
export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "No token" }, { status: 401 });
    const token = authHeader.split(" ")[1];
    const user = await verifyToken(token);

    const body = await req.json();
    const { content, role = "user", conversationId, participants = [] } = body;

    if (!content) return NextResponse.json({ error: "content requis" }, { status: 400 });

    // Gestion de la conversation
    let conversation;
    let isNewConversation = false;

    let convId = conversationId;
    if (!convId) {
      const part = participants.includes(user.uid) ? participants : [...participants, user.uid];
      conversation = await createConversation(part);
      convId = conversation.id;
      isNewConversation = true;
    } else {
      conversation = await getConversationById(convId);
      if (!conversation) return NextResponse.json({ error: "Conversation non trouvée" }, { status: 404 });
      if (!Array.isArray(conversation.participants) || !conversation.participants.includes(user.uid)) {
        return NextResponse.json({ error: "Accès à la conversation interdit" }, { status: 403 });
      }
    }

    // Sauvegarde du message utilisateur
    const message = await saveMessage(content, role, convId, user.uid);

    // Prépare l'historique pour l'IA
    const history = await getMessages(convId);
    const limitedHistory = history.slice(-MAX_HISTORY);
    const formattedHistory = limitedHistory.map((m) => ({ role: m.role, content: m.content }));

    // Génère un titre si nouvelle conversation
    if (isNewConversation) {
      const titre = await getGroqResponse([
        { role: "user", content: `Génère un titre court (3-6 mots) pour cette conversation : "${content}"` },
      ]);
      await updateConversationName(convId, titre);
    }

    // Génère la réponse IA
    const iaContent = await getGroqResponse(formattedHistory);
    const iaMessage = await saveMessage(iaContent, "assistant", convId);

    return NextResponse.json({ conversationId: convId, message, iaMessage });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/* 
// Décommenter et adapter cette fonction si vous utilisez Prisma pour gérer les conversations
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
    if (isNaN(conversationId)) {
      return NextResponse.json(
        { error: "conversationId invalide" },
        { status: 400 },
      );
    }
  }

  if (conversationId) {
    const existing = await getConversationById?.(conversationId);
    if (!existing) {
      return NextResponse.json(
        { error: "Aucune conversation trouvée avec cet id" },
        { status: 404 },
      );
    }
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
} */
