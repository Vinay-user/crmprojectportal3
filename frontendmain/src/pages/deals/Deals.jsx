import {
  DollarSign,
  Plus
} from "lucide-react";

const stages = [
  "NEW",
  "QUALIFICATION",
  "PROPOSAL",
  "NEGOTIATION",
  "WON"
];

export default function Deals() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Deals Pipeline</h2>
          <p>
            Track your sales opportunities.
          </p>
        </div>

        <button className="primary-button">
          <Plus size={18} />
          Add Deal
        </button>
      </div>

      <div className="kanban-board">
        {stages.map((stage) => (
          <div
            className="kanban-column"
            key={stage}
          >
            <div className="kanban-column-header">
              <span>{stage}</span>
              <span className="kanban-count">
                0
              </span>
            </div>

            <div className="kanban-drop-zone">
              <DollarSign size={32} />

              <span>
                No deals
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}