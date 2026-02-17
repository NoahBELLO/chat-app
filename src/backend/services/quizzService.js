import admin from "../lib/firebaseAdmin.js";

const db = admin.firestore();

export async function createQuizz(quizzData) {
  if (!quizzData || !quizzData.title || !quizzData.questions) {
    throw new Error("Quizz data (title, questions) must be provided");
  }

  const docRef = await db.collection("quizz").add({
    ...quizzData,
  });

  return { id: docRef.id };
}
