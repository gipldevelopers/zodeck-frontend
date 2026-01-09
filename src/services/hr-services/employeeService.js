// src/services/employeeService.js
import { apiClient } from '@/lib/api';

export const employeeService = {

  getManagers: async () => {
    try {
      const response = await apiClient.get('/employees/get-managers');
      return response.data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      throw error;
    }
  },
  // Create new employee
  createEmployee: async (employeeData) => {
    try {
      const response = await apiClient.post('/employees/create-employee', employeeData);
      return response.data;
    } catch (error) {
      console.error('Create employee error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to create employee';
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        console.error('Validation errors:', validationErrors);
      }
      throw new Error(errorMessage);
    }
  },

  // Get all employees
  getAllEmployees: async (params = {}) => {
    try {
      const response = await apiClient.get('/employees/get-employees', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch employees';
      throw new Error(errorMessage);
    }
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await apiClient.get(`/employees/view-employee/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch employee';
      throw new Error(errorMessage);
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await apiClient.put(`/employees/update-employee/${id}`, employeeData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update employee';
      throw new Error(errorMessage);
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await apiClient.delete(`/employees/delete-employee/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete employee';
      throw new Error(errorMessage);
    }
  },

  // Get next employee ID
  getNextEmployeeId: async () => {
    try {
      const response = await apiClient.get('/employees/next-id');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate employee ID';
      throw new Error(errorMessage);
    }
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    try {
      const response = await apiClient.get('/employees/stats');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch employee statistics';
      throw new Error(errorMessage);
    }
  },

  // Upload employee document
  uploadDocument: async (employeeId, formData) => {
    try {
      const response = await apiClient.post(`/employees/${employeeId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload document';
      throw new Error(errorMessage);
    }
  },

  // Get employee documents
  getDocuments: async (employeeId) => {
    try {
      const response = await apiClient.get(`/employees/get-documents/${employeeId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch documents';
      throw new Error(errorMessage);
    }
  },

  // Delete employee document
  deleteDocument: async (employeeId, docId) => {
    try {
      const response = await apiClient.delete(`/employees/${employeeId}/documents/${docId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete document';
      throw new Error(errorMessage);
    }
  },

  // Get departments for dropdown
  getDepartments: async () => {
    try {
      const response = await apiClient.get('/departments');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch departments';
      throw new Error(errorMessage);
    }
  },

  // Get designations for dropdown
  getDesignations: async () => {
    try {
      const response = await apiClient.get('/designations');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch designations';
      throw new Error(errorMessage);
    }
  },

  // Alias for getDocuments (for backward compatibility)
  getEmployeeDocuments: async (employeeId) => {
    return employeeService.getDocuments(employeeId);
  },

  // Upload multiple employee documents (aadhaar, pan, resume) with descriptions
  uploadEmployeeDocuments: async (employeeId, documentsData) => {
    try {
      const response = await apiClient.post(`/employees/upload-document/${employeeId}`, documentsData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Upload documents error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Failed to upload documents';
      throw new Error(errorMessage);
    }
  },
};

export default employeeService;