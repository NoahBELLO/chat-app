"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/frontend/components/ui/radio-group";
import { Separator } from "@/frontend/components/ui/separator";
import { Badge } from "@/frontend/components/ui/badge";
import { Textarea } from "@/frontend/components/ui/textarea";

export default function QuizPage() {
  const params = useParams();
  const slug = params?.slug;

  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState("");

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");

  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");

  /**
   * answers:
   * - QCM: number (index choisi)
   * - ouverte/cas: string (texte)
   */
  const [answers, setAnswers] = useState({});

  async function fetchQuizServer(slugValue) {
    const res = await fetch(`/api/quizz/${slugValue}`, { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || "Erreur chargement quizz");
    return json.quiz;
  }

  useEffect(() => {
    if (!slug) return;

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const qz = await fetchQuizServer(slug);
        if (!mounted) return;

        if (!qz) {
          setQuiz(null);
          setError("Quizz introuvable.");
        } else {
          setQuiz(qz);
        }
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Erreur chargement quizz.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const questions = quiz?.questions ?? [];
  const total = questions.length;

  const scoreQcm = useMemo(() => {
    let s = 0;
    questions.forEach((q, i) => {
      if (q.type !== "qcm") return;
      const picked = answers[i];
      if (typeof picked === "number" && picked === q.correctIndex) s += 1;
    });
    return s;
  }, [questions, answers]);

  const totalQcm = useMemo(() => questions.filter((q) => q.type === "qcm").length, [questions]);

  const canStart = prenom.trim().length > 0 && nom.trim().length > 0;

  const allAnswered = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q, i) => {
      const a = answers[i];
      if (q.type === "qcm") return typeof a === "number";
      if (q.type === "ouverte" || q.type === "cas") return typeof a === "string" && a.trim().length > 0;
      return false;
    });
  }, [questions, answers]);

  function questionBadge(type) {
    if (type === "qcm") return <Badge variant="secondary">QCM</Badge>;
    if (type === "ouverte") return <Badge variant="outline">Ouverte</Badge>;
    if (type === "cas") return <Badge>Cas</Badge>;
    return <Badge variant="destructive">Inconnu</Badge>;
  }

  async function submit() {
    setSubmitting(true);
    setMsg("");

    try {
      const reponses = questions.map((q, i) => {
        const a = answers[i];

        if (q.type === "qcm") {
          return {
            index: i,
            type: "qcm",
            question: q.question,
            selectedIndex: typeof a === "number" ? a : null,
            selectedLabel: typeof a === "number" ? q.options?.[a] ?? null : null,
            correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : null,
            correctLabel:
              typeof q.correctIndex === "number" ? q.options?.[q.correctIndex] ?? null : null,
            isCorrect: typeof a === "number" && a === q.correctIndex,
          };
        }

        return {
          index: i,
          type: q.type,
          question: q.question,
          answerText: typeof a === "string" ? a : "",
        };
      });

      const res = await fetch("/api/resultats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          quizTitle: quiz?.title ?? null,
          prenom: prenom.trim(),
          nom: nom.trim(),
          score: scoreQcm,
          total: totalQcm,
          reponses,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Erreur envoi résultats");

      setDone(true);
      setMsg("Résultats enregistrés !");
    } catch (e) {
      setMsg(`${e?.message || "Erreur"}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="h-dvh w-full flex justify-center">
      <div className="w-full max-w-3xl h-full overflow-y-auto px-6 py-10">
        {!slug && (
          <Card className="bg-black/30 border-white/10">
            <CardHeader>
              <CardTitle>Chargement…</CardTitle>
              <CardDescription>Récupération de l’URL</CardDescription>
            </CardHeader>
          </Card>
        )}

        {slug && loading && (
          <Card className="bg-black/30 border-white/10">
            <CardHeader>
              <CardTitle>Chargement…</CardTitle>
              <CardDescription>Récupération du quizz</CardDescription>
            </CardHeader>
          </Card>
        )}

        {slug && !loading && error && (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-200">Erreur</CardTitle>
              <CardDescription className="text-red-200/80">{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {slug && !loading && !error && quiz && (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{quiz.title ?? `Quizz: ${slug}`}</h1>
              <div className="text-sm opacity-70 mt-1">Slug: {slug}</div>
            </div>

            {!started && !done && (
              <Card className="bg-black/30 border-white/10">
                <CardHeader>
                  <CardTitle>Identité</CardTitle>
                  <CardDescription>Ces infos seront enregistrées avec le résultat.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Prénom</Label>
                      <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Nom</Label>
                      <Input value={nom} onChange={(e) => setNom(e.target.value)} />
                    </div>
                  </div>

                  <Button disabled={!canStart || total === 0} onClick={() => setStarted(true)}>
                    Démarrer ({total} questions)
                  </Button>

                  {total === 0 && (
                    <p className="text-sm text-red-200">Ce quizz n’a aucune question.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {started && !done && (
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <Card key={i} className="bg-black/30 border-white/10">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <CardTitle className="text-base">
                          {i + 1}. {q.question}
                        </CardTitle>
                        {questionBadge(q.type)}
                      </div>
                      {q.type === "qcm" && (
                        <CardDescription>
                          Choisis une réponse.
                        </CardDescription>
                      )}
                      {(q.type === "ouverte" || q.type === "cas") && (
                        <CardDescription>
                          Réponse écrite (évaluation manuelle).
                        </CardDescription>
                      )}
                    </CardHeader>

                    <CardContent>
                      {q.type === "qcm" && (
                        <RadioGroup
                          value={typeof answers[i] === "number" ? String(answers[i]) : ""}
                          onValueChange={(val) =>
                            setAnswers((prev) => ({ ...prev, [i]: Number(val) }))
                          }
                          className="space-y-2"
                        >
                          {(q.options ?? []).map((opt, idx) => (
                            <div key={idx} className="flex items-center space-x-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                              <RadioGroupItem value={String(idx)} id={`q-${i}-${idx}`} />
                              <Label htmlFor={`q-${i}-${idx}`} className="cursor-pointer">
                                {opt}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {(q.type === "ouverte" || q.type === "cas") && (
                        <div className="space-y-2">
                          <Label>Ta réponse</Label>
                          <Textarea
                            value={typeof answers[i] === "string" ? answers[i] : ""}
                            onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                            placeholder={q.type === "cas" ? "Explique ton approche, étapes, hypothèses…" : "Réponds en quelques lignes…"}
                            className="min-h-28"
                          />
                        </div>
                      )}

                      {q.type !== "qcm" && q.type !== "ouverte" && q.type !== "cas" && (
                        <p className="text-sm text-red-200">
                          Type de question inconnu: <b>{String(q.type)}</b>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <Separator className="my-2" />

                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <Button disabled={!allAnswered || submitting} onClick={submit}>
                    {submitting ? "Envoi…" : "Terminer et envoyer"}
                  </Button>
                </div>

                {msg && (
                  <Card className="bg-black/30 border-white/10">
                    <CardContent className="py-4">{msg}</CardContent>
                  </Card>
                )}
              </div>
            )}

            {done && (
              <Card className="bg-black/30 border-white/10">
                <CardHeader>
                  <CardTitle>Résultat enregistré</CardTitle>
                  <CardDescription>
                    {prenom} {nom} — Score QCM: {scoreQcm}/{totalQcm}
                  </CardDescription>
                </CardHeader>
                <CardContent>{msg}</CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
