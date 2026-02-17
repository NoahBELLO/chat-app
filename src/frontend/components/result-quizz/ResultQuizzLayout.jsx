"use client";

import React from "react";
import { Button } from "@/frontend/components/ui/button";
import Sidebar from "@/frontend/components/Sidebar";
import useResultQuizzApi from "@/frontend/hooks/useResultQuizzApi";
import ResultSection from "@/frontend/components/analyzer-cv/sections/ResultSection";

export default function ResultQuizzLayout() {
  const { generate, loading, error } = useResultQuizzApi();

  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [result, setResult] = React.useState(null);

  const resultRef = React.useRef(null);

  React.useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const canGenerate = jobOffer.trim().length > 0;

  async function handleGenerate() {
    if (!canGenerate || loading) return;

    try {
      const data = await generate(fd);
      if (data) {
        setResult(); // à faire : afficher les résultats des quizz
      } else setResult(`Erreur : réponse vide de l'API`);
    } catch (e) {
      console.error(e);
      alert("Erreur pendant l'analyse. Voir console.");
    }
  }

  function resetConversation() {
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
                Récupération des résultats des quizz
              </h1>
            </div>

            <Button onClick={handleGenerate} disabled={!canGenerate || loading}>
              {loading ? "Récupération..." : "Récupérer"}
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="mx-auto flex max-w-[900px] flex-col gap-6">
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
