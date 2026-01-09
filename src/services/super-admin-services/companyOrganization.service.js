import { apiClient } from '@/lib/api';


export const companyOrganizationService = {
    // ==========================================
    // 1. COMPANY MANAGEMENT
    // ==========================================

    // Create Company
    createCompany: async (data) => {
        try {
            const response = await apiClient.post('/super-admin/companies', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get All Companies
    getAllCompanies: async () => {
        try {
            const response = await apiClient.get('/super-admin/companies');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Specific Company Profile
    getCompanyById: async (id) => {
        try {
            const response = await apiClient.get(`/super-admin/company/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update Specific Company Profile
    updateCompany: async (id, data) => {
        try {
            const response = await apiClient.patch(`/super-admin/company/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update Current Company Profile (Self)
    updateCurrentCompany: async (data) => {
        try {
            const response = await apiClient.patch('/super-admin/company', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete Company
    deleteCompany: async (id) => {
        try {
            const response = await apiClient.delete(`/super-admin/companies/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ==========================================
    // 2. LOCATION MANAGEMENT
    // ==========================================

    // Create Location
    createLocation: async (data) => {
        try {
            const response = await apiClient.post('/super-admin/locations', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // List Locations (Filter by companyId)
    getLocations: async (companyId) => {
        try {
            const url = companyId
                ? `/super-admin/locations?companyId=${companyId}`
                : '/super-admin/locations';
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update Location
    updateLocation: async (id, data) => {
        try {
            const response = await apiClient.patch(`/super-admin/locations/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete Location
    deleteLocation: async (id, companyId) => {
        try {
            const response = await apiClient.delete(`/super-admin/locations/${id}`, {
                data: { companyId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ==========================================
    // 3. DEPARTMENT MANAGEMENT
    // ==========================================

    // Create Department
    createDepartment: async (data) => {
        try {
            const response = await apiClient.post('/super-admin/departments', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // List Departments
    getDepartments: async (companyId) => {
        try {
            const url = companyId
                ? `/super-admin/departments?companyId=${companyId}`
                : '/super-admin/departments';
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update Department
    updateDepartment: async (id, data) => {
        try {
            const response = await apiClient.patch(`/super-admin/departments/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete Department
    deleteDepartment: async (id, companyId) => {
        try {
            const response = await apiClient.delete(`/super-admin/departments/${id}`, {
                data: { companyId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // ==========================================
    // 4. DESIGNATION MANAGEMENT
    // ==========================================

    // Create Designation
    createDesignation: async (data) => {
        try {
            const response = await apiClient.post('/super-admin/designations', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // List Designations
    getDesignations: async (companyId) => {
        try {
            const url = companyId
                ? `/super-admin/designations?companyId=${companyId}`
                : '/super-admin/designations';
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update Designation
    updateDesignation: async (id, data) => {
        try {
            const response = await apiClient.patch(`/super-admin/designations/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete Designation
    deleteDesignation: async (id, companyId) => {
        try {
            const response = await apiClient.delete(`/super-admin/designations/${id}`, {
                data: { companyId }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
