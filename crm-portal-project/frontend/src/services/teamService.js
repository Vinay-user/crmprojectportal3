import api from "./api";

const teamService = {
  list(params = {}) {
    return api.get("/teams", { params });
  },

  get(id) {
    return api.get(`/teams/${id}`);
  },

  create(data) {
    return api.post("/teams", data);
  },

  update(id, data) {
    return api.put(`/teams/${id}`, data);
  },

  remove(id) {
    return api.delete(`/teams/${id}`);
  }
};

export default teamService;