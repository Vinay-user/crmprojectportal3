import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";

import authService from "../services/authService";
import { storage } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    storage.get(STORAGE_KEYS.USER)
  );

  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);

    const token = data.token || data.accessToken;

    if (token) {
      storage.set(STORAGE_KEYS.TOKEN, token);
    }

    const loggedUser = data.user || data;

    storage.set(STORAGE_KEYS.USER, loggedUser);
    setUser(loggedUser);

    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();

    storage.remove(STORAGE_KEYS.TOKEN);
    storage.remove(STORAGE_KEYS.USER);

    setUser(null);
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const token = storage.get(STORAGE_KEYS.TOKEN);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.me();

        const normalized =
          currentUser.data || currentUser;

        storage.set(
          STORAGE_KEYS.USER,
          normalized
        );

        setUser(normalized);
      } catch {
        storage.remove(STORAGE_KEYS.TOKEN);
        storage.remove(STORAGE_KEYS.USER);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const hasRole = useCallback(
    (roles) => {
      if (!user) return false;

      const allowedRoles = Array.isArray(roles)
        ? roles
        : [roles];

      return allowedRoles.includes(user.role);
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;

      if (user.role === "ADMIN") {
        return true;
      }

      return (
        user.permissions?.includes(permission) ||
        false
      );
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasRole,
      hasPermission
    }),
    [
      user,
      loading,
      login,
      logout,
      hasRole,
      hasPermission
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}