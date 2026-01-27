import { useState } from "react";

export default function useConversationMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchMessages(conversationId) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat?conversationId=${encodeURIComponent(conversationId)}`);
      if (!res.ok) throw new Error("Erreur lors du chargement des messages");
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      setError(e.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  return { messages, setMessages, loading, error, fetchMessages };
}