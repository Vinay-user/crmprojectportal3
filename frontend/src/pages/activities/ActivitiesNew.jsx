import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ search: '', type: '' });
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    relatedEntityType: '',
    relatedEntityId: '',
    scheduledAt: '',
    completedAt: '',
    ownerId: ''
  });

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE}/activities?${params}`);
      setActivities(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
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
        await axios.put(`${API_BASE}/activities/${editingId}`, formData);
        alert('Activity updated!');
      } else {
        await axios.post(`${API_BASE}/activities`, formData);
        alert('Activity created!');
      }
      resetForm();
      fetchActivities();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save activity');
    }
  };

  const handleEdit = (activity) => {
    setFormData(activity);
    setEditingId(activity.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this activity?')) {
      try {
        await axios.delete(`${API_BASE}/activities/${id}`);
        alert('Activity deleted!');
        fetchActivities();
      } catch (error) {
        alert('Failed to delete activity');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      title: '',
      description: '',
      relatedEntityType: '',
      relatedEntityId: '',
      scheduledAt: '',
      completedAt: '',
      ownerId: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="activities-container">
      <div className="header">
        <h1>Activities</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ New Activity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h2>{editingId ? 'Edit Activity' : 'New Activity'}</h2>
          <div className="form-group">
            <label>Activity Type *</label>
            <select name="type" value={formData.type} onChange={handleInputChange} required>
              <option value="">Select type</option>
              <option value="CALL">Call</option>
              <option value="EMAIL">Email</option>
              <option value="MEETING">Meeting</option>
              <option value="TASK">Task</option>
              <option value="NOTE">Note</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Scheduled Date</label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={formData.scheduledAt}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Related Entity Type</label>
            <select name="relatedEntityType" value={formData.relatedEntityType} onChange={handleInputChange}>
              <option value="">Select entity</option>
              <option value="DEAL">Deal</option>
              <option value="LEAD">Lead</option>
              <option value="CONTACT">Contact</option>
              <option value="COMPANY">Company</option>
            </select>
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
      </div>

      {loading ? <div>Loading...</div> : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Title</th>
              <th>Scheduled</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.id}</td>
                <td>{activity.type}</td>
                <td>{activity.title}</td>
                <td>{activity.scheduledAt}</td>
                <td>
                  <button onClick={() => handleEdit(activity)} className="btn btn-sm">Edit</button>
                  <button onClick={() => handleDelete(activity.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Activities;
