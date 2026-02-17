"use client";
import { useParams } from "next/navigation";
import QuizPage from "@/frontend/components/quizz/QuizPage";

export default function Page() {
  return <QuizPage slug={useParams()?.slug} />;
}
