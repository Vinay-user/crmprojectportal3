import api from "./api";

const settingsService = {
  get() {
    return api.get("/settings");
  },

  update(data) {
    return api.put("/settings", data);
  }
};

export default settingsService;