"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Loader2, Search, Save } from "lucide-react";
import { onboardingExitService } from "@/services/hr-services/onboarding-exit.service";
import { toast } from "react-hot-toast";

export default function OnboardingSurveyTab() {
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    responses: {},
  });

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchSurvey();
    }
  }, [selectedEmployeeId]);

  const fetchSurvey = async () => {
    if (!selectedEmployeeId) return;
    try {
      setLoading(true);
      const response = await onboardingExitService.getOnboardingSurvey(selectedEmployeeId);
      const data = response.success ? response.data : response;
      setSurveyData(data);
      if (data.responses) {
        setFormData({ responses: data.responses });
      }
    } catch (error) {
      console.error("Error fetching survey:", error);
      // Don't show error if survey doesn't exist yet
      setSurveyData(null);
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
    if (!selectedEmployeeId) {
      toast.error("Please select an employee");
      return;
    }
    try {
      setSubmitting(true);
      await onboardingExitService.submitOnboardingSurvey(selectedEmployeeId, formData);
      toast.success("Survey submitted successfully");
      fetchSurvey();
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error(error.message || "Failed to submit survey");
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
              Select Employee
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employee by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Survey Form */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : selectedEmployeeId ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Onboarding Survey Form
            </h3>
            {surveyData?.submittedAt && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Submitted on: {new Date(surveyData.submittedAt).toLocaleString()}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                How was your onboarding experience?
              </label>
              <textarea
                value={formData.responses.question1 || formData.responses.answer1 || ""}
                onChange={(e) => handleInputChange("answer1", e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Share your onboarding experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rate the onboarding process (1-5)
              </label>
              <select
                value={formData.responses.rating || formData.responses.answer2 || ""}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
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
                Additional Feedback
              </label>
              <textarea
                value={formData.responses.feedback || ""}
                onChange={(e) => handleInputChange("feedback", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
                placeholder="Any additional feedback or suggestions..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={submitting || surveyData?.submittedAt}
                className="px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all shadow-sm hover:shadow-md font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {surveyData?.submittedAt ? "Already Submitted" : "Submit Survey"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Select an employee to view or submit their onboarding survey</p>
        </div>
      )}
    </div>
  );
}
