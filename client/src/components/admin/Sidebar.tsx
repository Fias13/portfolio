import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Briefcase,
  Trophy,
  Award,
  Newspaper,
  MessageSquare,
  UserCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  { to: "/admin/certificates", label: "Certificates", icon: Award },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare },
  { to: "/admin/profile", label: "Profile", icon: UserCircle },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-ink-950 text-ink-200">
      <div className="flex items-center justify-between px-5 py-5">
        <span className="font-mono text-lg font-bold text-white">
          JIRAT<span className="text-brand-500">.</span>
          <span className="ml-1 text-xs font-normal text-ink-500">admin</span>
        </span>
        <button onClick={onNavigate} className="p-1 text-ink-400 hover:text-white lg:hidden" aria-label="Close menu">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-brand-500/15 text-brand-400" : "text-ink-300 hover:bg-ink-900 hover:text-white"
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink-800 p-4">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-xs font-bold text-brand-400">
            {user?.name?.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-ink-500">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-300 hover:bg-ink-900 hover:text-white"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  );
}
