import { CalendarDays, Plus } from "lucide-react";

export default function Calendar() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Calendar</h2>
          <p>
            Manage meetings and appointments.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          New Event
        </button>
      </div>

      <div className="panel">
        <div className="module-placeholder calendar-placeholder">
          <CalendarDays size={52} />
          <h3>CRM Calendar</h3>
          <p>
            Your meetings and events will
            appear here.
          </p>
        </div>
      </div>
    </div>
  );
}