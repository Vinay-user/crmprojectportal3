import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { TASK_STATUSES, PRIORITIES, RELATED_ENTITY_TYPES } from "../../utils/constants";

export default function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  assignees = [],
  loading = false
}) {
  const emptyForm = {
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "",
    assignedTo: "",
    relatedToType: "",
    relatedToId: ""
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields TaskRequest accepts on the backend - initialData
      // is the full TaskDto (also has id, assignedToName, completedAt,
      // createdAt, updatedAt).
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "TODO",
        priority: initialData.priority || "MEDIUM",
        dueDate: initialData.dueDate || "",
        assignedTo: initialData.assignedTo ?? "",
        relatedToType: initialData.relatedToType || "",
        relatedToId: initialData.relatedToId ?? ""
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
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
      dueDate: formData.dueDate || null,
      assignedTo: formData.assignedTo ? Number(formData.assignedTo) : null,
      relatedToType: formData.relatedToType || null,
      relatedToId: formData.relatedToId ? Number(formData.relatedToId) : null
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
          <h3>{initialData ? "Edit Task" : "Add New Task"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Send proposal to client"
              disabled={loading}
              className={errors.title ? "input-error" : ""}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Details about this task..."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} disabled={loading}>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleChange} disabled={loading}>
              {PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {assignees.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName || `${user.firstName} ${user.lastName}`}
                </option>
              ))}
            </select>
            {assignees.length === 0 && (
              <span className="error-text" style={{ color: "var(--text-muted)" }}>
                No user list available with your current role.
              </span>
            )}
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
              placeholder="e.g. the Deal or Lead's ID"
              disabled={loading}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
