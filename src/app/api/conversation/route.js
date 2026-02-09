import { NextResponse } from "next/server";
import {
  createConversation,
  getConversations,
} from "@/backend/services/conversationService";
import { verifyToken } from "@/backend/lib/firebaseAdmin.js"; // Commenté si vous n'utilisez pas Firebase Admin

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = authHeader.split(" ")[1]; 
    const decoded = await verifyToken(token);

    const conversations = await getConversations(decoded.uid);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "No token provided" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);

    const body = await req.json();
    const participants = body.participants;

    if (!participants || !Array.isArray(participants)) {
      return NextResponse.json(
        { error: "Participants array required" },
        { status: 400 },
      );
    }

    if (!participants.includes(decoded.uid)) {
      participants.push(decoded.uid);
    }

    const conversation = await createConversation(participants);

    return NextResponse.json(conversation);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* 
// Décommenter et adapter cette fonction si vous utilisez Prisma pour gérer les conversations
export async function POST() {
  const conversation = await createConversation();
  return NextResponse.json(conversation);
}

export async function GET() {
  const conversations = await getConversations();
  return NextResponse.json(conversations);
} */
