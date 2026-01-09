// src/services/employeeLeaveService.js
import { apiClient } from '@/lib/api';

class EmployeeLeaveService {
    // Get employee leave balance
    static async getLeaveBalance() {
        try {
            const response = await apiClient.get('/employee-leave/get-leave-balance');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch leave balance');
        }
    }

    // Get employee leave history
    static async getLeaveHistory(params = {}) {
        try {
            const response = await apiClient.get('/employee-leave/get-leave-history', { params });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch leave history');
        }
    }

    // Request new leave
    static async requestLeave(data) {
        try {
            const response = await apiClient.post('/employee-leave/request-leave', data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to submit leave request');
        }
    }

    // Cancel leave request
    static async cancelLeave(id) {
        try {
            const response = await apiClient.delete(`/employee-leave/cancel-leave/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to cancel leave request');
        }
    }

    // Get single leave request
    static async getLeaveRequest(id) {
        try {
            const response = await apiClient.get(`/employee-leave/get-leave-request/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch leave request');
        }
    }

    // Get available leave types
    static async getLeaveTypes() {
        try {
            const response = await apiClient.get('/employee-leave/get-leave-types');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch leave types');
        }
    }

    // Get dashboard statistics
    static async getDashboardStats() {
        try {
            const response = await apiClient.get('/employee-leave/get-dashboard-stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    }

    // Check leave availability
    static async checkLeaveAvailability(fromDate, toDate, leaveTypeId) {
        try {
            const balance = await this.getLeaveBalance();
            const leaveType = balance.leaveTypes.find(lt => lt.id === leaveTypeId);

            if (!leaveType) {
                return { available: false, message: 'Leave type not found' };
            }

            // Calculate days
            const start = new Date(fromDate);
            const end = new Date(toDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            // Remove weekends
            let workingDays = 0;
            const currentDate = new Date(start);
            while (currentDate <= end) {
                const dayOfWeek = currentDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    workingDays++;
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }

            if (leaveType.remaining < workingDays) {
                return {
                    available: false,
                    message: `Insufficient balance. Available: ${leaveType.remaining} days, Required: ${workingDays} days`
                };
            }

            return {
                available: true,
                message: 'Leave available',
                days: workingDays
            };
        } catch (error) {
            console.error('Error checking leave availability:', error);
            return { available: false, message: 'Error checking availability' };
        }
    }
}

export default EmployeeLeaveService;