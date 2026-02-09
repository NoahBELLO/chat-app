import admin from "../lib/firebaseAdmin.js";
// import prisma from "../lib/database.js"; // Décommenter si vous avez une configuration Prisma

const db = admin.firestore();

export async function createConversation(participants) {
  if (!participants || participants.length === 0) {
    throw new Error("Participants must be provided");
  }

  const docRef = await db.collection("conversations").add({
    name: "Nouvelle conversation",
    participants,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    lastMessage: "",
  });

  return { id: docRef.id, name: "Nouvelle conversation", participants };
}

export async function getConversations(userId) {
  if (!userId) throw new Error("User ID required");
  const snapshot = await db
    .collection("conversations")
    .where("participants", "array-contains", userId)
    .orderBy("updatedAt", "desc") // updatedAt pour trier par dernière activité
    .get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getConversationById(id) {
  const doc = await db.collection("conversations").doc(id).get();
  if (!doc.exists) return null;

  return { id: doc.id, ...doc.data() };
}

export async function updateConversationName(conversationId, name) {
  await db.collection("conversations").doc(conversationId).update({
    name,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: conversationId, name };
}
/* 
// Décommenter et adapter ces fonctions si vous utilisez Prisma pour gérer les conversations
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
} */
