import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../utils/constants.js";

/**
 * Contact API Methods
 */
export const contactApi = {
  // Create contact (send message)
  createContact: async (contactData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CONTACTS,
      contactData
    );
    return response.data;
  },

  // Get all contacts (admin only)
  getAllContacts: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.CONTACTS);
    return response.data;
  },

  // Get contact by ID (admin only)
  getContactById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.CONTACT_BY_ID(id));
    return response.data;
  },

  // Delete contact (admin only)
  deleteContact: async (id) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.CONTACT_BY_ID(id)
    );
    return response.data;
  },

  // Contact property owner
  contactOwner: async (ownerData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CONTACT_OWNER,
      ownerData
    );
    return response.data;
  },
};
