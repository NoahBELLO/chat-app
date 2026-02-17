"use client";

export default function ResultSection({ loading, result, resultRef }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <h2 className="mb-2 font-medium">Résultat (Analyse)</h2>

      {loading ? (
        <div className="animate-pulse rounded-xl border bg-background p-4 text-sm text-muted-foreground">
          L&apos;IA réfléchit...
        </div>
      ) : result ? (
        result
      ) : (
        <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
          Clique sur “Analyser” pour obtenir l'analyse.
        </div>
      )}

      <div ref={resultRef} />
    </section>
  );
}
