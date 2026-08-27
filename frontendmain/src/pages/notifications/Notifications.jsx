import { Bell } from "lucide-react";

export default function Notifications() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Notifications</h2>
          <p>
            Stay updated with CRM activity.
          </p>
        </div>
      </div>

      <div className="panel">
        <div className="module-placeholder">
          <Bell size={48} />
          <h3>No Notifications</h3>
          <p>
            You're all caught up.
          </p>
        </div>
      </div>
    </div>
  );
}