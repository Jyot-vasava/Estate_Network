import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user.accessToken || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🔐 Request config:", {
      url: config.url,
      method: config.method,
      hasToken: !!token,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url,
    });

    // Handle 401 errors globally
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const contactApi = {
  // Get all contacts (admin only)
  getAllContacts: async () => {
    const response = await apiClient.get("/contacts");
    return response.data;
  },

  // Create contact (public)
  createContact: async (contactData) => {
    const response = await apiClient.post("/contacts", contactData);
    return response.data;
  },

  // Delete contact (admin only)
  deleteContact: async (id) => {
    const response = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  },

  // Get single contact (admin only)
  getContactById: async (id) => {
    const response = await apiClient.get(`/contacts/${id}`);
    return response.data;
  },
};
