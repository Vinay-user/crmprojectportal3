import { Plus, UsersRound } from "lucide-react";

export default function Teams() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Teams</h2>
          <p>
            Manage sales and CRM teams.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Team
        </button>
      </div>

      <div className="panel">
        <div className="module-placeholder">
          <UsersRound size={48} />
          <h3>Team Management</h3>
          <p>
            Your teams will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}