"use client";
import MarkdownResult from "@/frontend/components/MarkdownResult";

export default function ResultSectionLetter({ loading, result, resultRef }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h2 className="mb-2 font-medium">Résultat (lettre de motivation)</h2>

      {loading ? (
        <div className="animate-pulse rounded-xl border bg-background p-4 text-sm text-muted-foreground">
          L&apos;IA réfléchit...
        </div>
      ) : result ? (
        <MarkdownResult result={result} />
      ) : (
        <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
          Clique sur “Générer” pour obtenir une lettre de motivation adapté.
        </div>
      )}

      <div ref={resultRef} />
    </section>
  );
}
