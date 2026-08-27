import api from "./api";

const notificationService = {
  list(params = {}) {
    return api.get("/notifications", { params });
  },

  markRead(id) {
    return api.patch(`/notifications/${id}/read`);
  },

  markAllRead() {
    return api.patch("/notifications/read-all");
  },

  remove(id) {
    return api.delete(`/notifications/${id}`);
  }
};

export default notificationService;