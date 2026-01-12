// src/services/hr-services/performance-management.service.js
import { apiClient } from "@/lib/api";

export const performanceManagementService = {
  /* =========================
     APPRAISAL CYCLE CONFIGURATION
  ========================= */

  // Create Appraisal Cycle
  createAppraisalCycle: async (data) => {
    try {
      const response = await apiClient.post("/performance/cycles", data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to create appraisal cycle"
      );
    }
  },

  // Get Appraisal Cycles
  getAppraisalCycles: async (params = {}) => {
    try {
      const response = await apiClient.get("/performance/cycles", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch appraisal cycles"
      );
    }
  },

  // Update Appraisal Cycle
  updateAppraisalCycle: async (cycleId, data) => {
    try {
      const response = await apiClient.put(`/performance/cycles/${cycleId}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to update appraisal cycle"
      );
    }
  },

  /* =========================
     GOAL COMPLETION MONITORING
  ========================= */

  // Get Goal Completion Overview
  getGoalCompletionOverview: async (params = {}) => {
    try {
      const response = await apiClient.get("/performance/goals/overview", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch goal completion overview"
      );
    }
  },

  // Update Goal Progress
  updateGoalProgress: async (goalId, data) => {
    try {
      const response = await apiClient.put(`/performance/goals/${goalId}/progress`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to update goal progress"
      );
    }
  },

  /* =========================
     MANAGER FEEDBACK VIEW
  ========================= */

  // Get Manager Feedback
  getManagerFeedback: async (params = {}) => {
    try {
      const response = await apiClient.get("/performance/feedback", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch manager feedback"
      );
    }
  },

  /* =========================
     HR RATING MODERATION
  ========================= */

  // Get Reviews for HR Moderation
  getReviewsForModeration: async (params = {}) => {
    try {
      const response = await apiClient.get("/performance/reviews/moderation", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch reviews for moderation"
      );
    }
  },

  // Moderate Review Rating
  moderateReviewRating: async (reviewId, data) => {
    try {
      const response = await apiClient.put(`/performance/reviews/${reviewId}/moderate`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to moderate review rating"
      );
    }
  },

  /* =========================
     PERFORMANCE DASHBOARD
  ========================= */

  // Get Performance Dashboard
  getPerformanceDashboard: async (params = {}) => {
    try {
      const response = await apiClient.get("/performance/dashboard", { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch performance dashboard"
      );
    }
  },
};
