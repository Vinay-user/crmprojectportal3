import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ENROLLMENT_STATUSES, PAYMENT_STATUSES } from "../../utils/constants";

export default function EnrollmentForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  batches = [],
  contacts = [],
  companies = [],
  loading = false
}) {
  const emptyForm = {
    batchId: "",
    contactId: "",
    companyId: "",
    status: "ENROLLED",
    paymentStatus: "PENDING",
    feeAmount: "",
    notes: ""
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields EnrollmentRequest accepts on the backend -
      // initialData is the full EnrollmentDto (also has id, batchCode,
      // courseName, contactName, companyName, enrolledAt, completedAt,
      // certificateNumber, createdAt, updatedAt).
      setFormData({
        batchId: initialData.batchId ?? "",
        contactId: initialData.contactId ?? "",
        companyId: initialData.companyId ?? "",
        status: initialData.status || "ENROLLED",
        paymentStatus: initialData.paymentStatus || "PENDING",
        feeAmount: initialData.feeAmount ?? "",
        notes: initialData.notes || ""
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.batchId) newErrors.batchId = "Batch is required";
    if (!formData.contactId) newErrors.contactId = "Trainee (contact) is required";
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
      batchId: Number(formData.batchId),
      contactId: Number(formData.contactId),
      companyId: formData.companyId ? Number(formData.companyId) : null,
      feeAmount: formData.feeAmount === "" ? null : Number(formData.feeAmount)
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
          <h3>{initialData ? "Edit Enrollment" : "Add New Enrollment"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="batchId">Batch *</label>
            <select
              id="batchId"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              disabled={loading}
              className={errors.batchId ? "input-error" : ""}
            >
              <option value="">Select a batch...</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batchCode} - {batch.courseName}
                </option>
              ))}
            </select>
            {errors.batchId && <span className="error-text">{errors.batchId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contactId">Trainee (Contact) *</label>
            <select
              id="contactId"
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              disabled={loading}
              className={errors.contactId ? "input-error" : ""}
            >
              <option value="">Select a contact...</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                  {contact.companyName ? ` (${contact.companyName})` : ""}
                </option>
              ))}
            </select>
            {errors.contactId && <span className="error-text">{errors.contactId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="companyId">Sponsoring / Client Company</label>
            <select
              id="companyId"
              name="companyId"
              value={formData.companyId}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">None (self-paid)</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange} disabled={loading}>
              {ENROLLMENT_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="paymentStatus">Payment Status</label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              disabled={loading}
            >
              {PAYMENT_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="feeAmount">Fee Amount</label>
            <input
              id="feeAmount"
              type="number"
              min="0"
              step="0.01"
              name="feeAmount"
              value={formData.feeAmount}
              onChange={handleChange}
              placeholder="299.00"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special arrangements, discounts, etc."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update Enrollment" : "Add Enrollment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
