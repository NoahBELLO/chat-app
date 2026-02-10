"use client";

import React from "react";
import { Button } from "@/frontend/components/ui/button";
import Sidebar from "@/frontend/components/Sidebar";
import useCvGeneratorApi from "@/frontend/hooks/useCvGeneratorApi";
import JobOfferSection from "@/frontend/components/generate-cv/sections/JobOfferSection";
import ExperiencesSection from "@/frontend/components/generate-cv/sections/ExperiencesSection";
import LanguagesSection from "@/frontend/components/generate-cv/sections/LanguagesSection";
import EducationSection from "@/frontend/components/generate-cv/sections/EducationSection";
import ResultSection from "@/frontend/components/generate-cv/sections/ResultSection";

const emptyExperience = () => ({
  title: "",
  company: "",
  start: "",
  end: "",
  bullets: "",
});
const emptyLanguage = () => ({ name: "", level: "" });
const emptyEducation = () => ({ degree: "", school: "", start: "", end: "" });

function isBlankExperience(e) {
  return (
    !e.title.trim() &&
    !e.company.trim() &&
    !e.start.trim() &&
    !e.end.trim() &&
    !e.bullets.trim()
  );
}
function isBlankLanguage(l) {
  return !l.name.trim() && !l.level.trim();
}
function isBlankEducation(ed) {
  return (
    !ed.degree.trim() && !ed.school.trim() && !ed.start.trim() && !ed.end.trim()
  );
}

export default function CvGeneratorLayout() {
  const { generate, loading, error } = useCvGeneratorApi();

  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [jobOffer, setJobOffer] = React.useState("");
  const [experiences, setExperiences] = React.useState([emptyExperience()]);
  const [languages, setLanguages] = React.useState([emptyLanguage()]);
  const [education, setEducation] = React.useState([emptyEducation()]);
  const [result, setResult] = React.useState(null);

  const resultRef = React.useRef(null);

  React.useEffect(() => {
    resultRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  function addExperience() {
    setExperiences((prev) => [...prev, emptyExperience()]);
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
    setLanguages((prev) => [...prev, emptyLanguage()]);
  }
  function removeLanguage(index) {
    setLanguages((prev) => prev.filter((_, i) => i !== index));
  }
  function updateLanguage(index, patch) {
    setLanguages((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l)),
    );
  }

  function addEducation() {
    setEducation((prev) => [...prev, emptyEducation()]);
  }
  function removeEducation(index) {
    setEducation((prev) => prev.filter((_, i) => i !== index));
  }
  function updateEducation(index, patch) {
    setEducation((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  }

  const canGenerate = jobOffer.trim().length > 0 && experiences.some((e) => !isBlankExperience(e));

  async function handleGenerate() {
    if (!canGenerate || loading) return;

    try {
      const cleanedExperiences = experiences.filter(
        (e) => !isBlankExperience(e),
      );
      const cleanedLanguages = languages.filter((l) => !isBlankLanguage(l));
      const cleanedEducation = education.filter((ed) => !isBlankEducation(ed));

      const fd = new FormData();
      fd.append("jobOffer", jobOffer);
      fd.append("experiences", JSON.stringify(cleanedExperiences));
      fd.append("languages", JSON.stringify(cleanedLanguages));
      fd.append("education", JSON.stringify(cleanedEducation));

      const data = await generate(fd);
      if (data) setResult(data);
      else setResult(data);
    } catch (e) {
      console.error(e);
      alert("Erreur pendant la génération. Voir console.");
    }
  }

  function resetConversation() {
    setJobOffer("");
    setExperiences([emptyExperience()]);
    setLanguages([emptyLanguage()]);
    setEducation([emptyEducation()]);
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
            <JobOfferSection jobOffer={jobOffer} setJobOffer={setJobOffer} />

            <ExperiencesSection
              experiences={experiences}
              onAdd={addExperience}
              onRemove={removeExperience}
              onUpdate={updateExperience}
            />

            <LanguagesSection
              languages={languages}
              onAdd={addLanguage}
              onRemove={removeLanguage}
              onUpdate={updateLanguage}
            />

            <EducationSection
              education={education}
              onAdd={addEducation}
              onRemove={removeEducation}
              onUpdate={updateEducation}
            />

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
