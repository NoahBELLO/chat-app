"use client";

import * as React from "react";
import { Button } from "@/frontend/components/ui/button";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Send } from "lucide-react";

export function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = React.useState("");

  const canSend = message.trim().length > 0 && !disabled;

  function handleSend() {
    if (!canSend) return;
    onSend(message.trim());
    setMessage("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="border-t p-3">
      <div
        className="mx-auto flex items-end gap-2
                      w-full
                      min-w-[320px]
                      max-w-[768px]"
      >
        <Textarea
          placeholder="Écris ton message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          className="min-h-[44px] resize-none"
        />

        <Button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="h-11 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
