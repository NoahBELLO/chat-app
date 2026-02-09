import { Button } from "@/frontend/components/ui/button";

export default function EditUserPopup({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="avatar"
          className="w-20 h-20 rounded-full border mb-2"
        />
        <span className="font-semibold text-lg mb-2">
          {user.displayName || user.email}
        </span>
        {/* Ajoute ici le formulaire de modification si besoin */}
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  );
}
