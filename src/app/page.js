"use client";

import React from "react";
import ChatPage from "@/frontend/components/ChatPage";
import CvGeneratorPage from "@/frontend/components/generate-cv/page";
import { Button } from "@/frontend/components/ui/button";

export default function Page() {
  const [mode, setMode] = React.useState("chat");

  return (
    <div className="h-dvh overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-5xl font-extrabold text-center mb-4 tracking-wide">
          Bienvenue sur GOJO GPT
        </h1>
        <h2 className="text-xl text-center mb-4">Ryōiki Tenkai</h2>

        <div className="flex justify-center gap-2">
          <Button
            variant={mode === "chat" ? "default" : "secondary"}
            onClick={() => setMode("chat")}
          >
            Chat
          </Button>
          <Button
            variant={mode === "cv" ? "default" : "secondary"}
            onClick={() => setMode("cv")}
          >
            Générateur de CV
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {mode === "chat" ? <ChatPage /> : <CvGeneratorPage />}
      </div>
    </div>
  );
}
