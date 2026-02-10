"use client";

import { Button } from "@/frontend/components/ui/button";

export default function EditUserPopup({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center min-w-[320px] border border-border animate-fadeIn">
        <img
          src={user.photoURL || "/img/defaultAvatar.webp"}
          alt="avatar"
          className="w-24 h-24 rounded-full border-4 border-primary shadow mb-3"
        />
        <span className="font-bold text-xl mb-1 text-black text-primary">
          {user.displayName || user.email.split("@")[0]}
        </span>
        <span className="text-gray-500 text-sm mb-4">{user.email}</span>
        {/* Ajoute ici le formulaire de modification si besoin */}
        <Button
          variant="secondary"
          className="w-full mt-2 py-2 rounded-lg font-semibold shadow hover:scale-[1.03] transition-transform duration-150"
          onClick={onClose}
        >
          Fermer
        </Button>
      </div>
    </div>
  );
}