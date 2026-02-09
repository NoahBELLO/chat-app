"use client";

import { useState } from "react";
import { auth } from "@/frontend/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import GoogleAuthButton from "./GoogleProvider";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function handleLogin() {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-2xl bg-card shadow-lg flex flex-col gap-4 border border-border">
    <input
      type="email"
      placeholder="Email"
      className="px-4 py-2 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      type="password"
      placeholder="Password"
      className="px-4 py-2 rounded-lg bg-muted text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
      onChange={(e) => setPassword(e.target.value)}
    />

    <div className="flex gap-2">
      <button className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition" onClick={handleRegister}>S'inscire</button>
      <button className="flex-1 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/80 transition" onClick={handleLogin}>Connexion</button>
    </div>
    <GoogleAuthButton/>
  </div>
  );
}