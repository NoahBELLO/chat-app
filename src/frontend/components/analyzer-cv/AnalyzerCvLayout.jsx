"use client";

import React from "react";
import { Button } from "@/frontend/components/ui/button";
import Sidebar from "@/frontend/components/Sidebar";
import useQuizzGeneratorApi from "@/frontend/hooks/useAnalizerCvApi";
import JobOfferSection from "@/frontend/components/analyzer-cv/sections/JobOfferSection";
import ResultSection from "@/frontend/components/analyzer-cv/sections/ResultSection";
import CvPdfSection from "@/frontend/components/analyzer-cv/sections/CvPdfSection";
import { extractTextFromPdf } from "@/frontend/lib/pdfExtract";

export default function AnalyzerCvLayout() {
  const { generate, loading, error } = useQuizzGeneratorApi();

  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [jobOffer, setJobOffer] = React.useState("");
  const [cvFile, setCvFile] = React.useState(null);
  const [result, setResult] = React.useState(null);

  const resultRef = React.useRef(null);

  React.useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  const canGenerate = jobOffer.trim().length > 0;

  async function handleGenerate() {
    if (!canGenerate || loading) return;

    try {
      let cvText = "";
      if (cvFile) {
        cvText = await extractTextFromPdf(cvFile);
      }

      const fd = new FormData();
      fd.append("jobOffer", jobOffer);
      fd.append("cvText", cvText);

      const data = await generate(fd);
      if (data) {
        setResult(
          data.score !== undefined ? (
            <span>
              Score de pertinence : <b>{data.score}%</b>
              <br />
              <ul className="list-disc pl-5">
                {Array.isArray(data.skills) && data.skills.length > 0 ? (
                  data.skills.map((skill, idx) => <li key={idx}>{skill}</li>)
                ) : (
                  <li>Aucune compétence détectée</li>
                )}
              </ul>
            </span>
          ) : (
            "Aucun score retourné"
          ),
        );
      } else setResult(`Erreur : réponse vide de l'API`);
    } catch (e) {
      console.error(e);
      alert("Erreur pendant l'analyse. Voir console.");
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
              <h1 className="text-lg font-semibold truncate">Analyse du CV</h1>
              <p className="text-sm text-muted-foreground truncate">
                Offre d’emploi + CV en PDF → Score de pertinence
              </p>
            </div>

            <Button onClick={handleGenerate} disabled={!canGenerate || loading}>
              {loading ? "Analyse en cours..." : "Analyser"}
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="mx-auto flex max-w-[900px] flex-col gap-6">
            <CvPdfSection cvFile={cvFile} setCvFile={setCvFile} />

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
