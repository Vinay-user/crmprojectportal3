import api from "./api";

const communicationService = {
  list(params = {}) {
    return api.get("/communications", { params });
  },

  get(id) {
    return api.get(`/communications/${id}`);
  },

  create(data) {
    return api.post("/communications", data);
  },

  update(id, data) {
    return api.put(`/communications/${id}`, data);
  },

  remove(id) {
    return api.delete(`/communications/${id}`);
  }
};

export default communicationService;