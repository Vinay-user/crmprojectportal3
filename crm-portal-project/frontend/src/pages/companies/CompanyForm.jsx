import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CompanyForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  owners = [],
  loading = false
}) {
  const emptyForm = {
    name: "",
    industry: "",
    website: "",
    phone: "",
    email: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    annualRevenue: "",
    employeeCount: "",
    ownerId: ""
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields CompanyRequest accepts on the backend -
      // initialData is the full CompanyDto (also has id, ownerName,
      // createdAt, updatedAt).
      setFormData({
        name: initialData.name || "",
        industry: initialData.industry || "",
        website: initialData.website || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        addressLine: initialData.addressLine || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
        postalCode: initialData.postalCode || "",
        annualRevenue: initialData.annualRevenue ?? "",
        employeeCount: initialData.employeeCount ?? "",
        ownerId: initialData.ownerId ?? ""
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Company name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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

    onSubmit({
      ...formData,
      annualRevenue: formData.annualRevenue === "" ? null : Number(formData.annualRevenue),
      employeeCount: formData.employeeCount === "" ? null : Number(formData.employeeCount),
      ownerId: formData.ownerId ? Number(formData.ownerId) : null
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
          <h3>{initialData ? "Edit Company" : "Add New Company"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Company Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Acme Corporation"
              disabled={loading}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              id="industry"
              type="text"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="Software, Manufacturing, etc."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://acme.example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-415-555-0110"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@acme.example.com"
              disabled={loading}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="addressLine">Address</label>
            <input
              id="addressLine"
              type="text"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              placeholder="123 Market St"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              id="postalCode"
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="annualRevenue">Annual Revenue</label>
            <input
              id="annualRevenue"
              type="number"
              min="0"
              step="0.01"
              name="annualRevenue"
              value={formData.annualRevenue}
              onChange={handleChange}
              placeholder="1000000"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="employeeCount">Employee Count</label>
            <input
              id="employeeCount"
              type="number"
              min="0"
              name="employeeCount"
              value={formData.employeeCount}
              onChange={handleChange}
              placeholder="250"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="ownerId">Owner</label>
            <select id="ownerId" name="ownerId" value={formData.ownerId} onChange={handleChange} disabled={loading}>
              <option value="">Unassigned</option>
              {owners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.fullName || `${owner.firstName} ${owner.lastName}`}
                </option>
              ))}
            </select>
            {owners.length === 0 && (
              <span className="error-text" style={{ color: "var(--text-muted)" }}>
                No user list available with your current role.
              </span>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Company" : "Add Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
