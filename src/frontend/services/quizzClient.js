import { db } from "@/frontend/lib/firebase";
import { collection, doc, getDoc, getDocs, limit, query, where } from "firebase/firestore";

export async function fetchQuiz(slug) {
  const ref = doc(db, "quizz", slug);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };

  const q = query(collection(db, "quizz"), where("slug", "==", slug), limit(1));
  const snaps = await getDocs(q);
  if (snaps.empty) return null;

  const d = snaps.docs[0];
  return { id: d.id, ...d.data() };
}
