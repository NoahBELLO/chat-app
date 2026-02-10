"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/frontend/lib/firebase";
import { useRef, useEffect } from "react";

export default function LogoutPopup({ onCancel }) {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onCancel();
    } catch (err) {
      console.error("CRASH dans handleLogout:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center min-w-[320px] border border-border animate-fadeIn">
        <span className="font-bold text-xl mb-5 text-primary text-black">
          Confirmer la déconnexion&nbsp;?
        </span>
        <div className="flex gap-4 w-full">
          <button
            className="flex-1 py-2 rounded-lg border border-primary text-black text-primary font-semibold hover:bg-primary/10 transition-colors duration-150"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-destructive text-white font-semibold shadow hover:bg-destructive/80 transition-colors duration-150"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
