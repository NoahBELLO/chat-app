"use client";

import React from "react";
import { Button } from "@/frontend/components/ui/button";
import Sidebar from "@/frontend/components/Sidebar";
import useQuizzGeneratorApi from "@/frontend/hooks/useQuizzGeneratorApi";
import JobOfferSection from "@/frontend/components/generate-quizz/sections/JobOfferSection";
import ResultSection from "@/frontend/components/generate-quizz/sections/ResultSection";

export default function QuizzGeneratorLayout() {
  const { generate, loading, error } = useQuizzGeneratorApi();

  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [jobOffer, setJobOffer] = React.useState("");
  const [result, setResult] = React.useState(null);

  const resultRef = React.useRef(null);

  React.useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const canGenerate = jobOffer.trim().length > 0;

  async function handleGenerate() {
    if (!canGenerate || loading) return;

    try {
      const fd = new FormData();
      fd.append("jobOffer", jobOffer);

      const data = await generate(fd);
      if (data) {
        const urlQuizz = `${window.location.origin}/quizz/${data.slug}`;
        setResult(
          <span>
            Copier le lien suivant pour accéder au quizz généré :<br />
            <a
              href={urlQuizz}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb" }}
            >
              {urlQuizz}
            </a>
          </span>,
        );
      } else setResult(`Erreur : réponse vide de l'API`);
    } catch (e) {
      console.error(e);
      alert("Erreur pendant la génération. Voir console.");
    }
  }

  function resetConversation() {
    setJobOffer("");
    setCvFile(null);
    setResult(null);
  }

  return (
    <div className="flex flex-row h-full min-h-0">
      <Sidebar
        conversations={[]}
        onNewConversation={resetConversation}
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
                Génération de Quizz
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                Offre d’emploi → Quizz adapté au poste
              </p>
            </div>

            <Button onClick={handleGenerate} disabled={!canGenerate || loading}>
              {loading ? "Génération..." : "Générer"}
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="mx-auto flex max-w-[900px] flex-col gap-6">
            <JobOfferSection jobOffer={jobOffer} setJobOffer={setJobOffer} />

            <ResultSection
              loading={loading}
              result={result}
              resultRef={resultRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
