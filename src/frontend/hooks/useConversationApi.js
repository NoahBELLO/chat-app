import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";

export default function useConversationApi() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getToken() {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilisateur non connecté");
    return await user.getIdToken();
  }

  useEffect(async () => {
    setLoading(true);
    setError(null);
    const token = await getToken();
    fetch("/api/conversation", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement des conversations");
        return res.json();
      })
      .then((data) => setConversations(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function fetchConversations() {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/conversation", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok)
        throw new Error("Erreur lors du chargement des conversations");
      const data = await res.json();
      setConversations(data);
      return data;
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }

  async function createConversation(participants) {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch("/api/conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ participants }),
      });
      if (!res.ok) throw new Error("Erreur lors de la création");
      const conv = await res.json();
      setConversations((prev) => [conv, ...prev]);
      return conv;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    conversations,
    loading,
    error,
    fetchConversations,
    createConversation,
    setConversations,
  };
}
