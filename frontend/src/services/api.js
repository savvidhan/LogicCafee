import axios from "axios";
import { getToken } from "./auth.service";

/**
 * Central Axios instance
 * VITE_API_URL must be set to: http://localhost:5000/api
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Prevent stale cached responses
    config.headers["Cache-Control"] = "no-cache";
    config.headers["Pragma"] = "no-cache";
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
