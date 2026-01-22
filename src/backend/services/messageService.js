import prisma from "../lib/database.js";

// Sauvegarder un message
export async function saveMessage(content, role) {
  return prisma.messages.create({
    data: {
      content,
      role,
    },
  });
}

// Récupérer l'historique des messages
export async function getMessages(limit = 50) {
  return prisma.messages.findMany({
    orderBy: { created_at: "asc" },
    take: limit,
  });
}
