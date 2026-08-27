import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

import companyService from "../../services/companyService";
import userService from "../../services/userService";
import DataTable from "../../components/tables/DataTable";
import CompanyForm from "./CompanyForm";
import { formatCurrency } from "../../utils/formatters";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompanies();
    loadOwners();
  }, []);

  async function loadCompanies() {
    try {
      setLoading(true);
      setError("");

      const response = await companyService.list();

      setCompanies(
        response.data?.content ||
        response.data ||
        []
      );
    } catch (err) {
      setError("Failed to load companies");
      console.error(err);
      setCompanies([]);
    } finally {
      setLoading(false);
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

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) {
      return;
    }

    try {
      setError("");
      await companyService.remove(companyId);
      setCompanies(companies.filter((c) => c.id !== companyId));
    } catch (err) {
      setError("Failed to delete company");
      console.error(err);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedCompany?.id) {
        const response = await companyService.update(selectedCompany.id, formData);
        setCompanies(companies.map((c) =>
          c.id === selectedCompany.id ? response.data : c
        ));
      } else {
        const response = await companyService.create(formData);
        setCompanies([response.data, ...companies]);
      }

      setIsFormOpen(false);
      setSelectedCompany(null);
    } catch (err) {
      setError(selectedCompany?.id ? "Failed to update company" : "Failed to create company");
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = companies.filter((company) =>
    `${company.name || ""} ${company.industry || ""} ${company.city || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Company"
    },
    {
      key: "industry",
      label: "Industry",
      render: (value) => value || "-"
    },
    {
      key: "city",
      label: "Location",
      render: (_, row) => [row.city, row.country].filter(Boolean).join(", ") || "-"
    },
    {
      key: "annualRevenue",
      label: "Annual Revenue",
      render: (value) => (value ? formatCurrency(value) : "-")
    },
    {
      key: "ownerName",
      label: "Owner",
      render: (value) => value || "Unassigned"
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="icon-button edit-button"
            onClick={() => handleEditCompany(row)}
            title="Edit company"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="icon-button delete-button"
            onClick={() => handleDeleteCompany(row.id)}
            title="Delete company"
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
          <h2>Companies</h2>
          <p>
            Manage organizations and accounts.
          </p>
        </div>

        <button className="primary-button" onClick={handleAddCompany}>
          <Plus size={18} />
          Add Company
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
              placeholder="Search companies..."
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

      <CompanyForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCompany(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedCompany}
        owners={owners}
        loading={formLoading}
      />
    </div>
  );
}
