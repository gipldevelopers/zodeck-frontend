// src/services/userManagementService.js
import { apiClient } from '@/lib/api';

export const userManagementService = {
  // Get all users with pagination and filters
  getAllUsers: async (params = {}) => {
    try {
      const response = await apiClient.get('/users/get-all-users', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      throw new Error(errorMessage);
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await apiClient.get(`/users/get-user-by-id/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user';
      throw new Error(errorMessage);
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/users/create-user', userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      throw new Error(errorMessage);
    }
  },

  // Update user
  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/users/update-user/${id}`, userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      throw new Error(errorMessage);
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/users/delete-user/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      throw new Error(errorMessage);
    }
  },

  getAvailableRoles: async () => {
    try {
      const response = await apiClient.get('/rbac/roles', {
        params: { limit: 100, type: 'custom' }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch roles';
      throw new Error(errorMessage);
    }
  },

  getSystemRoles: async () => {
    try {
      const response = await apiClient.get('/users/roles/system');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch system roles';
      throw new Error(errorMessage);
    }
  },

  getCompanyRoles: async () => {
    try {
      const response = await apiClient.get('/users/roles/company');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch company roles';
      throw new Error(errorMessage);
    }
  },

  assignRoleToUser: async (userId, roleData) => {
    try {
      const response = await apiClient.post(`/users/assign-role/${userId}`, roleData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to assign role';
      throw new Error(errorMessage);
    }
  },

  removeRoleFromUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/remove-role/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove role';
      throw new Error(errorMessage);
    }
  },

  // Change user status (activate/deactivate)
  changeUserStatus: async (userId, status) => {
    try {
      const response = await apiClient.patch(`/users/change-user-status/${userId}`, { status });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change user status';
      throw new Error(errorMessage);
    }
  },

  // Reset user password
  resetUserPassword: async (userId) => {
    try {
      const response = await apiClient.post(`/users/reset-password/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      throw new Error(errorMessage);
    }
  },

  // Get user activity/logs
  getUserActivity: async (userId) => {
    try {
      const response = await apiClient.get(`/users/get-user-activity/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch user activity';
      throw new Error(errorMessage);
    }
  }
};

export default userManagementService;