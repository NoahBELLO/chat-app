"use client";

export default function JobOfferSection({ jobOffer, setJobOffer }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-medium">Offre d’emploi</h2>
        <span className="text-xs text-muted-foreground">
          {jobOffer.trim().length} chars
        </span>
      </div>

      <textarea
        className="min-h-[180px] w-full resize-y rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        placeholder="Colle ici l’offre d’emploi…"
        value={jobOffer}
        onChange={(e) => setJobOffer(e.target.value)}
      />
    </section>
  );
}
