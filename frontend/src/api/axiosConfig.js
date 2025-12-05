// api/axiosConfig.js
import axios from "axios";
import { API_BASE_URL } from "../utils/constants.js";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // This sends cookies
});

// Optional: log for debugging
axiosInstance.interceptors.request.use((config) => {
  console.log("Request to:", config.url);
  return config;
});

export default axiosInstance;
