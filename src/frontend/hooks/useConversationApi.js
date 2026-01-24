import { useState, useEffect } from "react";

export default function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  async function fetchConversations() {
  setLoading(true);
  setError(null);
  try {
    const res = await fetch("/api/conversation");
    if (!res.ok) throw new Error("Erreur lors du chargement des conversations");
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

  async function createConversation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/conversation", { method: "POST" });
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
