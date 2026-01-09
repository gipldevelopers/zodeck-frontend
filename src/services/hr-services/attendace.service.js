// src/services/attendanceService.js
import { apiClient } from '@/lib/api';

export const attendanceService = {
  // Get dashboard statistics
  getDashboardStats: async (params = {}) => {
    try {
      const response = await apiClient.get('/attendance/get-dashboard-stats', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard statistics';
      throw new Error(errorMessage);
    }
  },

  // Get attendance records with filters
  getAttendanceRecords: async (params = {}) => {
    try {
      const response = await apiClient.get('/attendance/get-attendance-records', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch attendance records';
      throw new Error(errorMessage);
    }
  },

  // Get attendance by ID
  getAttendanceById: async (id) => {
    try {
      const response = await apiClient.get(`/attendance/get-attendance/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch attendance record';
      throw new Error(errorMessage);
    }
  },

  // Create attendance record
  createAttendance: async (data) => {
    try {
      const response = await apiClient.post('/attendance/create-attendance', data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create attendance record';
      throw new Error(errorMessage);
    }
  },

  // Update attendance record
  updateAttendance: async (id, data) => {
    try {
      const response = await apiClient.put(`/attendance/update-attendance/${id}`, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update attendance record';
      throw new Error(errorMessage);
    }
  },

  // Delete attendance record
  deleteAttendance: async (id) => {
    try {
      const response = await apiClient.delete(`/attendance/delete-attendance/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete attendance record';
      throw new Error(errorMessage);
    }
  },

  // Bulk create attendance records
  bulkCreateAttendance: async (records) => {
    try {
      const response = await apiClient.post('/attendance/bulk-create-attendance', { records });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to bulk create attendance records';
      throw new Error(errorMessage);
    }
  },

  // Get filter options
  getFilterOptions: async () => {
    try {
      const response = await apiClient.get('/attendance/get-filter-options');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch filter options';
      throw new Error(errorMessage);
    }
  },

  // Get employee attendance
  getEmployeeAttendance: async (employeeId, params = {}) => {
    try {
      const response = await apiClient.get(`/attendance/get-employee-attendance/${employeeId}`, { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch employee attendance';
      throw new Error(errorMessage);
    }
  },

  // Regularize attendance
  regularizeAttendance: async (id, notes) => {
    try {
      const response = await apiClient.put(`/attendance/regularize-attendance/${id}`, { notes });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to regularize attendance';
      throw new Error(errorMessage);
    }
  },

  // Get attendance summary report
  getAttendanceSummary: async (params = {}) => {
    try {
      const response = await apiClient.get('/attendance/get-attendance-summary', { params });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch attendance summary';
      throw new Error(errorMessage);
    }
  },

  // Get today's attendance
  getTodayAttendance: async (params = {}) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apiClient.get('/attendance/get-attendance-records', {
        params: {
          startDate: today,
          endDate: today,
          limit: 100,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch today\'s attendance';
      throw new Error(errorMessage);
    }
  },

  // Get attendance by date range
  getAttendanceByDateRange: async (startDate, endDate, params = {}) => {
    try {
      const response = await apiClient.get('/attendance/get-attendance-records', {
        params: {
          startDate,
          endDate,
          limit: 100,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch attendance by date range';
      throw new Error(errorMessage);
    }
  }
};

export default attendanceService;