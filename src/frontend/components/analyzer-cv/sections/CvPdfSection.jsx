"use client";

export default function CvPdfSection({ cvFile, setCvFile }) {
  return (
    <section className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-medium">CV (en format PDF)</h2>
      </div>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setCvFile(e.target.files[0] || null)}
        className="mb-2"
      />
      {cvFile && (
        <div className="text-xs text-muted-foreground">
          Fichier sélectionné : {cvFile.name}
        </div>
      )}
    </section>
  );
}
