import { useState, useEffect } from "react";
import { X } from "lucide-react";

const TYPES = ["EMAIL", "CALL", "SMS", "MEETING"];
const DIRECTIONS = ["INBOUND", "OUTBOUND"];

export default function CommunicationForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  contacts = [],
  leads = [],
  owners = [],
  loading = false
}) {
  const emptyForm = {
    type: "EMAIL",
    direction: "OUTBOUND",
    subject: "",
    content: "",
    contactId: "",
    leadId: "",
    ownerId: "",
    occurredAt: ""
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      // Only the fields CommunicationRequest accepts on the backend -
      // initialData is the full CommunicationDto (also has id, contactName,
      // leadName, ownerName, createdAt).
      setFormData({
        type: initialData.type || "EMAIL",
        direction: initialData.direction || "OUTBOUND",
        subject: initialData.subject || "",
        content: initialData.content || "",
        contactId: initialData.contactId ?? "",
        leadId: initialData.leadId ?? "",
        ownerId: initialData.ownerId ?? "",
        occurredAt: initialData.occurredAt ? initialData.occurredAt.slice(0, 16) : ""
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.contactId && !formData.leadId) {
      newErrors.contactId = "Link this to a contact or a lead";
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
      contactId: formData.contactId ? Number(formData.contactId) : null,
      leadId: formData.leadId ? Number(formData.leadId) : null,
      ownerId: formData.ownerId ? Number(formData.ownerId) : null,
      occurredAt: formData.occurredAt || null
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
          <h3>{initialData ? "Edit Communication" : "Log New Communication"}</h3>
          <button className="close-button" onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} disabled={loading}>
              {TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="direction">Direction</label>
            <select id="direction" name="direction" value={formData.direction} onChange={handleChange} disabled={loading}>
              {DIRECTIONS.map((dir) => (
                <option key={dir} value={dir}>{dir}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Contract draft attached"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="What was said/sent..."
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contactId">Contact</label>
            <select
              id="contactId"
              name="contactId"
              value={formData.contactId}
              onChange={handleChange}
              disabled={loading}
              className={errors.contactId ? "input-error" : ""}
            >
              <option value="">None</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.firstName} {contact.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="leadId">Lead</label>
            <select
              id="leadId"
              name="leadId"
              value={formData.leadId}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">None</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.firstName} {lead.lastName}
                </option>
              ))}
            </select>
            {errors.contactId && <span className="error-text">{errors.contactId}</span>}
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
          </div>

          <div className="form-group">
            <label htmlFor="occurredAt">Date &amp; Time</label>
            <input
              id="occurredAt"
              type="datetime-local"
              name="occurredAt"
              value={formData.occurredAt}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Update" : "Log Communication"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
