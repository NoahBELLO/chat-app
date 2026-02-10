import { useState } from "react";
import { auth } from "../lib/firebase.js";

export default function useConversationMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getToken() {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilisateur non connecté");
    return await user.getIdToken();
  }

  async function fetchMessages(conversationId) {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(
        `/api/chat?conversationId=${encodeURIComponent(conversationId)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
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
