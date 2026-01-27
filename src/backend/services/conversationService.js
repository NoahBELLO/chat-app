import prisma from "../lib/database.js";

export async function createConversation() {
  return prisma.conversation.create({
    data: { name: "Nouvelle conversation" },
  });
}

export async function getConversations() {
  return prisma.conversation.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getConversationById(id) {
  return prisma.conversation.findUnique({
    where: { id: Number(id) },
  });
}

export async function updateConversationName(conversationId, name) {
  return prisma.conversation.update({
    where: { id: conversationId },
    data: { name },
  });
}