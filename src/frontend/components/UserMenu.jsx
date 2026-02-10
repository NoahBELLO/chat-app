"use client";

function handleKeyDown(e, callback) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    callback();
  }
}

export default function UserMenu({ user, onEdit, onLogout }) {
  return (
    <div className="absolute left-0 bottom-12 w-full bg-white border-t border-border shadow-2xl p-6 flex flex-col items-center z-30 rounded-xl transition-all duration-200">
      <div
        className="relative group mb-3"
        role="button"
        tabIndex={0}
        onClick={onEdit}
        onKeyDown={(e) => handleKeyDown(e, onEdit)}
        title="Modifier le profil"
        style={{ cursor: "pointer" }}
        aria-label="Modifier le profil"
      >
        <img
          src={user.photoURL || "/img/defaultAvatar.webp"}
          alt="avatar"
          className="w-20 h-20 rounded-full border-4 border-primary shadow-md group-hover:scale-105 transition-transform duration-200"
        />
        <span className="absolute bottom-1 right-1 bg-primary text-white text-xs px-2 py-0.5 rounded-full opacity-80 group-hover:opacity-100 transition-opacity duration-200">
          ✎
        </span>
      </div>
      <button
        type="button"
        className="font-bold text-black text-xl mb-1 cursor-pointer hover:text-primary transition-colors duration-150 bg-transparent border-none p-0"
        onClick={onEdit}
        aria-label="Modifier le profil"
        style={{ outline: "none" }}
      >
        {user.displayName || user.email.split("@")[0]}
      </button>
      <span className="text-gray-500 text-sm mb-3">
        {user.email.split("@")[0]}
      </span>
      <button
        className="w-full flex-1 py-2 rounded-lg bg-destructive text-white font-semibold shadow hover:bg-destructive/80 transition-colors duration-150"
        onClick={onLogout}
      >
        Déconnexion
      </button>
    </div>
  );
}
