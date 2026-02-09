"use client";

import React from "react";
import { Button } from "@/frontend/components/ui/button";
import Sidebar from "@/frontend/components/Sidebar";
import useCvGeneratorApi from "@/frontend/hooks/useCvGeneratorApi";
import MarkdownResult from "@/frontend/components/MarkdownResult";

export default function CvGeneratorPage() {
  const { generate, loading, error } = useCvGeneratorApi();
  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [jobOffer, setJobOffer] = React.useState("");
  const [experiences, setExperiences] = React.useState([
    { title: "", company: "", start: "", end: "", bullets: "" },
  ]);
  const [languages, setLanguages] = React.useState([{ name: "", level: "" }]);
  const [education, setEducation] = React.useState([
    { degree: "", school: "", start: "", end: "" },
  ]);
  const [cvFile, setCvFile] = React.useState(null);
  const [result, setResult] = React.useState(null);
  const resultRef = React.useRef(null);

  React.useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  function addExperience() {
    setExperiences((prev) => [
      ...prev,
      { title: "", company: "", start: "", end: "", bullets: "" },
    ]);
  }

  function removeExperience(index) {
    setExperiences((prev) => prev.filter((_, i) => i !== index));
  }

  function updateExperience(index, patch) {
    setExperiences((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  }
  function addLanguage() {
    setLanguages((prev) => [...prev, { name: "", level: "" }]);
  }

  function updateLanguage(index, patch) {
    setLanguages((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );
  }

  function removeLanguage(index) {
    setLanguages((prev) => prev.filter((_, i) => i !== index));
  }

  function addEducation() {
    setEducation((prev) => [
      ...prev,
      { degree: "", school: "", start: "", end: "" },
    ]);
  }

  function updateEducation(index, patch) {
    setEducation((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  }

  function removeEducation(index) {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  }
  function onFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setCvFile(null);
      return;
    }
    if (file.type !== "application/pdf") {
      alert("Merci de sélectionner un PDF.");
      e.target.value = "";
      setCvFile(null);
      return;
    }
    setCvFile(file);
  }

  const canGenerate =
    jobOffer.trim().length > 0 &&
    cvFile &&
    experiences.some(
      (e) =>
        e.title.trim() ||
        e.company.trim() ||
        e.start.trim() ||
        e.end.trim() ||
        e.bullets.trim(),
    );

  async function handleGenerate() {
    if (!canGenerate || loading) return;

    const fd = new FormData();
    fd.append("jobOffer", jobOffer);
    fd.append("experiences", JSON.stringify(experiences));
    fd.append("cvPdf", cvFile);
    fd.append("languages", JSON.stringify(languages));
    fd.append("education", JSON.stringify(education));

    const data = await generate(fd);
    if (data) setResult(data);
  }

  return (
    <div className="flex flex-row h-full min-h-0">
      <Sidebar
        conversations={[]}
        onNewConversation={() => {
          setJobOffer("");
          setExperiences([
            { title: "", company: "", start: "", end: "", bullets: "" },
          ]);
          setCvFile(null);
          setResult(null);
        }}
        onSelect={() => {}}
        visible={sidebarVisible}
        onToggle={() => setSidebarVisible((v) => !v)}
      />
      {!sidebarVisible && (
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-4 left-2 z-20"
          onClick={() => setSidebarVisible(true)}
          aria-label="Afficher la liste"
        >
          →
        </Button>
      )}
      <div className="flex-1 flex flex-col h-full min-h-0">
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 text-center">
            {error}
          </div>
        )}
        <div className="border-b bg-background">
          <div className="mx-auto flex max-w-[900px] items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <h1 className="text-lg font-semibold truncate">
                Génération de CV
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                Offre d’emploi + expériences + PDF → CV adapté
              </p>
            </div>
            <Button onClick={handleGenerate} disabled={!canGenerate || loading}>
              {loading ? "Génération..." : "Générer"}
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="mx-auto flex max-w-[900px] flex-col gap-6">
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
            <section className="rounded-xl border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="font-medium">CV actuel (PDF)</h2>
                <span className="text-xs text-muted-foreground">
                  {cvFile ? `${Math.round(cvFile.size / 1024)} KB` : "—"}
                </span>
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="block w-full text-sm"
              />
              <div className="mt-2 text-xs text-muted-foreground">
                {cvFile ? (
                  <>
                    Fichier sélectionné:{" "}
                    <span className="font-medium">{cvFile.name}</span>
                  </>
                ) : (
                  "Aucun PDF sélectionné."
                )}
              </div>
            </section>
            <section className="rounded-xl border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-medium">Expériences</h2>
                <Button variant="secondary" onClick={addExperience}>
                  + Ajouter
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {experiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border bg-background p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-sm font-medium">
                        Expérience {idx + 1}
                      </div>
                      {experiences.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeExperience(idx)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="grid gap-1 text-sm">
                        <span className="text-xs text-muted-foreground">
                          Poste
                        </span>
                        <input
                          className="rounded-lg border bg-background p-2 text-sm"
                          placeholder="ex: Frontend Engineer"
                          value={exp.title}
                          onChange={(e) =>
                            updateExperience(idx, { title: e.target.value })
                          }
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
                          onChange={(e) =>
                            updateExperience(idx, { company: e.target.value })
                          }
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="text-xs text-muted-foreground">
                          Début
                        </span>
                        <input
                          className="rounded-lg border bg-background p-2 text-sm"
                          placeholder="ex: 2023-01"
                          value={exp.start}
                          onChange={(e) =>
                            updateExperience(idx, { start: e.target.value })
                          }
                        />
                      </label>
                      <label className="grid gap-1 text-sm">
                        <span className="text-xs text-muted-foreground">
                          Fin
                        </span>
                        <input
                          className="rounded-lg border bg-background p-2 text-sm"
                          placeholder="ex: 2025-02"
                          value={exp.end}
                          onChange={(e) =>
                            updateExperience(idx, { end: e.target.value })
                          }
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
                        onChange={(e) =>
                          updateExperience(idx, { bullets: e.target.value })
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Conseil: 2–5 bullets par expérience, orientées impact
                (chiffres).
              </p>
            </section>
            <section className="rounded-xl border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-medium">Langues</h2>
                <Button variant="secondary" onClick={addLanguage}>
                  + Ajouter
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border bg-background p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">
                        Langue {idx + 1}
                      </div>

                      {languages.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeLanguage(idx)}
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
                        onChange={(e) =>
                          updateLanguage(idx, { name: e.target.value })
                        }
                      />

                      <input
                        className="rounded-lg border bg-background p-2 text-sm"
                        placeholder="Niveau (ex: C2, B2, natif)"
                        value={lang.level}
                        onChange={(e) =>
                          updateLanguage(idx, { level: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-xl border bg-card p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-medium">Formation</h2>
                <Button variant="secondary" onClick={addEducation}>
                  + Ajouter
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border bg-background p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-sm font-medium">
                        Formation {idx + 1}
                      </div>

                      {education.length > 1 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeEducation(idx)}
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
                        onChange={(e) =>
                          updateEducation(idx, { degree: e.target.value })
                        }
                      />

                      <input
                        className="rounded-lg border bg-background p-2 text-sm"
                        placeholder="Établissement"
                        value={edu.school}
                        onChange={(e) =>
                          updateEducation(idx, { school: e.target.value })
                        }
                      />

                      <input
                        className="rounded-lg border bg-background p-2 text-sm"
                        placeholder="Début"
                        value={edu.start}
                        onChange={(e) =>
                          updateEducation(idx, { start: e.target.value })
                        }
                      />

                      <input
                        className="rounded-lg border bg-background p-2 text-sm"
                        placeholder="Fin"
                        value={edu.end}
                        onChange={(e) =>
                          updateEducation(idx, { end: e.target.value })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-xl border bg-card p-4">
              <h2 className="mb-2 font-medium">Résultat</h2>
              {loading ? (
                <div className="animate-pulse rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                  L'IA réfléchit...
                </div>
              ) : result ? (
                <MarkdownResult result={result} />
              ) : (
                <div className="rounded-xl border bg-background p-4 text-sm text-muted-foreground">
                  Clique sur “Générer” pour obtenir un CV adapté.
                </div>
              )}
              <div ref={resultRef} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
