import { NextResponse } from "next/server";
import admin from "@/backend/lib/firebaseAdmin";

const db = admin.firestore();

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      slug,
      quizTitle = null,
      prenom,
      nom,
      score,
      total,
      reponses = [],
    } = body || {};

    if (
      !slug ||
      !prenom ||
      !nom ||
      typeof score !== "number" ||
      typeof total !== "number"
    ) {
      return NextResponse.json(
        {
          error: "Payload invalide",
          received: body,
        },
        { status: 400 },
      );
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

    return NextResponse.json({
      ok: true,
      id: docRef.id,
    });
  } catch (error) {
    console.error("Erreur API /api/resultats:", error);

    return NextResponse.json(
      {
        error: error?.message || "Server error",
      },
      { status: 500 },
    );
  }
}
