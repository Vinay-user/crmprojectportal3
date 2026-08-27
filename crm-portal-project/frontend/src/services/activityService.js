import api from "./api";

const activityService = {
  list(params = {}) {
    return api.get("/activities", { params });
  },

  get(id) {
    return api.get(`/activities/${id}`);
  },

  create(data) {
    return api.post("/activities", data);
  },

  update(id, data) {
    return api.put(`/activities/${id}`, data);
  },

  remove(id) {
    return api.delete(`/activities/${id}`);
  }
};

export default activityService;