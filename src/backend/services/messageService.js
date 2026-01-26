import prisma from "../lib/database.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function saveMessage(content, role, conversationId) {
  return prisma.message.create({
    data: {
      content,
      role,
      conversationId,
    },
  });
}

export async function getMessages(conversationId, limit = 50) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return messages.reverse();
}

export async function getGroqResponse(messages) {
  try {
    const response = await groq.chat.completions.create({
      messages: messages,
      model: "openai/gpt-oss-20b",
      // temperature: 0.7, // décommentez pour ajuster la créativité
    });

    const content = response?.choices?.[0]?.message?.content;
    return content || "Réponse indisponible";
  } catch (error) {
    console.error("Erreur lors de l'appel à Groq:", error);
    return "Erreur lors de la génération de la réponse.";
  }
}
