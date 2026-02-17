import admin from "../lib/firebaseAdmin.js";
import Groq from "groq-sdk";
// import prisma from "../lib/database.js"; // Décommenter si vous avez une configuration Prisma

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const db = admin.firestore();

export async function getGroqResponse(messages) {
  try {
    const response = await groq.chat.completions.create({
      messages: messages,
      model: process.env.MODEL_CHAT,//"openai/gpt-oss-20b",
      // temperature: 0.7, // décommentez pour ajuster la créativité
    });

    const content = response?.choices?.[0]?.message?.content;
    return content || "Réponse indisponible";
  } catch (error) {
    console.error("Erreur lors de l'appel à Groq:", error);
    return "Erreur lors de la génération de la réponse.";
  }
}

export async function saveMessage(
  content,
  role,
  conversationId,
  senderId = null,
) {
  const messageRef = db
    .collection("conversations")
    .doc(conversationId)
    .collection("messages");

  const docRef = await messageRef.add({
    content,
    role,
    senderId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await db.collection("conversations").doc(conversationId).update({
    lastMessage: content,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: docRef.id, content, role, senderId };
}

export async function getMessages(conversationId, limit = 50) {
  const snapshot = await db
    .collection("conversations")
    .doc(conversationId)
    .collection("messages")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).reverse(); 
}

/* 
// Décommenter et adapter ces fonctions si vous utilisez Prisma pour gérer les messages
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
 */
