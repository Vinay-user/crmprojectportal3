import api from "./api";

const companyService = {
  list(params = {}) {
    return api.get("/companies", { params });
  },

  get(id) {
    return api.get(`/companies/${id}`);
  },

  create(data) {
    return api.post("/companies", data);
  },

  update(id, data) {
    return api.put(`/companies/${id}`, data);
  },

  remove(id) {
    return api.delete(`/companies/${id}`);
  }
};

export default companyService;