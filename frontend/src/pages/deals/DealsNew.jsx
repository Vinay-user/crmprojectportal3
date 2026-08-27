import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Deals.css';

const API_BASE = 'http://localhost:8080/api';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({ search: '', stage: '' });
  const [pagination, setPagination] = useState({ page: 0, size: 10 });
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    contactId: '',
    amount: '',
    currency: 'USD',
    stage: 'NEW',
    probability: '',
    expectedCloseDate: '',
    ownerId: ''
  });

  // Fetch deals
  useEffect(() => {
    fetchDeals();
  }, [filters, pagination]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: pagination.page,
        size: pagination.size
      });
      const response = await axios.get(`${API_BASE}/deals?${params}`);
      setDeals(response.data.content || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
      alert('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_BASE}/deals/${editingId}`, formData);
        alert('Deal updated successfully!');
      } else {
        // CREATE
        await axios.post(`${API_BASE}/deals`, formData);
        alert('Deal created successfully!');
      }
      resetForm();
      fetchDeals();
    } catch (error) {
      console.error('Error saving deal:', error);
      alert('Failed to save deal');
    }
  };

  const handleEdit = (deal) => {
    setFormData({
      title: deal.title,
      companyId: deal.companyId || '',
      contactId: deal.contactId || '',
      amount: deal.amount || '',
      currency: deal.currency || 'USD',
      stage: deal.stage || 'NEW',
      probability: deal.probability || '',
      expectedCloseDate: deal.expectedCloseDate || '',
      ownerId: deal.ownerId || ''
    });
    setEditingId(deal.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await axios.delete(`${API_BASE}/deals/${id}`);
        alert('Deal deleted successfully!');
        fetchDeals();
      } catch (error) {
        console.error('Error deleting deal:', error);
        alert('Failed to delete deal');
      }
    }
  };

  const handleStageChange = async (id, newStage) => {
    try {
      await axios.patch(`${API_BASE}/deals/${id}/stage`, { stage: newStage });
      alert('Deal stage updated!');
      fetchDeals();
    } catch (error) {
      console.error('Error updating stage:', error);
      alert('Failed to update stage');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      companyId: '',
      contactId: '',
      amount: '',
      currency: 'USD',
      stage: 'NEW',
      probability: '',
      expectedCloseDate: '',
      ownerId: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="deals-container">
      <div className="deals-header">
        <h1>Deals Management</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Deal'}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Deal' : 'Create New Deal'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Deal Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter deal title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Company ID</label>
                <input
                  type="number"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  placeholder="Company ID"
                />
              </div>

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
                <label>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Currency</label>
                <select name="currency" value={formData.currency} onChange={handleInputChange}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>

              <div className="form-group">
                <label>Stage</label>
                <select name="stage" value={formData.stage} onChange={handleInputChange}>
                  <option value="NEW">NEW</option>
                  <option value="QUALIFICATION">QUALIFICATION</option>
                  <option value="PROPOSAL">PROPOSAL</option>
                  <option value="NEGOTIATION">NEGOTIATION</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>
              </div>

              <div className="form-group">
                <label>Probability (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="probability"
                  value={formData.probability}
                  onChange={handleInputChange}
                  placeholder="0-100"
                />
              </div>

              <div className="form-group">
                <label>Expected Close Date</label>
                <input
                  type="date"
                  name="expectedCloseDate"
                  value={formData.expectedCloseDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Owner ID</label>
                <input
                  type="number"
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleInputChange}
                  placeholder="Owner ID"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? 'Update Deal' : 'Create Deal'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTERS */}
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search deals..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.stage}
          onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
        >
          <option value="">All Stages</option>
          <option value="NEW">NEW</option>
          <option value="QUALIFICATION">QUALIFICATION</option>
          <option value="PROPOSAL">PROPOSAL</option>
          <option value="NEGOTIATION">NEGOTIATION</option>
          <option value="WON">WON</option>
          <option value="LOST">LOST</option>
        </select>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="loading">Loading deals...</div>
      ) : deals.length === 0 ? (
        <div className="empty-state">No deals found</div>
      ) : (
        <div className="table-container">
          <table className="deals-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Stage</th>
                <th>Probability</th>
                <th>Expected Close</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map(deal => (
                <tr key={deal.id}>
                  <td>{deal.id}</td>
                  <td>{deal.title}</td>
                  <td>{deal.currency} {deal.amount?.toFixed(2)}</td>
                  <td>
                    <select
                      value={deal.stage}
                      onChange={(e) => handleStageChange(deal.id, e.target.value)}
                      className="stage-select"
                    >
                      <option value="NEW">NEW</option>
                      <option value="QUALIFICATION">QUALIFICATION</option>
                      <option value="PROPOSAL">PROPOSAL</option>
                      <option value="NEGOTIATION">NEGOTIATION</option>
                      <option value="WON">WON</option>
                      <option value="LOST">LOST</option>
                    </select>
                  </td>
                  <td>{deal.probability}%</td>
                  <td>{deal.expectedCloseDate}</td>
                  <td>
                    <button className="btn btn-sm btn-edit" onClick={() => handleEdit(deal)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(deal.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {deals.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 0}
          >
            Previous
          </button>
          <span>Page {pagination.page + 1}</span>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Deals;
