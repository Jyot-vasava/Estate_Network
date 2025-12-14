import axios from "axios";
import { API_BASE_URL } from "../utils/constants.js";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Response interceptor - for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.status);
    return response.data; // Return only the data portion
  },
  (error) => {
    console.error(
      "[API Response Error]",
      error.response?.data || error.message
    );

    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Unauthorized - could trigger logout or token refresh
        console.warn("Unauthorized request - consider refreshing token");
      }

      // Return the error data structure
      return Promise.reject({
        response: {
          data: {
            message: data?.message || "An error occurred",
            errors: data?.errors || [],
          },
        },
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        response: {
          data: {
            message: "No response from server. Please check your connection.",
          },
        },
      });
    } else {
      // Something else happened
      return Promise.reject({
        response: {
          data: {
            message: error.message || "An unexpected error occurred",
          },
        },
      });
    }
  }
);

export default axiosInstance;
