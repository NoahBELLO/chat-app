import { NextResponse } from "next/server";
import { getGroqResponse } from "@/backend/services/messageService";
import { createQuizz } from "@/backend/services/quizzService";

/**
 * POST /api/cv/generate
 * Attend un multipart/form-data avec :
 * - jobOffer: string
 *
 * Retour: JSON { text, meta }
 */

const cleanText = (txt) => {
  let quizTextClean = txt.trim();
  if (quizTextClean.startsWith("```json")) {
    quizTextClean = quizTextClean.replace(/```json|```/g, "");
  }
  return quizTextClean;
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const jobOffer = formData.get("jobOffer");

    if (!jobOffer || typeof jobOffer !== "string") {
      return NextResponse.json({ error: "jobOffer requis" }, { status: 400 });
    }

    const system = `Tu es un assistant RH expert en création de quiz d’évaluation pour le recrutement.
                    Objectif: générer un quiz pertinent pour évaluer un candidat sur un poste ou des compétences données.
                    Règles:
                      - Langue: français
                      - Mélange de formats: QCM, réponses ouvertes, mini-cas pratiques
                      - 5 à 10 questions variées
                      - Structure JSON:
                        - "title": titre du quiz
                        - "slug": version slugifiée du titre (pour URL, en 2 mots max avec tiret)
                        - "questions": tableau d’objets
                          - Pour les QCM:
                            - "type": "qcm"
                            - "question": texte
                            - "options": tableau de choix
                            - "correctIndex": index de la bonne réponse
                          - Pour les questions ouvertes:
                            - "type": "ouverte"
                            - "question": texte
                          - Pour les cas pratiques:
                            - "type": "cas"
                            - "question": texte`;

    const user = `Poste ou compétences à évaluer:
                ${jobOffer}
                Génère un quiz structuré (JSON) avec:
                - 2 à 4 QCM
                - 2 à 3 questions ouvertes
                - 1 à 2 mini-cas pratiques

                Respecte strictement la structure suivante:
                {
                "title": "Titre du quiz",
                "slug": "titre-quiz",
                "questions": [
                { ... }
                ]
                }`;

    const quizText = await getGroqResponse([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    let quiz;
    try {
      quiz = JSON.parse(cleanText(quizText));
    } catch {
      return NextResponse.json(
        { error: "Format de quiz invalide" },
        { status: 500 },
      );
    }

    await createQuizz(quiz);

    return NextResponse.json({ slug: quiz.slug });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Erreur serveur" },
      { status: 500 },
    );
  }
}
