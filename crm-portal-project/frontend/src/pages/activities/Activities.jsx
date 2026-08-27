import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import activityService from "../../services/activityService";
import userService from "../../services/userService";
import DataTable from "../../components/tables/DataTable";
import ActivityForm from "./ActivityForm";
import { formatStatus } from "../../utils/formatters";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadActivities();
    loadOwners();
  }, []);

  async function loadActivities() {
    try {
      setLoading(true);
      setError("");

      const response = await activityService.list();

      setActivities(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load activities");
      console.error(err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadOwners() {
    try {
      // /api/users is ADMIN/MANAGER-only on the backend - other roles
      // just get an empty owner picker instead of a broken form.
      const response = await userService.list({ size: 200 });
      setOwners(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setOwners([]);
    }
  }

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsFormOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setIsFormOpen(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      setError("");
      await activityService.remove(activityId);
      setActivities(activities.filter((a) => a.id !== activityId));
    } catch (err) {
      setError("Failed to delete activity");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedActivity?.id) {
        const response = await activityService.update(selectedActivity.id, formData);
        setActivities(activities.map((a) =>
          a.id === selectedActivity.id ? response.data : a
        ));
      } else {
        const response = await activityService.create(formData);
        setActivities([response.data, ...activities]);
      }

      setIsFormOpen(false);
      setSelectedActivity(null);
    } catch (err) {
      setError(selectedActivity?.id ? "Failed to update activity" : "Failed to create activity");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = activities.filter((activity) =>
    `${activity.subject || ""} ${activity.ownerName || ""} ${activity.type || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "type",
      label: "Type",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "NOTE")}
        </span>
      )
    },
    {
      key: "subject",
      label: "Subject"
    },
    {
      key: "relatedToType",
      label: "Related To",
      render: (value, row) => value ? `${formatStatus(value)} #${row.relatedToId}` : "-"
    },
    {
      key: "ownerName",
      label: "Owner",
      render: (value) => value || "Unassigned"
    },
    {
      key: "activityDate",
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
            onClick={() => handleEditActivity(row)}
            title="Edit activity"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteActivity(row.id)}
            title="Delete activity"
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
          <h2>Activities</h2>
          <p>
            Track calls, meetings and notes.
          </p>
        </div>

        <button className="primary-button" onClick={handleAddActivity}>
          <Plus size={18} />
          Add Activity
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
              placeholder="Search activities..."
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

      <ActivityForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedActivity(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedActivity}
        owners={owners}
        loading={formLoading}
      />
    </div>
  );
}
