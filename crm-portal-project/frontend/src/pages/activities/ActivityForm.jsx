import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ACTIVITY_TYPES, RELATED_ENTITY_TYPES } from "../../utils/constants";

export default function ActivityForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  owners = [],
  loading = false
}) {
  const emptyForm = {
    type: "NOTE",
    subject: "",
    description: "",
    relatedToType: "",
    relatedToId: "",
    ownerId: "",
    activityDate: ""
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields ActivityRequest accepts on the backend -
      // initialData is the full ActivityDto (also has id, ownerName,
      // createdAt, updatedAt).
      setFormData({
        type: initialData.type || "NOTE",
        subject: initialData.subject || "",
        description: initialData.description || "",
        relatedToType: initialData.relatedToType || "",
        relatedToId: initialData.relatedToId ?? "",
        ownerId: initialData.ownerId ?? "",
        // datetime-local inputs need "YYYY-MM-DDTHH:mm" - the backend
        // sends full ISO strings, so trim to the first 16 characters.
        activityDate: initialData.activityDate ? initialData.activityDate.slice(0, 16) : ""
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
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
      relatedToType: formData.relatedToType || null,
      relatedToId: formData.relatedToId ? Number(formData.relatedToId) : null,
      ownerId: formData.ownerId ? Number(formData.ownerId) : null,
      activityDate: formData.activityDate || null
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
          <h3>{initialData ? "Edit Activity" : "Add New Activity"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} disabled={loading}>
              {ACTIVITY_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Follow-up call with client"
              disabled={loading}
              className={errors.subject ? "input-error" : ""}
            />
            {errors.subject && <span className="error-text">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What happened / what's planned..."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="activityDate">Date &amp; Time</label>
            <input
              id="activityDate"
              type="datetime-local"
              name="activityDate"
              value={formData.activityDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="relatedToType">Related To (type)</label>
            <select
              id="relatedToType"
              name="relatedToType"
              value={formData.relatedToType}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">None</option>
              {RELATED_ENTITY_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="relatedToId">Related To (record ID)</label>
            <input
              id="relatedToId"
              type="number"
              min="1"
              name="relatedToId"
              value={formData.relatedToId}
              onChange={handleChange}
              placeholder="e.g. the Lead or Deal's ID"
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
              {loading ? "Saving..." : initialData ? "Update Activity" : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
