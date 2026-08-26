import api from "./api";

const userService = {
  list(params = {}) {
    return api.get("/users", { params });
  },

  get(id) {
    return api.get(`/users/${id}`);
  },

  create(data) {
    return api.post("/users", data);
  },

  update(id, data) {
    return api.put(`/users/${id}`, data);
  },

  remove(id) {
    return api.delete(`/users/${id}`);
  }
};

export default userService;