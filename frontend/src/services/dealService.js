import api from "./api";

const dealService = {
  list(params = {}) {
    return api.get("/deals", { params });
  },

  get(id) {
    return api.get(`/deals/${id}`);
  },

  create(data) {
    return api.post("/deals", data);
  },

  update(id, data) {
    return api.put(`/deals/${id}`, data);
  },

  remove(id) {
    return api.delete(`/deals/${id}`);
  },

  updateStage(id, stage) {
    return api.patch(`/deals/${id}/stage`, { stage });
  }
};

export default dealService;