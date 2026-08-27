import { Activity, Plus } from "lucide-react";

export default function Activities() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Activities</h2>
          <p>
            Track calls, meetings and notes.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      <div className="panel">
        <div className="module-placeholder">
          <Activity size={48} />
          <h3>Activity Timeline</h3>
          <p>
            Activities will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
}