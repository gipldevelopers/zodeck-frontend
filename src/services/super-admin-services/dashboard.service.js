import { apiClient } from '@/lib/api';

export const dashboardService = {
    // Get Full Dashboard Stats
    // Returns counts for Companies, Users, Config Status, Workflows, Integrations, and Recent Logs.
    getDashboardStats: async () => {
        try {
            const response = await apiClient.get('/super-admin/dashboard/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Recent Activities Only
    // Returns the last 10 audit log entries.
    getRecentActivities: async () => {
        try {
            const response = await apiClient.get('/super-admin/dashboard/recent-activities');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
