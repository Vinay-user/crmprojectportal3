import api from "./api";

const batchService = {
  list(params = {}) {
    return api.get("/batches", { params });
  },

  get(id) {
    return api.get(`/batches/${id}`);
  },

  create(data) {
    return api.post("/batches", data);
  },

  update(id, data) {
    return api.put(`/batches/${id}`, data);
  },

  remove(id) {
    return api.delete(`/batches/${id}`);
  },

  updateStatus(id, status) {
    return api.patch(`/batches/${id}/status`, { status });
  }
};

export default batchService;