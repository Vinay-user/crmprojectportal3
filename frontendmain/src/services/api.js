import axios from "axios";
import config from "../config/config";
import { storage } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use(
  (request) => {
    const token = storage.get(STORAGE_KEYS.TOKEN);

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      storage.remove(STORAGE_KEYS.TOKEN);
      storage.remove(STORAGE_KEYS.USER);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;