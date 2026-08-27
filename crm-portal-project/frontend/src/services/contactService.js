import api from "./api";

const contactService = {
  list(params = {}) {
    return api.get("/contacts", { params });
  },

  get(id) {
    return api.get(`/contacts/${id}`);
  },

  create(data) {
    return api.post("/contacts", data);
  },

  update(id, data) {
    return api.put(`/contacts/${id}`, data);
  },

  remove(id) {
    return api.delete(`/contacts/${id}`);
  }
};

export default contactService;