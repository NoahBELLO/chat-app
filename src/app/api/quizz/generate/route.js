import { NextResponse } from "next/server";
import { getGroqResponse } from "@/backend/services/messageService";
import { createQuizz } from "@/backend/services/quizzService";
import quizzPrompt from "./quizzPrompt.json";
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

    const system = quizzPrompt.system;
    const user = `Poste ou compétences à évaluer: ${jobOffer}
                  Format attendu :
                    - Langue : ${quizzPrompt.format.language}
                    - Sortie : ${quizzPrompt.format.output}
                    - Structure : ${quizzPrompt.format.structure.join(", ")}
                    - Types de questions : ${quizzPrompt.format.questionTypes.join(", ")}
                Tâche:
                ${quizzPrompt.task.map((t, i) => `${i + 1}) ${t}`).join('\n')}`;

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
