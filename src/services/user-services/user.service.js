// src/services/userService.js
import { apiClient } from '@/lib/api';

export const userService = {
    // Get current user profile
    getProfile: async () => {
        try {
            const response = await apiClient.get('/users/get-profile');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
            throw new Error(errorMessage);
        }
    },

    // Update current user profile
    updateProfile: async (updateData) => {
        try {
            const response = await apiClient.put('/users/update-profile', updateData);
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            throw new Error(errorMessage);
        }
    },
};

export default userService;