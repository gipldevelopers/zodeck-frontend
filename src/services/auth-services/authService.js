// src/services/authService.js
import { apiClient } from '@/lib/api';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);

      // Store company ID and subdomain for future requests
      if (response.data.success) {
        localStorage.setItem('company_id', response.data.data.user.company.id);
        localStorage.setItem('company_subdomain', response.data.data.user.company.subdomain);
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  // Get company by subdomain (NEW)
  getCompanyBySubdomain: async (subdomain) => {
    try {
      const response = await apiClient.get(`/auth/company/${subdomain}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Company not found');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch user');
    }
  },

  // Change password
  changePassword: async (passwords) => {
    try {
      const response = await apiClient.post('/auth/change-password', passwords);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Password change failed');
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Logout failed');
    }
  },

  // Verify company by subdomain
  verifyCompany: async (subdomain) => {
    try {
      const response = await apiClient.get(`/auth/company/${subdomain}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Company verification failed');
    }
  },

  getUserPermissions: async () => {
    try {
      const response = await apiClient.get('/auth/me/permissions');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch permissions');
    }
  },
};