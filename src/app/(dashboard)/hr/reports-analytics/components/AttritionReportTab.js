"use client";

import { useState, useEffect } from "react";
import { TrendingDown, Loader2, Filter } from "lucide-react";
import { reportsAnalyticsService } from "@/services/hr-services/reports-analytics.service";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";
import CustomDropdown from "../../leave/components/CustomDropdown";

export default function AttritionReportTab() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: "all",
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAttritionReport();
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

  const fetchAttritionReport = async () => {
    try {
      setLoading(true);
      const params = {
        departmentId: filters.departmentId !== "all" ? filters.departmentId : "all",
      };
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await reportsAnalyticsService.getAttritionReport(params);
      const data = response.success ? response.data : response;
      setReportData(data);
    } catch (error) {
      console.error("Error fetching attrition report:", error);
      toast.error(error.message || "Failed to fetch attrition report");
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
          {/* Summary Cards */}
          {reportData.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total at Start</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {reportData.summary.totalAtStart || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">New Joiners</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {reportData.summary.newJoiners || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Exits</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                  {reportData.summary.exits || 0}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">Attrition Rate</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {reportData.summary.attritionRate ? `${reportData.summary.attritionRate.toFixed(2)}%` : "0%"}
                </p>
              </div>
            </div>
          )}

          {/* By Reason */}
          {reportData.byReason && reportData.byReason.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exits by Reason</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Reason</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reportData.byReason.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.reason}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Exited Employees */}
          {reportData.employees && reportData.employees.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exited Employees</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Department</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Designation</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Exit Date</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {reportData.employees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{employee.employeeId}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{employee.department || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{employee.designation || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                          {employee.exitDate ? new Date(employee.exitDate).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            {employee.status || "-"}
                          </span>
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
          <TrendingDown className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No attrition data available</p>
        </div>
      )}
    </div>
  );
}
