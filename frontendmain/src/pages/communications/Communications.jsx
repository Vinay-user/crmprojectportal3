import {
  MessageSquare,
  Plus
} from "lucide-react";

export default function Communications() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Communications</h2>
          <p>
            Manage customer communications.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          New Message
        </button>
      </div>

      <div className="panel">
        <div className="module-placeholder">
          <MessageSquare size={48} />
          <h3>Communication Center</h3>
          <p>
            Email and communication history
            will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}