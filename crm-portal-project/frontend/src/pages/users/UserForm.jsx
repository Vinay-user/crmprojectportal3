import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ROLES } from "../../utils/constants";

export default function UserForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  teams = [],
  loading = false
}) {
  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
    phone: "",
    teamId: "",
    isActive: true
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields UserRequest accepts on the backend - initialData
      // is the full UserDto (also has id, fullName, teamName, avatarUrl,
      // lastLoginAt, permissions, createdAt, updatedAt). Password is left
      // blank on edit - it's only sent if the admin types a new one.
      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        password: "",
        role: initialData.role || "USER",
        phone: initialData.phone || "",
        teamId: initialData.teamId ?? "",
        isActive: initialData.isActive ?? true
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!initialData && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (initialData && formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ...formData,
      teamId: formData.teamId ? Number(formData.teamId) : null
    };

    // Don't send an empty password on update - the backend keeps the
    // existing one when the field is omitted/blank.
    if (initialData && !formData.password) {
      delete payload.password;
    }

    onSubmit(payload);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialData ? "Edit User" : "Add New User"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Jane"
              disabled={loading}
              className={errors.firstName ? "input-error" : ""}
            />
            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Smith"
              disabled={loading}
              className={errors.lastName ? "input-error" : ""}
            />
            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jane.smith@crmportal.com"
              disabled={loading}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              {initialData ? "New Password (leave blank to keep current)" : "Password *"}
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={initialData ? "••••••••" : "At least 8 characters"}
              disabled={loading}
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} disabled={loading}>
              {Object.values(ROLES).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-202-555-0100"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="teamId">Team</label>
            <select id="teamId" name="teamId" value={formData.teamId} onChange={handleChange} disabled={loading}>
              <option value="">No team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="isActive">Status</label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive ? "true" : "false"}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.value === "true" }))
              }
              disabled={loading}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
