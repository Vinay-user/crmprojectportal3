import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import leadService from "../../services/leadService";
import DataTable from "../../components/tables/DataTable";
import LeadForm from "./LeadForm";
import { formatStatus } from "../../utils/formatters";

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    try {
      setLoading(true);
      setError("");

      const response = await leadService.list();

      setLeads(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load leads");
      console.error(err);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsFormOpen(true);
  };

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      setError("");
      await leadService.remove(leadId);
      setLeads(leads.filter(l => l.id !== leadId));
    } catch (err) {
      setError("Failed to delete lead");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedLead?.id) {
        // Update existing lead
        const response = await leadService.update(selectedLead.id, formData);
        setLeads(leads.map(l => 
          l.id === selectedLead.id ? response.data : l
        ));
      } else {
        // Create new lead
        const response = await leadService.create(formData);
        setLeads([response.data, ...leads]);
      }

      setIsFormOpen(false);
      setSelectedLead(null);
    } catch (err) {
      setError(selectedLead?.id ? "Failed to update lead" : "Failed to create lead");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = leads.filter((lead) =>
    `${lead.firstName || ""} ${lead.lastName || ""} ${lead.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "firstName",
      label: "Name",
      render: (_, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`
    },
    {
      key: "email",
      label: "Email"
    },
    {
      key: "company",
      label: "Company"
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "NEW")}
        </span>
      )
    },
    {
      key: "source",
      label: "Source"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => handleEditLead(row)}
            title="Edit lead"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteLead(row.id)}
            title="Delete lead"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h2>Leads</h2>
          <p>
            Manage and qualify your sales leads.
          </p>
        </div>

        <button 
          className="primary-button"
          onClick={handleAddLead}
        >
          <Plus size={18} />
          Add Lead
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      <div className="panel">
        <div className="toolbar">
          <div className="search-box">
            <Search size={18} />

            <input
              placeholder="Search leads..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
        />
      </div>

      <LeadForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedLead(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedLead}
        loading={formLoading}
      />
    </div>
  );
}
