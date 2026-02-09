import { signOut } from "firebase/auth";
import { auth } from "@/frontend/lib/firebase";
import { useRouter } from "next/navigation";

export default function LogoutPopup({ onCancel }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <span className="font-semibold text-lg mb-4">
          Confirmer la déconnexion ?
        </span>
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/80 transition"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
