// api/authApi.js
import axiosInstance from "./axiosConfig.js";

export const authApi = {
  signup: (data) => axiosInstance.post("/users/signup", data),
  login: (data) => axiosInstance.post("/users/login", data),
  logout: () => axiosInstance.post("/users/logout"),
  checkAuth: () => axiosInstance.get("/users/me"),
};
