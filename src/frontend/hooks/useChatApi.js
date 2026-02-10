import { useState } from "react";
import { auth } from "../lib/firebase.js";

export default function useChatApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getToken() {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilisateur non connecté");
    return await user.getIdToken();
  }

  async function sendMessage(message, conversationId = null, participants = []) {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: message,
          role: "user",
          ...(conversationId ? { conversationId } : {}),
          participants,
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
