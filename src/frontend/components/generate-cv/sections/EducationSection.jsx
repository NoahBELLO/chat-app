"use client";
import { Button } from "@/frontend/components/ui/button";

export default function EducationSection({
  education,
  onAdd,
  onRemove,
  onUpdate,
}) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-medium">Formation</h2>
        <Button variant="secondary" onClick={onAdd}>
          + Ajouter
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {education.map((edu, idx) => (
          <div key={idx} className="rounded-lg border bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Formation {idx + 1}</div>

              {education.length > 1 && (
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
                placeholder="Diplôme / Titre"
                value={edu.degree}
                onChange={(e) => onUpdate(idx, { degree: e.target.value })}
              />

              <input
                className="rounded-lg border bg-background p-2 text-sm"
                placeholder="Établissement"
                value={edu.school}
                onChange={(e) => onUpdate(idx, { school: e.target.value })}
              />

              <input
                className="rounded-lg border bg-background p-2 text-sm"
                placeholder="Début"
                value={edu.start}
                onChange={(e) => onUpdate(idx, { start: e.target.value })}
              />

              <input
                className="rounded-lg border bg-background p-2 text-sm"
                placeholder="Fin"
                value={edu.end}
                onChange={(e) => onUpdate(idx, { end: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
