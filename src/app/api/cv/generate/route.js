import { NextResponse } from "next/server";
import { getGroqResponse } from "@/backend/services/messageService";

/**
 * POST /api/cv/generate
 * Attend un multipart/form-data avec :
 * - jobOffer: string
 * - experiences: string JSON (array)
 * - cvPdf: File (application/pdf)
 *
 * Retour: JSON { text, meta }
 */
export async function POST(req) {
  try {
    const formData = await req.formData();

    const jobOffer = formData.get("jobOffer");
    const experiencesRaw = formData.get("experiences");
    const cvPdf = formData.get("cvPdf");
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
    if (!cvPdf || typeof cvPdf === "string") {
      return NextResponse.json({ error: "cvPdf requis" }, { status: 400 });
    }
    if (cvPdf.type !== "application/pdf") {
      return NextResponse.json(
        { error: "cvPdf doit être un PDF" },
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

    const pdfMeta = {
      name: cvPdf.name,
      size: cvPdf.size,
      type: cvPdf.type,
    };

    const system = `Tu es un assistant RH spécialisé en rédaction de CV ATS.
                    Objectif: produire un CV clair, structuré, concis, orienté impact, adapté à l'offre.
                    Règles:
                    - Langue: français
                    - Utiliser des bullets d'impact (verbe d'action + résultat + métrique si possible)
                    - Ne pas inventer de technologies non mentionnées
                    - Sortie en Markdown (titres + sections)`;

    const user = `OFFRE D'EMPLOI:
                ${jobOffer}

                EXPERIENCES:
                ${JSON.stringify(experiences, null, 2)}

                LANGUES:
                ${JSON.stringify(languages, null, 2)}

                FORMATION:
                ${JSON.stringify(education, null, 2)}

                CV PDF (meta seulement):
                - name: ${pdfMeta.name}
                - size: ${pdfMeta.size} bytes

                Tâche:
                1) Génère un CV structuré et optimisé.
                2) Ajoute une section "Langues".
                3) Ajoute une section "Formation".
                4) N’invente aucune information.
                5) Signale clairement les champs manquants.`;

    const text = await getGroqResponse([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    return NextResponse.json({
      text,
      meta: {
        pdf: pdfMeta,
        experienceCount: experiences.length,
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
