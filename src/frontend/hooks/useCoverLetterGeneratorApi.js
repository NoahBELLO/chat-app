"use client";

import React from "react";

export default function useCoverLetterGeneratorApi() {
  const [loadingLetter, setLoadingLetter] = React.useState(false);
  const [errorLetter, setErrorLetter] = React.useState(null);

  async function generateLetter(formData) {
    setLoadingLetter(true);
    setErrorLetter(null);
    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Erreur API");
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) return await res.json();
      return await res.text();
    } catch (e) {
      setError(e?.message || "Erreur inconnue");
      return null;
    } finally {
      setLoadingLetter(false);
    }
  }

  return { generateLetter, loadingLetter, errorLetter };
}
