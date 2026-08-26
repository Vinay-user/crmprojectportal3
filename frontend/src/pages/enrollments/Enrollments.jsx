import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, CheckCircle2 } from "lucide-react";

import enrollmentService from "../../services/enrollmentService";
import batchService from "../../services/batchService";
import contactService from "../../services/contactService";
import companyService from "../../services/companyService";
import DataTable from "../../components/tables/DataTable";
import EnrollmentForm from "./EnrollmentForm";
import { formatCurrency, formatStatus } from "../../utils/formatters";

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEnrollments();
    loadBatches();
    loadContacts();
    loadCompanies();
  }, []);

  async function loadEnrollments() {
    try {
      setLoading(true);
      setError("");

      const response = await enrollmentService.list();

      setEnrollments(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load enrollments");
      console.error(err);
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadBatches() {
    try {
      const response = await batchService.list({ size: 200 });
      setBatches(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setBatches([]);
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

  async function loadCompanies() {
    try {
      const response = await companyService.list({ size: 200 });
      setCompanies(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setCompanies([]);
    }
  }

  const handleAddEnrollment = () => {
    setSelectedEnrollment(null);
    setIsFormOpen(true);
  };

  const handleEditEnrollment = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsFormOpen(true);
  };

  const handleDeleteEnrollment = async (enrollmentId) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?")) {
      return;
    }

    try {
      setError("");
      await enrollmentService.remove(enrollmentId);
      setEnrollments(enrollments.filter((e) => e.id !== enrollmentId));
    } catch (err) {
      setError("Failed to delete enrollment");
      console.error(err);
    }
  };

  const handleCompleteEnrollment = async (enrollmentId) => {
    if (!window.confirm("Mark this enrollment as completed and issue a certificate?")) {
      return;
    }

    try {
      setError("");
      const response = await enrollmentService.complete(enrollmentId);
      setEnrollments(enrollments.map((e) =>
        e.id === enrollmentId ? response.data : e
      ));
    } catch (err) {
      setError("Failed to complete enrollment");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedEnrollment?.id) {
        const response = await enrollmentService.update(selectedEnrollment.id, formData);
        setEnrollments(enrollments.map((e) =>
          e.id === selectedEnrollment.id ? response.data : e
        ));
      } else {
        const response = await enrollmentService.create(formData);
        setEnrollments([response.data, ...enrollments]);
      }

      setIsFormOpen(false);
      setSelectedEnrollment(null);
    } catch (err) {
      setError(selectedEnrollment?.id ? "Failed to update enrollment" : "Failed to create enrollment");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = enrollments.filter((enrollment) =>
    `${enrollment.contactName || ""} ${enrollment.courseName || ""} ${enrollment.companyName || ""} ${enrollment.batchCode || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "contactName",
      label: "Trainee"
    },
    {
      key: "courseName",
      label: "Course",
      render: (value, row) => (value ? `${value} (${row.batchCode || ""})` : row.batchCode)
    },
    {
      key: "companyName",
      label: "Sponsoring Company",
      render: (value) => value || "-"
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "ENROLLED")}
        </span>
      )
    },
    {
      key: "paymentStatus",
      label: "Payment",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "PENDING")}
        </span>
      )
    },
    {
      key: "feeAmount",
      label: "Fee",
      render: (value) => formatCurrency(value)
    },
    {
      key: "certificateNumber",
      label: "Certificate",
      render: (value) => value || "-"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          {row.status !== "COMPLETED" && (
            <button
              className="icon-button"
              onClick={() => handleCompleteEnrollment(row.id)}
              title="Mark completed & issue certificate"
            >
              <CheckCircle2 size={16} />
            </button>
          )}
          <button
            className="icon-button edit-button"
            onClick={() => handleEditEnrollment(row)}
            title="Edit enrollment"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteEnrollment(row.id)}
            title="Delete enrollment"
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
          <h2>Enrollments</h2>
          <p>
            Trainees enrolled across all batches, and their payment/certificate status.
          </p>
        </div>

        <button className="primary-button" onClick={handleAddEnrollment}>
          <Plus size={18} />
          Add Enrollment
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
              placeholder="Search enrollments..."
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

      <EnrollmentForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedEnrollment(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedEnrollment}
        batches={batches}
        contacts={contacts}
        companies={companies}
        loading={formLoading}
      />
    </div>
  );
}
