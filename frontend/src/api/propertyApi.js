import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../utils/constants.js";

/**
 * Property API Methods
 */
export const propertyApi = {
  // Get all properties
  getAllProperties: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROPERTIES, {
      params,
    });
    return response.data;
  },

  // Get property by ID
  getPropertyById: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROPERTY_BY_ID(id));
    return response.data;
  },

  // Create property
  createProperty: async (formData) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.CREATE_PROPERTY,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Update property
  updateProperty: async (id, formData) => {
    const response = await axiosInstance.put(
      API_ENDPOINTS.UPDATE_PROPERTY(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Delete property
  deleteProperty: async (id) => {
    const response = await axiosInstance.delete(
      API_ENDPOINTS.DELETE_PROPERTY(id)
    );
    return response.data;
  },
};
