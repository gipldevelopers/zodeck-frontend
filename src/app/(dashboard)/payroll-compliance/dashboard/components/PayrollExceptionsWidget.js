"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Calendar, UserCheck, Pause, Loader2, ExternalLink, CheckCircle2 } from "lucide-react";
import { payrollDashboardService } from "@/services/payroll-role-services/dashboard.service";
import Link from "next/link";

export default function PayrollExceptionsWidget() {
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
        console.error("Error fetching payroll exceptions:", error);
        // Set empty data on error so UI doesn't break
        setData({
          missingAttendance: 0,
          missingSalaryStructure: 0,
          onHoldEmployees: 0,
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

  const exceptions = [
    {
      type: "missingAttendance",
      label: "Missing Attendance",
      count: data?.missingAttendance || 0,
      icon: <Calendar className="w-5 h-5" />,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
    {
      type: "missingSalaryStructure",
      label: "Missing Salary Structure",
      count: data?.missingSalaryStructure || 0,
      icon: <UserCheck className="w-5 h-5" />,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
    },
    {
      type: "onHoldEmployees",
      label: "On-Hold Employees",
      count: data?.onHoldEmployees || 0,
      icon: <Pause className="w-5 h-5" />,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
  ];

  const totalExceptions = exceptions.reduce((sum, ex) => sum + ex.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Payroll Exceptions</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Requires attention</p>
        </div>
        {totalExceptions > 0 && (
          <div className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold">
            {totalExceptions}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {exceptions.map((exception) => (
          <div
            key={exception.type}
            className={`p-4 rounded-xl border-2 ${exception.borderColor} ${exception.bgColor} transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${exception.color} bg-white dark:bg-gray-800`}>
                  {exception.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {exception.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {exception.count === 0
                      ? "No issues"
                      : `${exception.count} employee${exception.count > 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
              {exception.count > 0 && (
                <div className={`px-3 py-1 rounded-full ${exception.color} ${exception.bgColor} text-sm font-bold`}>
                  {exception.count}
                </div>
              )}
            </div>
          </div>
        ))}

        {totalExceptions === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">All clear! No exceptions found.</p>
          </div>
        )}

        {totalExceptions > 0 && (
          <Link
            href="/hr/payroll/process"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium text-sm"
          >
            <span>Review Exceptions</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
