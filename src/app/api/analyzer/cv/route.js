import { NextResponse } from "next/server";
import { getGroqResponse } from "@/backend/services/messageService";
import analyzerCvPrompt from "./analyzerCvPrompt.json";
/**
 * POST /api/cv/generate
 * Attend un multipart/form-data avec :
 * - jobOffer: string
 *
 * Retour: JSON { text, meta }
 */

export async function POST(req) {
  try {
    const formData = await req.formData();
    const jobOffer = formData.get("jobOffer");
    const cvText = formData.get("cvText");

    if (!jobOffer || typeof jobOffer !== "string") {
      return NextResponse.json({ error: "jobOffer requis" }, { status: 400 });
    }
    if (!cvText || typeof cvText !== "string") {
      return NextResponse.json({ error: "CV requis" }, { status: 400 });
    }

    const systemPrompt = analyzerCvPrompt.system;
    const userPrompt =
      analyzerCvPrompt.task.join("\n") +
      `\n\nCV :\n${cvText}\n\nOffre d'emploi :\n${jobOffer}`;

    const responseText = await getGroqResponse([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    let result;
    try {
      result = JSON.parse(responseText.replace(/```json|```/g, "").trim());
    } catch {
      return NextResponse.json(
        { error: "Réponse LLM non exploitable" },
        { status: 500 },
      );
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Erreur serveur" },
      { status: 500 },
    );
  }
}
