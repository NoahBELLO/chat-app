import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { useAuth } from "@/frontend/hooks/useAuth";
import UserMenu from "./UserMenu";
import EditUserPopup from "./popup/EditUserPopup";
import LogoutPopup from "./popup/LogoutPopup";

export default function Sidebar({
  conversations,
  onNewConversation,
  onSelect,
  visible,
  onToggle,
}) {
  const user = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  return (
    <aside
      className={`absolute top-4 left-2 z-20 h-full flex flex-col transition-all duration-300 bg-card border-r ${visible ? "w-64" : "w-0"} overflow-hidden`}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <span className="font-bold text-lg">Conversations</span>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={onToggle}
          aria-label="Cacher la liste"
        >
          {visible ? "←" : "→"}
        </Button>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <Button
          onClick={onNewConversation}
          variant="secondary"
          className="mb-2"
        >
          + Nouvelle conversation
        </Button>
        <div className="flex flex-col gap-1">
          {conversations.length === 0 && (
            <span className="text-muted-foreground text-sm">
              Aucune conversation
            </span>
          )}
          {conversations.map((conv, idx) => (
            <Button
              key={conv.id || idx}
              variant="ghost"
              className="justify-start"
              onClick={() => onSelect(conv)}
            >
              {conv.name || `Conversation ${idx + 1}`}
            </Button>
          ))}
        </div>
      </div>

      {user && (
        <div
          className={`absolute bottom-0 left-0 w-full p-3 border-t bg-card flex items-center gap-2 cursor-pointer transition ${menuOpen ? "bg-muted" : "hover:bg-muted"}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt="avatar"
            className="w-8 h-8 rounded-full border"
          />
          <span className="font-medium text-sm">
            {user.displayName || user.email}
          </span>
          {/* Sous-menu */}
          {menuOpen && (
            <UserMenu
              user={user}
              onEdit={() => setShowEditPopup(true)}
              onLogout={(e) => {
                e.stopPropagation();
                setShowLogoutPopup(true);
              }}
            />
          )}
          {/* Popup modification info */}
          {showEditPopup && (
            <EditUserPopup
              user={user}
              onClose={() => setShowEditPopup(false)}
            />
          )}
          {/* Popup confirmation déconnexion */}
          {showLogoutPopup && (
            <LogoutPopup
              onCancel={() => setShowLogoutPopup(false)}
            />
          )}
        </div>
      )}
    </aside>
  );
}
