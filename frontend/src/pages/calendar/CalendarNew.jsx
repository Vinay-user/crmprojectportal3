import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ search: '' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    startTime: '',
    endTime: '',
    location: '',
    relatedEntityType: '',
    relatedEntityId: '',
    reminder: false,
    reminderMinutes: 15,
    ownerId: ''
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE}/calendar/events?${params}`);
      setEvents(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE}/calendar/events/${editingId}`, formData);
        alert('Event updated!');
      } else {
        await axios.post(`${API_BASE}/calendar/events`, formData);
        alert('Event created!');
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await axios.delete(`${API_BASE}/calendar/events/${id}`);
        alert('Event deleted!');
        fetchEvents();
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: '',
      startTime: '',
      endTime: '',
      location: '',
      relatedEntityType: '',
      relatedEntityId: '',
      reminder: false,
      reminderMinutes: 15,
      ownerId: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <h1>Calendar Events</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '+ New Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <h2>{editingId ? 'Edit Event' : 'New Event'}</h2>

          <div className="form-group">
            <label>Event Title *</label>
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
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Event Type</label>
            <select name="eventType" value={formData.eventType} onChange={handleInputChange}>
              <option value="">Select type</option>
              <option value="MEETING">Meeting</option>
              <option value="CALL">Call</option>
              <option value="EMAIL">Email</option>
              <option value="REMINDER">Reminder</option>
              <option value="DEADLINE">Deadline</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time *</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Meeting room or video call link"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="reminder"
                checked={formData.reminder}
                onChange={handleInputChange}
              />
              {' '}Send Reminder
            </label>
            {formData.reminder && (
              <input
                type="number"
                name="reminderMinutes"
                value={formData.reminderMinutes}
                onChange={handleInputChange}
                placeholder="Minutes before event"
                min="5"
              />
            )}
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
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      {loading ? <div>Loading...</div> : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Start Time</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{event.title}</td>
                <td>{event.eventType}</td>
                <td>{event.startTime}</td>
                <td>{event.location}</td>
                <td>
                  <button onClick={() => handleEdit(event)} className="btn btn-sm">Edit</button>
                  <button onClick={() => handleDelete(event.id)} className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Calendar;
