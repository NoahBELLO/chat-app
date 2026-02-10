"use client";
import { Button } from "@/frontend/components/ui/button";

export default function LanguagesSection({
  languages,
  onAdd,
  onRemove,
  onUpdate,
}) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-medium">Langues</h2>
        <Button variant="secondary" onClick={onAdd}>
          + Ajouter
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {languages.map((lang, idx) => (
          <div key={idx} className="rounded-lg border bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Langue {idx + 1}</div>

              {languages.length > 1 && (
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
              <input
                className="rounded-lg border bg-background p-2 text-sm"
                placeholder="Langue (ex: Français)"
                value={lang.name}
                onChange={(e) => onUpdate(idx, { name: e.target.value })}
              />

              <input
                className="rounded-lg border bg-background p-2 text-sm"
                placeholder="Niveau (ex: C2, B2, natif)"
                value={lang.level}
                onChange={(e) => onUpdate(idx, { level: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
