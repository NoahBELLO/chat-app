import admin from "../lib/firebaseAdmin.js";

const db = admin.firestore();

export async function getQuizBySlug(slug) {
  const ref = db.collection("quizz").doc(slug);
  const snap = await ref.get();
  if (snap.exists) return { id: snap.id, ...snap.data() };

  const qs = await db
    .collection("quizz")
    .where("slug", "==", slug)
    .limit(1)
    .get();
  if (qs.empty) return null;

  const d = qs.docs[0];
  return { id: d.id, ...d.data() };
}


export async function saveResultat({
  slug,
  quizTitle = null,
  prenom,
  nom,
  score,
  total,
  reponses = null,
}) {
  if (
    !slug ||
    !prenom ||
    !nom ||
    typeof score !== "number" ||
    typeof total !== "number"
  ) {
    throw new Error("Payload invalide");
  }

  const docRef = await db.collection("resultats").add({
    slug,
    quizTitle,
    prenom,
    nom,
    score,
    total,
    reponses,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { id: docRef.id };
}
