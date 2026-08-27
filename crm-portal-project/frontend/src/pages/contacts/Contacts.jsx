import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import contactService from "../../services/contactService";
import companyService from "../../services/companyService";
import DataTable from "../../components/tables/DataTable";
import ContactForm from "./ContactForm";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadContacts();
    loadCompanies();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");

      const response = await contactService.list();

      setContacts(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load contacts");
      console.error(err);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCompanies() {
    try {
      // Large page size so the company dropdown in the form has the
      // full list to choose from, not just the first page.
      const response = await companyService.list({ size: 200 });

      setCompanies(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      console.error(err);
      setCompanies([]);
    }
  }

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsFormOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsFormOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      setError("");
      await contactService.remove(contactId);
      setContacts(contacts.filter((c) => c.id !== contactId));
    } catch (err) {
      setError("Failed to delete contact");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedContact?.id) {
        const response = await contactService.update(selectedContact.id, formData);
        setContacts(contacts.map((c) =>
          c.id === selectedContact.id ? response.data : c
        ));
      } else {
        const response = await contactService.create(formData);
        setContacts([response.data, ...contacts]);
      }

      setIsFormOpen(false);
      setSelectedContact(null);
    } catch (err) {
      setError(selectedContact?.id ? "Failed to update contact" : "Failed to create contact");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = contacts.filter((contact) =>
    `${contact.firstName || ""} ${contact.lastName || ""} ${contact.email || ""} ${contact.companyName || ""}`
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
      key: "phone",
      label: "Phone"
    },
    {
      key: "jobTitle",
      label: "Role"
    },
    {
      key: "companyName",
      label: "Company",
      render: (value) => value || "Independent"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => handleEditContact(row)}
            title="Edit contact"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteContact(row.id)}
            title="Delete contact"
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
          <h2>Contacts</h2>
          <p>
            Trainees and client-company coordinators.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddContact}
        >
          <Plus size={18} />
          Add Contact
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
              placeholder="Search contacts..."
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

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedContact(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedContact}
        companies={companies}
        loading={formLoading}
      />
    </div>
  );
}
