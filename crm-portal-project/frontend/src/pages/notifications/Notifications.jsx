import { useEffect, useState } from "react";
import { Bell, CheckCheck, Check, Trash2 } from "lucide-react";

import notificationService from "../../services/notificationService";
import { formatStatus } from "../../utils/formatters";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await notificationService.list();

      setNotifications(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load notifications");
      console.error(err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkRead = async (id) => {
    try {
      setError("");
      const response = await notificationService.markRead(id);
      setNotifications(notifications.map((n) => (n.id === id ? response.data : n)));
    } catch (err) {
      setError("Failed to mark notification as read");
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setError("");
      await notificationService.markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      setError("Failed to mark all as read");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) {
      return;
    }

    try {
      setError("");
      await notificationService.remove(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      setError("Failed to delete notification");
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Notifications</h2>
          <p>
            Stay updated with CRM activity{unreadCount > 0 ? ` - ${unreadCount} unread` : ""}.
          </p>
        </div>

        {notifications.length > 0 && (
          <button className="secondary-button" onClick={handleMarkAllRead}>
            <CheckCheck size={18} />
            Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="panel">
        {loading ? (
          <div className="module-placeholder">
            <p>Loading...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="module-placeholder">
            <Bell size={48} />
            <h3>No Notifications</h3>
            <p>You're all caught up.</p>
          </div>
        ) : (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-row${notification.isRead ? "" : " notification-unread"}`}
              >
                <div>
                  <span className="status-badge">
                    {formatStatus(notification.type || "INFO")}
                  </span>
                  <strong style={{ marginLeft: 10 }}>{notification.title}</strong>
                  <p style={{ margin: "6px 0 0" }}>{notification.message}</p>
                  <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}
                  </span>
                </div>

                <div className="action-buttons">
                  {!notification.isRead && (
                    <button
                      className="icon-button"
                      onClick={() => handleMarkRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    className="icon-button delete-button"
                    onClick={() => handleDelete(notification.id)}
                    title="Delete notification"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
