"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, XCircle, Users, TrendingUp, Loader2 } from "lucide-react";
import { payrollDashboardService } from "@/services/payroll-role-services/dashboard.service";

export default function PayrollStatusWidget() {
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
        console.error("Error fetching payroll status:", error);
        // Set empty data on error so UI doesn't break
        setData({
          payrollStatus: "NOT_STARTED",
          employeesProcessed: 0,
          totalEmployees: 0,
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

  const status = data?.payrollStatus || "NOT_STARTED";
  const processedCount = data?.employeesProcessed || 0;
  const totalEmployees = data?.totalEmployees || 0;
  const progressPercentage = totalEmployees > 0 ? (processedCount / totalEmployees) * 100 : 0;

  const getStatusConfig = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Completed",
          icon: <CheckCircle2 className="w-6 h-6" />,
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-600 dark:text-green-400",
          borderColor: "border-green-200 dark:border-green-800",
          progressColor: "bg-gradient-to-r from-green-500 to-green-600",
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: <Clock className="w-6 h-6" />,
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-600 dark:text-blue-400",
          borderColor: "border-blue-200 dark:border-blue-800",
          progressColor: "bg-gradient-to-r from-blue-500 to-blue-600",
        };
      default:
        return {
          label: "Not Started",
          icon: <XCircle className="w-6 h-6" />,
          bgColor: "bg-gray-100 dark:bg-gray-700",
          textColor: "text-gray-600 dark:text-gray-400",
          borderColor: "border-gray-200 dark:border-gray-600",
          progressColor: "bg-gradient-to-r from-gray-400 to-gray-500",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-xl ${statusConfig.bgColor} ${statusConfig.textColor}`}>
          {statusConfig.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Payroll Status</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Month</p>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mb-6 p-4 rounded-xl border-2 ${statusConfig.borderColor} ${statusConfig.bgColor}`}>
        <div className="flex items-center justify-between">
          <span className={`text-lg font-semibold ${statusConfig.textColor}`}>
            {statusConfig.label}
          </span>
          <div className={`p-2 rounded-lg ${statusConfig.textColor}`}>
            {statusConfig.icon}
          </div>
        </div>
      </div>

      {/* Employees Processed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Employees Processed</span>
          <span className="font-semibold text-gray-800 dark:text-white">
            {processedCount} / {totalEmployees}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${statusConfig.progressColor}`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>{progressPercentage.toFixed(1)}% Complete</span>
        </div>
      </div>
    </div>
  );
}
