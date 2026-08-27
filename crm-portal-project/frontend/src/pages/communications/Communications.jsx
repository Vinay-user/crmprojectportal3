import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import communicationService from "../../services/communicationService";
import contactService from "../../services/contactService";
import leadService from "../../services/leadService";
import userService from "../../services/userService";
import DataTable from "../../components/tables/DataTable";
import CommunicationForm from "./CommunicationForm";
import { formatStatus } from "../../utils/formatters";

export default function Communications() {
  const [communications, setCommunications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCommunications();
    loadContacts();
    loadLeads();
    loadOwners();
  }, []);

  async function loadCommunications() {
    try {
      setLoading(true);
      setError("");

      const response = await communicationService.list();

      setCommunications(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load communications");
      console.error(err);
      setCommunications([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadContacts() {
    try {
      const response = await contactService.list({ size: 200 });
      setContacts(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setContacts([]);
    }
  }

  async function loadLeads() {
    try {
      const response = await leadService.list({ size: 200 });
      setLeads(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setLeads([]);
    }
  }

  async function loadOwners() {
    try {
      const response = await userService.list({ size: 200 });
      setOwners(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setOwners([]);
    }
  }

  const handleAddCommunication = () => {
    setSelectedCommunication(null);
    setIsFormOpen(true);
  };

  const handleEditCommunication = (communication) => {
    setSelectedCommunication(communication);
    setIsFormOpen(true);
  };

  const handleDeleteCommunication = async (communicationId) => {
    if (!window.confirm("Are you sure you want to delete this communication?")) {
      return;
    }

    try {
      setError("");
      await communicationService.remove(communicationId);
      setCommunications(communications.filter((c) => c.id !== communicationId));
    } catch (err) {
      setError("Failed to delete communication");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedCommunication?.id) {
        const response = await communicationService.update(selectedCommunication.id, formData);
        setCommunications(communications.map((c) =>
          c.id === selectedCommunication.id ? response.data : c
        ));
      } else {
        const response = await communicationService.create(formData);
        setCommunications([response.data, ...communications]);
      }

      setIsFormOpen(false);
      setSelectedCommunication(null);
    } catch (err) {
      setError(selectedCommunication?.id ? "Failed to update communication" : "Failed to log communication");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = communications.filter((communication) =>
    `${communication.subject || ""} ${communication.contactName || ""} ${communication.leadName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "type",
      label: "Type",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "EMAIL")}
        </span>
      )
    },
    {
      key: "direction",
      label: "Direction",
      render: (value) => formatStatus(value || "OUTBOUND")
    },
    {
      key: "subject",
      label: "Subject",
      render: (value) => value || "-"
    },
    {
      key: "contactName",
      label: "With",
      render: (value, row) => value || row.leadName || "-"
    },
    {
      key: "occurredAt",
      label: "Date",
      render: (value) => value ? new Date(value).toLocaleString() : "-"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => handleEditCommunication(row)}
            title="Edit communication"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteCommunication(row.id)}
            title="Delete communication"
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
          <h2>Communications</h2>
          <p>
            Manage customer communications.
          </p>
        </div>

        <button className="primary-button" onClick={handleAddCommunication}>
          <Plus size={18} />
          New Communication
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
              placeholder="Search communications..."
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

      <CommunicationForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCommunication(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedCommunication}
        contacts={contacts}
        leads={leads}
        owners={owners}
        loading={formLoading}
      />
    </div>
  );
}
