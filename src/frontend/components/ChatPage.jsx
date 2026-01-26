"use client";

import React from "react";
import useChatApi from "@/frontend/hooks/useChatApi";
import useConversationApi from "@/frontend/hooks/useConversationApi";
import useConversationMessages from "@/frontend/hooks/useConversationMessages";
import { ChatInput } from "@/frontend/components/ChatInput";
import { ChatBubble } from "@/frontend/components/ChatBubble";
import { Button } from "@/frontend/components/ui/button";
import Sidebar from "@/frontend/components/Sidebar";

export default function ChatPage() {
  const { sendMessage, loading, error } = useChatApi();
  const [input, setInput] = React.useState("");
  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const {
    conversations,
    loading: loadingConvs,
    error: errorConvs,
    fetchConversations,
  } = useConversationApi();
  const {
    messages,
    setMessages,
    loading: loadingMessages,
    error: errorMessages,
    fetchMessages,
  } = useConversationMessages();

  const [currentConv, setCurrentConv] = React.useState(null);
  const endRef = React.useRef(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleNewConversation() {
    setCurrentConv(null);
    setMessages([]);
    setInput("");
  }

  async function handleSelectConversation(conv) {
    setCurrentConv(conv);
    await fetchMessages(conv.id);
  }

  async function handleSend(message) {
    if (!message.trim()) return;
    setInput("");

    if (!currentConv) {
      const data = await sendMessage(message);
      if (data && data.conversationId) {
        await fetchConversations(); 
        setCurrentConv({ id: data.conversationId });
        await fetchMessages(data.conversationId);
      } else {
        setMessages([]);
      }
    } else {
      await sendMessage(message, currentConv.id);
      await fetchMessages(currentConv.id);
    }
  }

  return (
    <div className="flex flex-row h-full min-h-0">
      {/* Sidebar sur toute la hauteur */}
      <Sidebar
        conversations={conversations}
        onNewConversation={handleNewConversation}
        onSelect={handleSelectConversation}
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

      {/* Zone principale */}
      <div className="flex-1 flex flex-col h-full min-h-0">
        {(error || errorConvs || errorMessages) && (
          <div className="bg-red-100 text-red-700 px-4 py-2 text-center">
            {error || errorConvs || errorMessages}
          </div>
        )}

        {/* ZONE SCROLLABLE */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="mx-auto flex max-w-[768px] flex-col gap-2">
            {messages.map((msg, index) => (
              <ChatBubble key={msg.id} content={msg} />
            ))}
            {(loading || loadingConvs || loadingMessages) && (
              <div className="flex justify-start">
                <div className="animate-pulse bg-muted text-muted-foreground rounded-2xl px-4 py-2 text-sm">
                  L'IA réfléchit...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* INPUT FIXE */}
        <div className="border-t bg-background">
          <ChatInput
            // value={input}
            // onChange={setInput}
            onSend={handleSend}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
