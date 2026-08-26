import api from "./api";

const taskService = {
  list(params = {}) {
    return api.get("/tasks", { params });
  },

  get(id) {
    return api.get(`/tasks/${id}`);
  },

  create(data) {
    return api.post("/tasks", data);
  },

  update(id, data) {
    return api.put(`/tasks/${id}`, data);
  },

  remove(id) {
    return api.delete(`/tasks/${id}`);
  },

  complete(id) {
    return api.patch(`/tasks/${id}/complete`);
  }
};

export default taskService;