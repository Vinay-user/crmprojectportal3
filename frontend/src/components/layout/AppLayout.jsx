import {
  Outlet,
  useLocation
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Header />

        <main className="content">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
}