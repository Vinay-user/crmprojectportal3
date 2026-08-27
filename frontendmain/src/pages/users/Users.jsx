import { Plus, Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Users</h2>
          <p>
            Manage CRM users and permissions.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="panel">
        <div className="module-placeholder">
          <Users size={48} />
          <h3>User Management</h3>
          <p>
            User accounts will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}