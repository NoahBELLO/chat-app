"use client";

import React from "react";

export default function useCvGeneratorApi() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function generate(formData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cv/generate", {
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
      setLoading(false);
    }
  }

  return { generate, loading, error };
}
