// src/services/designationService.js
import { apiClient } from '@/lib/api';

export const designationService = {
  // Get all designations
  getAllDesignations: async (params = {}) => {
    try {
      const response = await apiClient.get('/designations', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch designations';
      throw new Error(errorMessage);
    }
  },

  // Get designation by ID
  getDesignationById: async (id) => {
    try {
      const response = await apiClient.get(`/designations/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch designation';
      throw new Error(errorMessage);
    }
  },

  // Create new designation
  createDesignation: async (designationData) => {
    try {
      const response = await apiClient.post('/designations', designationData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create designation';
      throw new Error(errorMessage);
    }
  },

  // Update designation
  updateDesignation: async (id, designationData) => {
    try {
      const response = await apiClient.put(`/designations/${id}`, designationData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update designation';
      throw new Error(errorMessage);
    }
  },

  // Delete designation
  deleteDesignation: async (id) => {
    try {
      const response = await apiClient.delete(`/designations/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete designation';
      throw new Error(errorMessage);
    }
  }
};

export default designationService;