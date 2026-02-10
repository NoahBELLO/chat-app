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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setConversations([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/conversation", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok)
          throw new Error("Erreur lors du chargement des conversations");
        const data = await res.json();
        setConversations(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
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
