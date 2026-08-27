import api from "./api";

const authService = {
  async login(credentials) {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    return response.data;
  },

  async register(data) {
    const response = await api.post(
      "/auth/register",
      data
    );

    return response.data;
  },

  async me() {
    const response = await api.get("/auth/me");

    return response.data;
  },

  async logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // Logout locally even if server request fails.
    }
  }
};

export default authService;