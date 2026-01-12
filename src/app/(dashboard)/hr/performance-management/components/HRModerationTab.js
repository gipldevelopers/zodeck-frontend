"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Loader2, Filter, CheckCircle } from "lucide-react";
import { performanceManagementService } from "@/services/hr-services/performance-management.service";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";
import ModerateReviewModal from "./ModerateReviewModal";

export default function HRModerationTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    status: "PENDING_HR_MODERATION",
    cycleId: "all",
    departmentId: "all",
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [filters]);

  const fetchDepartments = async () => {
    try {
      const response = await organizationService.getAllDepartments({ limit: 100 });
      const deptData = response.success ? response.data?.departments || response.data : response.data || [];
      setDepartments(deptData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        status: filters.status !== "all" ? filters.status : "all",
        cycleId: filters.cycleId !== "all" ? filters.cycleId : "all",
        departmentId: filters.departmentId !== "all" ? filters.departmentId : "all",
      };
      const response = await performanceManagementService.getReviewsForModeration(params);
      const data = response.success ? response.data : response.data || [];
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(error.message || "Failed to fetch reviews for moderation");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = (review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchReviews();
    setIsModalOpen(false);
    setSelectedReview(null);
  };

  const getRatingBadge = (rating) => {
    const config = {
      EXCEEDS_EXPECTATIONS: { label: "Exceeds", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      MEETS_EXPECTATIONS: { label: "Meets", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
      NEEDS_IMPROVEMENT: { label: "Needs Improvement", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
      UNSATISFACTORY: { label: "Unsatisfactory", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    };
    const ratingConfig = config[rating] || config.MEETS_EXPECTATIONS;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${ratingConfig.className}`}>
        {ratingConfig.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const config = {
      PENDING_HR_MODERATION: { label: "Pending Moderation", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
      COMPLETED: { label: "Completed", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      PENDING_MANAGER_REVIEW: { label: "Pending Manager Review", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
    };
    const statusConfig = config[status] || config.PENDING_HR_MODERATION;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
        {statusConfig.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="PENDING_HR_MODERATION">Pending HR Moderation</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING_MANAGER_REVIEW">Pending Manager Review</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <select
              value={filters.departmentId}
              onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Manager Rating
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    HR Rating
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Cycle
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          src={review.employee?.profileImage || "/images/users/user-default.png"}
                          alt={review.employee?.name}
                          className="h-8 w-8 rounded-full object-cover mr-2"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {review.employee?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {review.employee?.employeeId} • {review.employee?.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {review.overallRating && getRatingBadge(review.overallRating)}
                    </td>
                    <td className="px-4 py-3">
                      {review.hrRating ? getRatingBadge(review.hrRating) : (
                        <span className="text-xs text-gray-400">Not moderated</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                      {review.cycle?.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(review.status)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleModerate(review)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Moderate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShieldCheck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No reviews found for moderation</p>
          </div>
        )}
      </div>

      {/* Moderate Review Modal */}
      {isModalOpen && selectedReview && (
        <ModerateReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedReview(null);
          }}
          review={selectedReview}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
