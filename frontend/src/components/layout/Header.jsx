import {
  Bell,
  Menu,
  Moon,
  Search,
  Sun
} from "lucide-react";

import { useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const titles = {
  "/dashboard": "Dashboard",
  "/leads": "Leads",
  "/contacts": "Contacts",
  "/companies": "Companies",
  "/deals": "Deals",
  "/activities": "Activities",
  "/tasks": "Tasks",
  "/calendar": "Calendar",
  "/communications": "Communications",
  "/reports": "Reports",
  "/notifications": "Notifications",
  "/users": "Users",
  "/teams": "Teams",
  "/settings": "Settings"
};

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const { isDark, toggleTheme } =
    useContext(ThemeContext);

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="mobile-menu">
          <Menu size={21} />
        </button>

        <div>
          <h1>
            {titles[location.pathname] ||
              "CRM Portal"}
          </h1>

          <p>
            Welcome back,{" "}
            {user?.firstName ||
              user?.name ||
              "User"}
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={18} />
          <input
            placeholder="Search..."
            type="search"
          />
        </div>

        <button
          className="icon-button"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {isDark ? (
            <Sun size={19} />
          ) : (
            <Moon size={19} />
          )}
        </button>

        <button
          className="icon-button"
          title="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>
      </div>
    </header>
  );
}