import api from "./api";

const calendarService = {
  list(params = {}) {
    return api.get("/calendar/events", { params });
  },

  get(id) {
    return api.get(`/calendar/events/${id}`);
  },

  create(data) {
    return api.post("/calendar/events", data);
  },

  update(id, data) {
    return api.put(`/calendar/events/${id}`, data);
  },

  remove(id) {
    return api.delete(`/calendar/events/${id}`);
  }
};

export default calendarService;
