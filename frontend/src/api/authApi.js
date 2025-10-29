import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../utils/constants.js";

/**
 * Auth API Methods
 */
export const authApi = {
  // Signup
  signup: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.SIGNUP, userData);
    console.log("Signup API response:", response.data);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    console.log("Login API response:", response.data);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken,
    });
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email) => {
    const response = await axiosInstance.post(API_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  },

  // Reset Password
  resetPassword: async (passwordData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.RESET_PASSWORD,
      passwordData
    );
    return response.data;
  },
};
