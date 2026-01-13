"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Loader2, Filter } from "lucide-react";
import { reportsAnalyticsService } from "@/services/hr-services/reports-analytics.service";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";
import CustomDropdown from "../../leave/components/CustomDropdown";

export default function LeaveUtilizationTab() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: "all",
    leaveTypeId: "all",
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchLeaveUtilization();
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

  const fetchLeaveUtilization = async () => {
    try {
      setLoading(true);
      const params = {
        departmentId: filters.departmentId !== "all" ? filters.departmentId : "all",
        leaveTypeId: filters.leaveTypeId !== "all" ? filters.leaveTypeId : "all",
      };
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await reportsAnalyticsService.getLeaveUtilizationReport(params);
      const data = response.success ? response.data : response;
      setReportData(data);
    } catch (error) {
      console.error("Error fetching leave utilization:", error);
      toast.error(error.message || "Failed to fetch leave utilization report");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <CustomDropdown
              value={filters.departmentId}
              onChange={(value) => setFilters({ ...filters, departmentId: value })}
              options={[
                { value: 'all', label: 'All Departments' },
                ...departments.map(dept => ({ value: dept.id, label: dept.name }))
              ]}
              placeholder="All Departments"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Leave Type
            </label>
            <CustomDropdown
              value={filters.leaveTypeId}
              onChange={(value) => setFilters({ ...filters, leaveTypeId: value })}
              options={[{ value: 'all', label: 'All Leave Types' }]}
              placeholder="All Leave Types"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
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
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Allocated</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-1">
                  {reportData.overallSummary.totalLeavesAllocated || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Used</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {reportData.overallSummary.totalDaysUsed || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Utilization Rate</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                  {reportData.overallSummary.overallUtilizationRate ? `${reportData.overallSummary.overallUtilizationRate.toFixed(2)}%` : "0%"}
                </p>
              </div>
            </div>
          )}

          {/* By Leave Type */}
          {reportData.byLeaveType && reportData.byLeaveType.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">By Leave Type</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Leave Type</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total Days</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total Requests</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Employees</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reportData.byLeaveType.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.leaveType}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.totalDays || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.totalRequests || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.employeesCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* By Department */}
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total Allocated</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total Used</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Utilization Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reportData.byDepartment.map((dept, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{dept.department}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{dept.employees || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{dept.totalAllocated || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{dept.totalUsed || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {dept.utilizationRate ? `${dept.utilizationRate.toFixed(2)}%` : "0%"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Employee Utilization */}
          {reportData.employeeUtilization && reportData.employeeUtilization.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Utilization</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Allocated</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Used</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Remaining</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Utilization Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reportData.employeeUtilization.map((item, index) => (
                      <tr key={item.employee?.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.employee?.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.employee?.employeeId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.summary?.totalLeavesAllocated || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.summary?.totalDaysUsed || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.summary?.totalDaysRemaining || 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {item.summary?.utilizationRate ? `${item.summary.utilizationRate.toFixed(2)}%` : "0%"}
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
          <CalendarDays className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No leave utilization data available</p>
        </div>
      )}
    </div>
  );
}
