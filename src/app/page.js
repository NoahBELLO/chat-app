"use client";

import { useAuth } from "@/frontend/hooks/useAuth";
import ChatPage from "@/frontend/components/ChatPage";
import AuthForm from "@/frontend/components/AuthForm";

export default function Page() {
  const user = useAuth();
  
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center h-dvh">
        <span className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mr-4"></span>
        <span className="text-2xl font-semibold text-primary">Chargement...</span>
      </div>
    );
  }
  
  if (!user) return <AuthForm />;
  
  return (
    <div className="h-dvh flex flex-col">
      <div className="p-4">
        <h1 className="text-5xl font-extrabold text-center mb-6 tracking-wide">
          Bienvenue sur GOJO GPT
        </h1>
        <h2 className="text-xl text-center mb-6">Ryōiki Tenkai</h2>
      </div>
      <div className="flex-1 min-h-0">
        <ChatPage />
      </div>
    </div>
  );
}
