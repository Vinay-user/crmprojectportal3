import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function TeamForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  managers = [],
  loading = false
}) {
  const emptyForm = {
    name: "",
    description: "",
    managerId: ""
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields TeamRequest accepts on the backend - initialData
      // is the full TeamDto (also has id, managerName, createdAt, updatedAt).
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        managerId: initialData.managerId ?? ""
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Team name is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...formData,
      managerId: formData.managerId ? Number(formData.managerId) : null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? "Edit Team" : "Add New Team"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Team Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Sales - East"
              disabled={loading}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What this team covers..."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="managerId">Manager</label>
            <select
              id="managerId"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.fullName || `${manager.firstName} ${manager.lastName}`}
                </option>
              ))}
            </select>
            {managers.length === 0 && (
              <span className="error-text" style={{ color: "var(--text-muted)" }}>
                No user list available with your current role - you can still save
                the team and assign a manager later.
              </span>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Team" : "Add Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
