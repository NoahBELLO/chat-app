import ChatPage from "@/frontend/components/ChatPage";

export default function Page() {
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
