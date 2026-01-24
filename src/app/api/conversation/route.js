import { NextResponse } from "next/server";
import { createConversation, getConversations } from "@/backend/services/conversationService";

export async function POST() {
  const conversation = await createConversation();
  return NextResponse.json(conversation);
}

export async function GET() {
  const conversations = await getConversations();
  return NextResponse.json(conversations);
}