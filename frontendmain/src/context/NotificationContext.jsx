import {
  createContext,
  useCallback,
  useMemo,
  useState
} from "react";

export const NotificationContext =
  createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] =
    useState([]);

  const notify = useCallback(
    (message, type = "success") => {
      const id = Date.now();

      setNotifications((current) => [
        ...current,
        {
          id,
          message,
          type
        }
      ]);

      setTimeout(() => {
        setNotifications((current) =>
          current.filter(
            (notification) =>
              notification.id !== id
          )
        );
      }, 4000);
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((current) =>
      current.filter(
        (notification) =>
          notification.id !== id
      )
    );
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      notify,
      removeNotification
    }),
    [
      notifications,
      notify,
      removeNotification
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}