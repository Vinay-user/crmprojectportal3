import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CourseForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false
}) {
  const emptyForm = {
    name: "",
    code: "",
    category: "",
    description: "",
    durationHours: "",
    fee: "",
    currency: "USD",
    isActive: true
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields CourseRequest accepts on the backend - initialData
      // is the full CourseDto (also has id, createdAt, updatedAt).
      setFormData({
        name: initialData.name || "",
        code: initialData.code || "",
        category: initialData.category || "",
        description: initialData.description || "",
        durationHours: initialData.durationHours ?? "",
        fee: initialData.fee ?? "",
        currency: initialData.currency || "USD",
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
    if (!formData.name.trim()) newErrors.name = "Course name is required";
    if (!formData.code.trim()) newErrors.code = "Course code is required";
    if (formData.fee === "" || formData.fee === null || Number.isNaN(Number(formData.fee))) {
      newErrors.fee = "A valid fee is required";
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
      durationHours: formData.durationHours === "" ? null : Number(formData.durationHours),
      fee: Number(formData.fee)
    });
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
          <h3>{initialData ? "Edit Course" : "Add New Course"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Course Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="AWS Cloud Practitioner"
              disabled={loading}
              className={errors.name ? "input-error" : ""}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="code">Course Code *</label>
            <input
              id="code"
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="AWS-CP-101"
              disabled={loading}
              className={errors.code ? "input-error" : ""}
            />
            {errors.code && <span className="error-text">{errors.code}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Cloud, DevOps, Full Stack"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What this course covers..."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="durationHours">Duration (hours)</label>
            <input
              id="durationHours"
              type="number"
              min="0"
              name="durationHours"
              value={formData.durationHours}
              onChange={handleChange}
              placeholder="40"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fee">Fee *</label>
            <input
              id="fee"
              type="number"
              min="0"
              step="0.01"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              placeholder="299.00"
              disabled={loading}
              className={errors.fee ? "input-error" : ""}
            />
            {errors.fee && <span className="error-text">{errors.fee}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <input
              id="currency"
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              placeholder="USD"
              disabled={loading}
            />
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
              {loading ? "Saving..." : initialData ? "Update Course" : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
