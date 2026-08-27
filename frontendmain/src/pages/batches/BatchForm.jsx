import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { BATCH_MODES, BATCH_STATUSES } from "../../utils/constants";

export default function BatchForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  courses = [],
  trainers = [],
  loading = false
}) {
  const emptyForm = {
    courseId: "",
    batchCode: "",
    trainerId: "",
    mode: "ONLINE",
    status: "UPCOMING",
    startDate: "",
    endDate: "",
    capacity: "",
    location: ""
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields BatchRequest accepts on the backend - initialData
      // is the full BatchDto (also has id, courseName, trainerName,
      // createdAt, updatedAt).
      setFormData({
        courseId: initialData.courseId ?? "",
        batchCode: initialData.batchCode || "",
        trainerId: initialData.trainerId ?? "",
        mode: initialData.mode || "ONLINE",
        status: initialData.status || "UPCOMING",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        capacity: initialData.capacity ?? "",
        location: initialData.location || ""
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseId) newErrors.courseId = "Course is required";
    if (!formData.batchCode.trim()) newErrors.batchCode = "Batch code is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
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
      courseId: Number(formData.courseId),
      trainerId: formData.trainerId ? Number(formData.trainerId) : null,
      capacity: formData.capacity === "" ? null : Number(formData.capacity),
      endDate: formData.endDate || null
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
          <h3>{initialData ? "Edit Batch" : "Add New Batch"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseId">Course *</label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              disabled={loading}
              className={errors.courseId ? "input-error" : ""}
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
            {errors.courseId && <span className="error-text">{errors.courseId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="batchCode">Batch Code *</label>
            <input
              id="batchCode"
              type="text"
              name="batchCode"
              value={formData.batchCode}
              onChange={handleChange}
              placeholder="AWS-CP-2026-JAN"
              disabled={loading}
              className={errors.batchCode ? "input-error" : ""}
            />
            {errors.batchCode && <span className="error-text">{errors.batchCode}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="trainerId">Trainer</label>
            <select
              id="trainerId"
              name="trainerId"
              value={formData.trainerId}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {trainers.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.fullName || `${trainer.firstName} ${trainer.lastName}`}
                </option>
              ))}
            </select>
            {trainers.length === 0 && (
              <span className="error-text" style={{ color: "var(--text-muted)" }}>
                No trainer list available with your current role - you can still save
                the batch and assign a trainer later.
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mode">Mode</label>
            <select id="mode" name="mode" value={formData.mode} onChange={handleChange} disabled={loading}>
              {BATCH_MODES.map((mode) => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} disabled={loading}>
              {BATCH_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              disabled={loading}
              className={errors.startDate ? "input-error" : ""}
            />
            {errors.startDate && <span className="error-text">{errors.startDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input
              id="capacity"
              type="number"
              min="0"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="25"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Zoom link or venue name"
              disabled={loading}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Batch" : "Add Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
