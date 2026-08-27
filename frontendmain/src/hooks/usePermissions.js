import useAuth from "./useAuth";

export default function usePermissions() {
  const { user, hasRole, hasPermission } = useAuth();

  const canAny = (permissions = []) =>
    permissions.length === 0 ||
    permissions.some((permission) => hasPermission(permission));

  const canAll = (permissions = []) =>
    permissions.every((permission) => hasPermission(permission));

  return {
    role: user?.role || null,
    hasRole,
    hasPermission,
    canAny,
    canAll
  };
}
