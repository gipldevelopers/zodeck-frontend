import { apiClient } from '@/lib/api';

export const employeeHolidayService = {

    // get employee holidays
    getEmployeeHolidays: async (params = {}) => {
        try {
            const response = await apiClient.get('/holidays/get-all-holidays', { params });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch holidays';
            throw new Error(errorMessage);
        }
    }
};