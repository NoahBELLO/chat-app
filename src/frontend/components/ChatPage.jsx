"use client";

import React from "react";
import { ChatInput } from "@/frontend/components/ChatInput";
import { ChatBubble } from "@/frontend/components/ChatBubble";

export default function ChatPage() {
  const [messages, setMessages] = React.useState([]);

  const endRef = React.useRef(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(message) {
    setMessages((prev) => [...prev, message]);
  }

  return (
    <div className="flex h-dvh flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto flex max-w-[768px] flex-col gap-2">
          {messages.map((msg, index) => (
            <ChatBubble key={index} content={msg} />
          ))}

          <div ref={endRef} />
        </div>
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
