import {
  Navigate,
  Outlet
} from "react-router-dom";

import useAuth from "../hooks/useAuth";

export default function PermissionRoute({
  roles = [],
  permissions = []
}) {
  const {
    user,
    hasRole,
    hasPermission
  } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roleAllowed =
    roles.length === 0 ||
    hasRole(roles);

  const permissionAllowed =
    permissions.length === 0 ||
    permissions.some((permission) =>
      hasPermission(permission)
    );

  if (!roleAllowed || !permissionAllowed) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return <Outlet />;
}