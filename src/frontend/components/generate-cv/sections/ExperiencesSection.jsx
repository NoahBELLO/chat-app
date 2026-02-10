"use client";
import { Button } from "@/frontend/components/ui/button";

export default function ExperiencesSection({
  experiences,
  onAdd,
  onRemove,
  onUpdate,
}) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-medium">Expériences</h2>
        <Button variant="secondary" onClick={onAdd}>
          + Ajouter
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {experiences.map((exp, idx) => (
          <div key={idx} className="rounded-xl border bg-background p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-medium">Expérience {idx + 1}</div>

              {experiences.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemove(idx)}
                >
                  Supprimer
                </Button>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm">
                <span className="text-xs text-muted-foreground">Poste</span>
                <input
                  className="rounded-lg border bg-background p-2 text-sm"
                  placeholder="ex: Frontend Engineer"
                  value={exp.title}
                  onChange={(e) => onUpdate(idx, { title: e.target.value })}
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-xs text-muted-foreground">
                  Entreprise
                </span>
                <input
                  className="rounded-lg border bg-background p-2 text-sm"
                  placeholder="ex: Intersystems"
                  value={exp.company}
                  onChange={(e) => onUpdate(idx, { company: e.target.value })}
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-xs text-muted-foreground">Début</span>
                <input
                  className="rounded-lg border bg-background p-2 text-sm"
                  placeholder="ex: 2023-01"
                  value={exp.start}
                  onChange={(e) => onUpdate(idx, { start: e.target.value })}
                />
              </label>

              <label className="grid gap-1 text-sm">
                <span className="text-xs text-muted-foreground">Fin</span>
                <input
                  className="rounded-lg border bg-background p-2 text-sm"
                  placeholder="ex: 2025-02"
                  value={exp.end}
                  onChange={(e) => onUpdate(idx, { end: e.target.value })}
                />
              </label>
            </div>

            <label className="mt-3 grid gap-1 text-sm">
              <span className="text-xs text-muted-foreground">
                Réalisations (1 par ligne)
              </span>
              <textarea
                className="min-h-[110px] w-full resize-y rounded-lg border bg-background p-2 text-sm"
                placeholder={
                  "- Action + techno\n- Impact mesurable\n- Résultat"
                }
                value={exp.bullets}
                onChange={(e) => onUpdate(idx, { bullets: e.target.value })}
              />
            </label>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Conseil: 2–5 bullets par expérience, orientées impact (chiffres).
      </p>
    </section>
  );
}
