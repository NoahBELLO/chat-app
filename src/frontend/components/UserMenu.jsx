import { Button } from "@/frontend/components/ui/button";

export default function UserMenu({ user, onEdit, onLogout }) {
  return (
    <div className="absolute left-0 bottom-12 w-full bg-white border-t border-border shadow-lg p-4 flex flex-col items-center z-30">
      <img
        src={user.photoURL || "/default-avatar.png"}
        alt="avatar"
        className="w-16 h-16 rounded-full border mb-2 cursor-pointer"
        onClick={onEdit}
      />
      <span
        className="font-semibold text-lg mb-2 cursor-pointer"
        onClick={onEdit}
      >
        {user.displayName || user.email}
      </span>
      <Button variant="destructive" className="w-full mt-2" onClick={onLogout}>
        Déconnexion
      </Button>
    </div>
  );
}
