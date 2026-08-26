import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Contact,
  Building2,
  DollarSign,
  Activity,
  CheckSquare,
  CalendarDays,
  MessageSquare,
  BarChart3,
  Bell,
  Users,
  UsersRound,
  Settings as SettingsIcon,
  LogOut,
  Kanban,
  BookOpen,
  Layers,
  GraduationCap
} from "lucide-react";

import useAuth from "../../hooks/useAuth";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "Leads", icon: UserPlus },
  { to: "/contacts", label: "Contacts", icon: Contact },
  { to: "/companies", label: "Companies", icon: Building2 },
  { to: "/deals", label: "Deals", icon: DollarSign },
  { to: "/activities", label: "Activities", icon: Activity },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/communications", label: "Communications", icon: MessageSquare },
  { to: "/reports", label: "Reports", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/users", label: "Users", icon: Users },
  { to: "/teams", label: "Teams", icon: UsersRound },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/courses", label: "Courses", icon: BookOpen },
  { to: "/batches", label: "Batches", icon: Layers },
  { to: "/enrollments", label: "Enrollments", icon: GraduationCap }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.firstName || user?.name || "User";

  const initials =
    (user?.firstName?.[0] || user?.name?.[0] || "U").toUpperCase() +
    (user?.lastName?.[0] || "").toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Kanban size={24} />
        <span>CRM Portal</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item${isActive ? " active" : ""}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initials}</div>

          <div>
            <strong>{displayName}</strong>
            <small>{user?.email || ""}</small>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
