import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import Loading from "../components/common/Loading";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading text="Checking session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
