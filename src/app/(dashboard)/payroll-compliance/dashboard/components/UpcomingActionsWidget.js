"use client";

import { useState, useEffect } from "react";
import { Calendar, Bell, FileText, Loader2 } from "lucide-react";
import { payrollDashboardService } from "@/services/payroll-role-services/dashboard.service";

export default function UpcomingActionsWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const response = await payrollDashboardService.getDashboard({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        });
        // Handle response structure: response.data or response directly
        const dashboardData = response.data || response;
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching upcoming actions:", error);
        // Set empty data on error so UI doesn't break
        setData({
          payrollRunDueDate: null,
          filingReminders: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      const diffTime = date - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  };

  const payrollRunDueDate = data?.payrollRunDueDate || null;
  const filingReminders = data?.filingReminders || [];

  const upcomingActions = [
    {
      type: "payrollRun",
      title: "Payroll Run Due Date",
      date: payrollRunDueDate,
      icon: <Calendar className="w-5 h-5" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    ...filingReminders.map((reminder) => ({
      type: "filing",
      title: reminder.title || "Statutory Filing",
      date: reminder.dueDate,
      description: reminder.type || reminder.description,
      icon: <FileText className="w-5 h-5" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    })),
  ];

  const getUrgencyColor = (days) => {
    if (days === null || days === undefined) return "";
    if (days < 0) return "text-red-600 dark:text-red-400";
    if (days <= 3) return "text-orange-600 dark:text-orange-400";
    if (days <= 7) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getUrgencyBadge = (days) => {
    if (days === null || days === undefined) return null;
    if (days < 0)
      return (
        <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold">
          Overdue
        </span>
      );
    if (days <= 3)
      return (
        <span className="px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-semibold">
          Urgent
        </span>
      );
    if (days <= 7)
      return (
        <span className="px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold">
          Soon
        </span>
      );
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Upcoming Actions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Reminders & deadlines</p>
        </div>
      </div>

      <div className="space-y-3">
        {upcomingActions.length > 0 ? (
          upcomingActions.map((action, index) => {
            const daysUntil = getDaysUntil(action.date);
            const urgencyColor = getUrgencyColor(daysUntil);
            const urgencyBadge = getUrgencyBadge(daysUntil);

            return (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 ${action.borderColor} ${action.bgColor} transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${action.color} bg-white dark:bg-gray-800 mt-0.5`}
                    >
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {action.title}
                      </p>
                      {action.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {action.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Due:</span>
                        <span
                          className={`text-xs font-semibold ${urgencyColor || "text-gray-600 dark:text-gray-400"}`}
                        >
                          {formatDate(action.date)}
                        </span>
                        {daysUntil !== null && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({daysUntil < 0
                              ? `${Math.abs(daysUntil)} days ago`
                              : daysUntil === 0
                              ? "Today"
                              : `${daysUntil} day${daysUntil > 1 ? "s" : ""} left`}
                            )
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {urgencyBadge && <div className="flex-shrink-0">{urgencyBadge}</div>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No upcoming actions scheduled
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
