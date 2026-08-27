import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import userService from "../../services/userService";
import teamService from "../../services/teamService";
import DataTable from "../../components/tables/DataTable";
import UserForm from "./UserForm";
import { formatStatus } from "../../utils/formatters";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
    loadTeams();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      // /api/users is ADMIN/MANAGER-only on the backend - other roles
      // will see the error message below instead of a broken table.
      const response = await userService.list();

      setUsers(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load users. This page requires an ADMIN or MANAGER account.");
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadTeams() {
    try {
      const response = await teamService.list({ size: 200 });
      setTeams(response.data?.content || response.data || []);
    } catch (err) {
      console.error(err);
      setTeams([]);
    }
  }

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setError("");
      await userService.remove(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      setError("Failed to delete user");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedUser?.id) {
        const response = await userService.update(selectedUser.id, formData);
        setUsers(users.map((u) =>
          u.id === selectedUser.id ? response.data : u
        ));
      } else {
        const response = await userService.create(formData);
        setUsers([response.data, ...users]);
      }

      setIsFormOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError(selectedUser?.id ? "Failed to update user" : "Failed to create user");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = users.filter((user) =>
    `${user.firstName || ""} ${user.lastName || ""} ${user.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "firstName",
      label: "Name",
      render: (_, row) => row.fullName || `${row.firstName || ""} ${row.lastName || ""}`
    },
    {
      key: "email",
      label: "Email"
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <span className="status-badge">
          {formatStatus(value || "USER")}
        </span>
      )
    },
    {
      key: "teamName",
      label: "Team",
      render: (value) => value || "-"
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span className="status-badge">
          {value ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => handleEditUser(row)}
            title="Edit user"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteUser(row.id)}
            title="Delete user"
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
          <h2>Users</h2>
          <p>
            Manage CRM users and permissions.
          </p>
        </div>

        <button className="primary-button" onClick={handleAddUser}>
          <Plus size={18} />
          Add User
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
              placeholder="Search users..."
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

      <UserForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
        teams={teams}
        loading={formLoading}
      />
    </div>
  );
}
