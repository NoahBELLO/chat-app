import { Button } from "@/frontend/components/ui/button";

export default function Sidebar({ conversations, onNewConversation, onSelect, visible, onToggle }) {
  return (
    <aside className={`absolute top-4 left-2 z-20 h-full flex flex-col transition-all duration-300 bg-card border-r ${visible ? "w-64" : "w-0"} overflow-hidden`}>
      <div className="flex items-center justify-between p-3 border-b">
        <span className="font-bold text-lg">Conversations</span>
        <Button size="icon-sm" variant="ghost" onClick={onToggle} aria-label="Cacher la liste">
          {visible ? "←" : "→"}
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <Button onClick={onNewConversation} variant="secondary" className="mb-2">
          + Nouvelle conversation
        </Button>
        <div className="flex flex-col gap-1">
          {conversations.length === 0 && <span className="text-muted-foreground text-sm">Aucune conversation</span>}
          {conversations.map((conv, idx) => (
            <Button
              key={conv.id || idx}
              variant="ghost"
              className="justify-start"
              onClick={() => onSelect(conv)}
            >
              {conv.name || `Conversation ${idx + 1}`}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
}