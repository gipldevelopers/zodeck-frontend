import { apiClient } from '@/lib/api';

export const policyRuleService = {
    // ==========================================
    // POLICY & RULE ENGINE MODULE
    // ==========================================

    // 1. Create Policy
    // supports types: ATTENDANCE, LEAVE, PAYROLL, EXPENSE with their specific fields
    createPolicy: async (data) => {
        try {
            const response = await apiClient.post('/super-admin/policy-rules', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // 2. Update Policy
    updatePolicy: async (id, data) => {
        try {
            const response = await apiClient.put(`/super-admin/policy-rules/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // 3. List Policies (Filter by Type)
    // params: type, page, limit
    getPolicies: async (params = {}) => {
        try {
            const response = await apiClient.get('/super-admin/policy-rules', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // 4. Get Policy Details
    getPolicyById: async (id) => {
        try {
            const response = await apiClient.get(`/super-admin/policy-rules/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // 5. Assign Policy to Location(s)
    assignPolicy: async (data) => {
        try {
            const response = await apiClient.post('/super-admin/policy-rules/assign', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // 6. Delete Policy
    deletePolicy: async (id) => {
        try {
            const response = await apiClient.delete(`/super-admin/policy-rules/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
