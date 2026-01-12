// src/services/payroll-role-services/salary-structure.service.js
import { apiClient } from "@/lib/api";

export const payrollSalaryStructureService = {
  /* =========================
     SALARY STRUCTURES APIs
  ========================= */

  // Get All Salary Structures
  // Returns paginated list of salary structures with employee details
  // 
  // Query Parameters (optional):
  // - page: Integer (min: 1) - Page number (default: 1)
  // - limit: Integer (min: 1, max: 100) - Items per page (default: 10)
  // - status: String - Filter by status (e.g., "ACTIVE", "INACTIVE")
  getAllSalaryStructures: async (params = {}) => {
    try {
      const response = await apiClient.get("/payroll-compliance/salary-structure", {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          status: params.status,
        },
        timeout: 15000,
      });
      const data = response.data;

      if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch salary structures');
      }

      return data;
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        console.warn("Salary structures API timeout, returning empty array");
        return { 
          success: true, 
          data: { 
            salaryStructures: [], 
            pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } 
          } 
        };
      }
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch salary structures"
      );
    }
  },

  /* =========================
     SALARY STRUCTURE STATISTICS APIs
  ========================= */

  // Get Salary Structure Statistics
  // Returns statistics about salary structures:
  // - Total structures
  // - Active structures
  // - Employees with structures
  // - Average CTC, etc.
  getSalaryStructureStats: async () => {
    try {
      const response = await apiClient.get("/payroll-compliance/salary-structure/stats", {
        timeout: 15000,
      });
      const data = response.data;

      if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch salary structure statistics');
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch salary structure statistics"
      );
    }
  },

  /* =========================
     GET SALARY STRUCTURE BY ID APIs
  ========================= */

  // Get Salary Structure by ID
  // Returns detailed information about a specific salary structure including:
  // - Structure details (CTC, components, effective date)
  // - Employee information
  // - Salary components breakdown
  // 
  // Path Parameters:
  // - id: Integer - Salary structure ID
  getSalaryStructureById: async (id) => {
    try {
      const response = await apiClient.get(`/payroll-compliance/salary-structure/${id}`, {
        timeout: 15000,
      });
      const data = response.data;

      if (data.success === false) {
        throw new Error(data.message || 'Failed to fetch salary structure');
      }

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch salary structure"
      );
    }
  },
};
