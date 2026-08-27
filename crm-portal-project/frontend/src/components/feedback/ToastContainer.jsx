import { X } from "lucide-react";

import {
  useContext
} from "react";

import {
  NotificationContext
} from "../../context/NotificationContext";

export default function ToastContainer() {
  const {
    notifications,
    removeNotification
  } = useContext(NotificationContext);

  return (
    <div className="toast-container">
      {notifications.map(
        (notification) => (
          <div
            key={notification.id}
            className={`toast ${notification.type}`}
          >
            <span>
              {notification.message}
            </span>

            <button
              onClick={() =>
                removeNotification(
                  notification.id
                )
              }
            >
              <X size={16} />
            </button>
          </div>
        )
      )}
    </div>
  );
}