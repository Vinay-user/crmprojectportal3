import api from "./api";

const leadService = {
  list(params = {}) {
    return api.get("/leads", { params });
  },

  get(id) {
    return api.get(`/leads/${id}`);
  },

  create(data) {
    return api.post("/leads", data);
  },

  update(id, data) {
    return api.put(`/leads/${id}`, data);
  },

  remove(id) {
    return api.delete(`/leads/${id}`);
  },

  convert(id) {
    return api.post(`/leads/${id}/convert`);
  }
};

export default leadService;