import api from "./api";

const enrollmentService = {
  list(params = {}) {
    return api.get("/enrollments", { params });
  },

  get(id) {
    return api.get(`/enrollments/${id}`);
  },

  create(data) {
    return api.post("/enrollments", data);
  },

  update(id, data) {
    return api.put(`/enrollments/${id}`, data);
  },

  remove(id) {
    return api.delete(`/enrollments/${id}`);
  },

  complete(id) {
    return api.patch(`/enrollments/${id}/complete`);
  },

  updatePaymentStatus(id, paymentStatus) {
    return api.patch(`/enrollments/${id}/payment-status`, { paymentStatus });
  }
};

export default enrollmentService;