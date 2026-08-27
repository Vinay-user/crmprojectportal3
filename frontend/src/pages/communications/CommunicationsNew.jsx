import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const Communications = () => {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ search: '', type: '', direction: '' });
  const [formData, setFormData] = useState({
    type: 'EMAIL',
    direction: 'OUTBOUND',
    subject: '',
    content: '',
    contactId: '',
    leadId: '',
    occurredAt: '',
    ownerId: ''
  });

  useEffect(() => {
    fetchCommunications();
  }, [filters]);

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE}/communications?${params}`);
      setCommunications(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/communications/${editingId}`, formData);
        alert('Communication updated!');
      } else {
        await axios.post(`${API_BASE}/communications`, formData);
        alert('Communication created!');
      }
      resetForm();
      fetchCommunications();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save communication');
    }
  };

  const handleEdit = (comm) => {
    setFormData(comm);
    setEditingId(comm.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this communication?')) {
      try {
        await axios.delete(`${API_BASE}/communications/${id}`);
        alert('Communication deleted!');
        fetchCommunications();
      } catch (error) {
        alert('Failed to delete communication');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'EMAIL',
      direction: 'OUTBOUND',
      subject: '',
      content: '',
      contactId: '',
      leadId: '',
      occurredAt: '',
      ownerId: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      'EMAIL': '#0066cc',
      'CALL': '#00cc00',
      'SMS': '#ff9900',
      'MEETING': '#cc0000'
    };
    return colors[type] || '#gray';
  };

  return (
    <div className="communications-container">
      <div className="header">
        <h1>Communications</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ New Communication'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h2>{editingId ? 'Edit Communication' : 'New Communication'}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={formData.type} onChange={handleInputChange} required>
                <option value="EMAIL">Email</option>
                <option value="CALL">Call</option>
                <option value="SMS">SMS</option>
                <option value="MEETING">Meeting</option>
              </select>
            </div>

            <div className="form-group">
              <label>Direction *</label>
              <select name="direction" value={formData.direction} onChange={handleInputChange} required>
                <option value="INBOUND">Inbound</option>
                <option value="OUTBOUND">Outbound</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Communication subject"
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows="5"
              required
              placeholder="Enter communication details"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Contact ID</label>
              <input
                type="number"
                name="contactId"
                value={formData.contactId}
                onChange={handleInputChange}
                placeholder="Contact ID"
              />
            </div>

            <div className="form-group">
              <label>Lead ID</label>
              <input
                type="number"
                name="leadId"
                value={formData.leadId}
                onChange={handleInputChange}
                placeholder="Lead ID"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Date & Time</label>
            <input
              type="datetime-local"
              name="occurredAt"
              value={formData.occurredAt}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="EMAIL">Email</option>
          <option value="CALL">Call</option>
          <option value="SMS">SMS</option>
          <option value="MEETING">Meeting</option>
        </select>
        <select
          value={filters.direction}
          onChange={(e) => setFilters({ ...filters, direction: e.target.value })}
        >
          <option value="">All Directions</option>
          <option value="INBOUND">Inbound</option>
          <option value="OUTBOUND">Outbound</option>
        </select>
      </div>

      {loading ? <div>Loading...</div> : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Direction</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {communications.map(comm => (
              <tr key={comm.id}>
                <td>{comm.id}</td>
                <td style={{ color: getTypeColor(comm.type) }}>
                  <strong>{comm.type}</strong>
                </td>
                <td>{comm.direction}</td>
                <td>{comm.subject}</td>
                <td>{comm.occurredAt}</td>
                <td>
                  <button onClick={() => handleEdit(comm)} className="btn btn-sm">Edit</button>
                  <button onClick={() => handleDelete(comm.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Communications;
