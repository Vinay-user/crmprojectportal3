import { CheckSquare, Plus } from "lucide-react";

export default function Tasks() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Tasks</h2>
          <p>
            Manage your team's tasks.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="panel">
        <div className="module-placeholder">
          <CheckSquare size={48} />
          <h3>Task Management</h3>
          <p>
            Tasks will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
