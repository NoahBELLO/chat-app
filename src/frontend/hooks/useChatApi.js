import { useState } from "react";

export default function useChatApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendMessage(message, conversationId = null) {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: message,
          role: "user",
          ...(conversationId ? { conversationId } : {}),
        }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'appel API");
      const data = await response.json();
      return data;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { sendMessage, loading, error };
}