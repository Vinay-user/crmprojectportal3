import { Building2, Plus } from "lucide-react";

export default function Companies() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Companies</h2>
          <p>
            Manage organizations and accounts.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Company
        </button>
      </div>

      <div className="panel">
        <div className="module-placeholder">
          <Building2 size={48} />
          <h3>Companies Management</h3>
          <p>
            Company records will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}