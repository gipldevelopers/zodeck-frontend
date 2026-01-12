"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Loader2, Search, Save } from "lucide-react";
import { onboardingExitService } from "@/services/hr-services/onboarding-exit.service";
import { toast } from "react-hot-toast";

export default function ExitInterviewTab() {
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedResignationId, setSelectedResignationId] = useState("");
  const [formData, setFormData] = useState({
    responses: {},
  });

  useEffect(() => {
    if (selectedResignationId) {
      fetchInterview();
    }
  }, [selectedResignationId]);

  const fetchInterview = async () => {
    if (!selectedResignationId) return;
    try {
      setLoading(true);
      const response = await onboardingExitService.getExitInterview(selectedResignationId);
      const data = response.success ? response.data : response;
      setInterviewData(data);
      if (data.responses) {
        setFormData({ responses: data.responses });
      }
    } catch (error) {
      console.error("Error fetching exit interview:", error);
      // Don't show error if interview doesn't exist yet
      setInterviewData(null);
      setFormData({ responses: {} });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      responses: {
        ...prev.responses,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedResignationId) {
      toast.error("Please enter a resignation ID");
      return;
    }
    try {
      setSubmitting(true);
      await onboardingExitService.submitExitInterview(selectedResignationId, formData);
      toast.success("Exit interview submitted successfully");
      fetchInterview();
    } catch (error) {
      console.error("Error submitting exit interview:", error);
      toast.error(error.message || "Failed to submit exit interview");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Resignation ID
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter resignation ID..."
                value={selectedResignationId}
                onChange={(e) => setSelectedResignationId(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exit Interview Form */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : selectedResignationId ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Exit Interview Survey
            </h3>
            {interviewData?.submittedAt && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Submitted on: {new Date(interviewData.submittedAt).toLocaleString()}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Why are you leaving?
              </label>
              <textarea
                value={formData.responses.answer1 || formData.responses.question1 || ""}
                onChange={(e) => handleInputChange("answer1", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Share your reason for leaving..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rate your overall experience (1-5)
              </label>
              <select
                value={formData.responses.answer2 || formData.responses.rating || ""}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What could we improve?
              </label>
              <textarea
                value={formData.responses.answer3 || ""}
                onChange={(e) => handleInputChange("answer3", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Share suggestions for improvement..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Feedback
              </label>
              <textarea
                value={formData.responses.feedback || ""}
                onChange={(e) => handleInputChange("feedback", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Any additional feedback..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={submitting || interviewData?.submittedAt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {interviewData?.submittedAt ? "Already Submitted" : "Submit Interview"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Enter a resignation ID to view or submit the exit interview</p>
        </div>
      )}
    </div>
  );
}
