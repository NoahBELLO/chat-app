"use client";

import { auth } from "@/frontend/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();

export default function GoogleAuthButton() {
  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Google sign-in error:", err);
    }
  }

  return (
    <button onClick={handleGoogleLogin}
    className="w-full flex items-center justify-center gap-2 py-2 mt-2 rounded-lg bg-white text-black font-semibold border border-border shadow hover:bg-muted hover:text-white transition"
    >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <g>
                <path fill="#4285F4" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.1 1.1 14.7 0 12 0 7.1 0 2.7 2.7 0.7 6.7l3.8 3c1.1-3.2 4.1-5.1 7.5-5z"/>
                <path fill="#34A853" d="M23.3 12.2c0-.8-.1-1.6-.2-2.4H12v4.6h6.4c-.3 1.7-1.4 3.1-2.9 4l3.8 3c2.2-2 3.5-5 3.5-8.2z"/>
                <path fill="#FBBC05" d="M4.5 14.1c-.3-.9-.5-1.8-.5-2.8s.2-1.9.5-2.8l-3.8-3C.2 7.9 0 9.9 0 12c0 2.1.2 4.1.7 5.9l3.8-3z"/>
                <path fill="#EA4335" d="M12 24c2.7 0 5.1-.9 7-2.5l-3.8-3c-1.1.7-2.5 1.1-4.1 1.1-3.4 0-6.4-1.9-7.5-5l-3.8 3C2.7 21.3 7.1 24 12 24z"/>
            </g>
        </svg>
        Se connecter avec Google
    </button>
  );
}