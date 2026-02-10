import { NextResponse } from "next/server";
import { getGroqResponse } from "@/backend/services/messageService";

/**
 * POST /api/cv/generate
 * Attend un multipart/form-data avec :
 * - jobOffer: string
 * - experiences: string JSON (array)
 * - languages: string JSON (array)
 * - education: string JSON (array)
 *
 * Retour: JSON { text, meta }
 */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const jobOffer = formData.get("jobOffer");
    const experiencesRaw = formData.get("experiences");
    const languagesRaw = formData.get("languages");
    const educationRaw = formData.get("education");

    if (!jobOffer || typeof jobOffer !== "string") {
      return NextResponse.json({ error: "jobOffer requis" }, { status: 400 });
    }
    if (!experiencesRaw || typeof experiencesRaw !== "string") {
      return NextResponse.json(
        { error: "experiences requis (JSON string)" },
        { status: 400 },
      );
    }

    let experiences;
    try {
      experiences = JSON.parse(experiencesRaw);
      if (!Array.isArray(experiences)) throw new Error("not array");
    } catch {
      return NextResponse.json(
        { error: "experiences invalide (doit être un JSON array)" },
        { status: 400 },
      );
    }

    const languages = languagesRaw ? JSON.parse(languagesRaw) : [];
    const education = educationRaw ? JSON.parse(educationRaw) : [];

    const system = `Tu es un assistant RH expert en rédaction de lettres de motivation personnalisées.
                    Objectif: rédiger une lettre de motivation convaincante, adaptée à l'offre d'emploi et au profil du candidat.
                    Règles:
                    - Langue: français
                    - Structure professionnelle (accroche, motivation, lien avec l'offre, conclusion)
                    - Ne pas inventer d'informations non fournies
                    - Sortie en Markdown (paragraphes)`;

    const user = `OFFRE D'EMPLOI:
                ${jobOffer}

                EXPERIENCES:
                ${JSON.stringify(experiences, null, 2)}

                LANGUES:
                ${JSON.stringify(languages, null, 2)}

                FORMATION:
                ${JSON.stringify(education, null, 2)}

                Tâche:
                1) Rédige une lettre de motivation personnalisée pour ce poste, en valorisant les expériences et compétences fournies.
                2) N’invente aucune information.
                3) Si des informations importantes manquent, indique-le à la fin.`;

    const text = await getGroqResponse([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    return NextResponse.json({
      text,
      meta: {
        experienceCount: experiences.length,
        languageCount: languages.length,
        educationCount: education.length,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message || "Erreur serveur" },
      { status: 500 },
    );
  }
}
