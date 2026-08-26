import api from "./api";

const courseService = {
  list(params = {}) {
    return api.get("/courses", { params });
  },

  get(id) {
    return api.get(`/courses/${id}`);
  },

  create(data) {
    return api.post("/courses", data);
  },

  update(id, data) {
    return api.put(`/courses/${id}`, data);
  },

  remove(id) {
    return api.delete(`/courses/${id}`);
  }
};

export default courseService;