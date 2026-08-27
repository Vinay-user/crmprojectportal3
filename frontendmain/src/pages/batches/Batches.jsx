import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import batchService from "../../services/batchService";
import courseService from "../../services/courseService";
import userService from "../../services/userService";
import DataTable from "../../components/tables/DataTable";
import BatchForm from "./BatchForm";
import { formatStatus } from "../../utils/formatters";
import { ROLES } from "../../utils/constants";

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBatches();
    loadCourses();
    loadTrainers();
  }, []);

  async function loadBatches() {
    try {
      setLoading(true);
      setError("");

      const response = await batchService.list();

      setBatches(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load batches");
      console.error(err);
      setBatches([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadCourses() {
    try {
      const response = await courseService.list({ size: 200 });
      setCourses(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setCourses([]);
    }
  }

  async function loadTrainers() {
    try {
      // /api/users is ADMIN/MANAGER-only on the backend - if the logged-in
      // user doesn't have that role, this fails and we just show an empty
      // trainer list instead of breaking the page (batches can be saved
      // without a trainer and assigned one later).
      const response = await userService.list({ role: ROLES.TRAINER, size: 200 });
      setTrainers(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setTrainers([]);
    }
  }

  const handleAddBatch = () => {
    setSelectedBatch(null);
    setIsFormOpen(true);
  };

  const handleEditBatch = (batch) => {
    setSelectedBatch(batch);
    setIsFormOpen(true);
  };

  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) {
      return;
    }

    try {
      setError("");
      await batchService.remove(batchId);
      setBatches(batches.filter((b) => b.id !== batchId));
    } catch (err) {
      setError("Failed to delete batch");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedBatch?.id) {
        const response = await batchService.update(selectedBatch.id, formData);
        setBatches(batches.map((b) =>
          b.id === selectedBatch.id ? response.data : b
        ));
      } else {
        const response = await batchService.create(formData);
        setBatches([response.data, ...batches]);
      }

      setIsFormOpen(false);
      setSelectedBatch(null);
    } catch (err) {
      setError(selectedBatch?.id ? "Failed to update batch" : "Failed to create batch");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = batches.filter((batch) =>
    `${batch.batchCode || ""} ${batch.courseName || ""} ${batch.trainerName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "batchCode",
      label: "Batch"
    },
    {
      key: "courseName",
      label: "Course"
    },
    {
      key: "trainerName",
      label: "Trainer",
      render: (value) => value || "Unassigned"
    },
    {
      key: "mode",
      label: "Mode",
      render: (value) => formatStatus(value || "")
    },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "UPCOMING")}
        </span>
      )
    },
    {
      key: "startDate",
      label: "Starts"
    },
    {
      key: "capacity",
      label: "Capacity"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => handleEditBatch(row)}
            title="Edit batch"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteBatch(row.id)}
            title="Delete batch"
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
          <h2>Batches</h2>
          <p>
            Scheduled course runs and trainer assignments.
          </p>
        </div>

        <button className="primary-button" onClick={handleAddBatch}>
          <Plus size={18} />
          Add Batch
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
              placeholder="Search batches..."
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

      <BatchForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBatch(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedBatch}
        courses={courses}
        trainers={trainers}
        loading={formLoading}
      />
    </div>
  );
}
