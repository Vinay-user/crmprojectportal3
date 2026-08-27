import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import teamService from "../../services/teamService";
import userService from "../../services/userService";
import DataTable from "../../components/tables/DataTable";
import TeamForm from "./TeamForm";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTeams();
    loadManagers();
  }, []);

  async function loadTeams() {
    try {
      setLoading(true);
      setError("");

      const response = await teamService.list();

      setTeams(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load teams");
      console.error(err);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadManagers() {
    try {
      // /api/users is ADMIN/MANAGER-only on the backend - if the logged-in
      // user doesn't have that role, this fails and we just show an empty
      // manager list instead of breaking the page.
      const response = await userService.list({ size: 200 });
      setManagers(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setManagers([]);
    }
  }

  const handleAddTeam = () => {
    setSelectedTeam(null);
    setIsFormOpen(true);
  };

  const handleEditTeam = (team) => {
    setSelectedTeam(team);
    setIsFormOpen(true);
  };

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team? Members will be unassigned, not deleted.")) {
      return;
    }

    try {
      setError("");
      await teamService.remove(teamId);
      setTeams(teams.filter((t) => t.id !== teamId));
    } catch (err) {
      setError("Failed to delete team");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedTeam?.id) {
        const response = await teamService.update(selectedTeam.id, formData);
        setTeams(teams.map((t) =>
          t.id === selectedTeam.id ? response.data : t
        ));
      } else {
        const response = await teamService.create(formData);
        setTeams([response.data, ...teams]);
      }

      setIsFormOpen(false);
      setSelectedTeam(null);
    } catch (err) {
      setError(selectedTeam?.id ? "Failed to update team" : "Failed to create team");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = teams.filter((team) =>
    `${team.name || ""} ${team.managerName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Team"
    },
    {
      key: "description",
      label: "Description",
      render: (value) => value || "-"
    },
    {
      key: "managerName",
      label: "Manager",
      render: (value) => value || "Unassigned"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => handleEditTeam(row)}
            title="Edit team"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteTeam(row.id)}
            title="Delete team"
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
          <h2>Teams</h2>
          <p>
            Manage sales and CRM teams.
          </p>
        </div>

        <button className="primary-button" onClick={handleAddTeam}>
          <Plus size={18} />
          Add Team
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
              placeholder="Search teams..."
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

      <TeamForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTeam(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedTeam}
        managers={managers}
        loading={formLoading}
      />
    </div>
  );
}
