import { NextResponse } from "next/server";
import { getQuizBySlug } from "@/backend/services/quizzService";

export async function GET(req) {
  try {
    const pathname = new URL(req.url).pathname;
    const parts = pathname.split("/").filter(Boolean);
    const slug = parts[parts.length - 1];

    if (!slug || slug === "quizz") {
      return NextResponse.json(
        { error: "Missing slug", debug: { pathname, parts } },
        { status: 400 },
      );
    }

    const quiz = await getQuizBySlug(slug);
    if (!quiz)
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    return NextResponse.json({ quiz });
  } catch (e) {
    return NextResponse.json(
      { error: e?.message || "Server error" },
      { status: 500 },
    );
  }
}
