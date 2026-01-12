"use client";

import { useState, useEffect } from "react";
import { Calendar, Loader2, Filter } from "lucide-react";
import { reportsAnalyticsService } from "@/services/hr-services/reports-analytics.service";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";

export default function AttendanceSummaryTab() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: "all",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAttendanceSummary();
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

  const fetchAttendanceSummary = async () => {
    try {
      setLoading(true);
      const params = {
        departmentId: filters.departmentId !== "all" ? filters.departmentId : "all",
      };
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await reportsAnalyticsService.getAttendanceSummaryReport(params);
      const data = response.success ? response.data : response;
      setReportData(data);
    } catch (error) {
      console.error("Error fetching attendance summary:", error);
      toast.error(error.message || "Failed to fetch attendance summary");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Overall Summary Cards */}
          {reportData.overallSummary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {reportData.overallSummary.totalEmployees || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Present</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {reportData.overallSummary.totalPresent || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Absent</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {reportData.overallSummary.totalAbsent || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {reportData.overallSummary.overallAttendanceRate ? `${reportData.overallSummary.overallAttendanceRate.toFixed(2)}%` : "0%"}
                </p>
              </div>
            </div>
          )}

          {/* Department Breakdown */}
          {reportData.byDepartment && reportData.byDepartment.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Department Breakdown</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Employees</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Present</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Absent</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reportData.byDepartment.map((dept, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{dept.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{dept.employees || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{dept.totalPresent || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{dept.totalAbsent || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {dept.averageAttendanceRate ? `${dept.averageAttendanceRate.toFixed(2)}%` : "0%"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Employee Summary */}
          {reportData.employeeSummary && reportData.employeeSummary.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Present</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Absent</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Late</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Attendance Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reportData.employeeSummary.map((item, index) => (
                      <tr key={item.employee?.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.employee?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.employee?.employeeId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.summary?.present || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.summary?.absent || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.summary?.late || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {item.summary?.attendanceRate ? `${item.summary.attendanceRate.toFixed(2)}%` : "0%"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No attendance data available</p>
        </div>
      )}
    </div>
  );
}
