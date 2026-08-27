import {
  createContext,
  useEffect,
  useMemo,
  useState
} from "react";

import { storage } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    storage.get(STORAGE_KEYS.THEME) || "light"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    storage.set(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === "light" ? "dark" : "light"
    );
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === "dark"
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}