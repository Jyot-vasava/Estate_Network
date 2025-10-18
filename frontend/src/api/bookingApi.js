import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../utils/constants.js";

/**
 * Booking API Methods
 */
export const bookingApi = {
  // Process payment
  processPayment: async (paymentData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.PROCESS_PAYMENT,
      paymentData
    );
    return response.data;
  },

  // Send confirmation email
  sendConfirmationEmail: async (emailData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.SEND_CONFIRMATION,
      emailData
    );
    return response.data;
  },
};
