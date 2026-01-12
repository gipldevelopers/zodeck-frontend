"use client";

import { useState, useEffect } from "react";
import { GitBranch, Building, Users, Briefcase, ChevronDown, ChevronRight } from "lucide-react";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";

export default function OrgChartTab() {
  const [orgChart, setOrgChart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());

  useEffect(() => {
    const fetchOrgChart = async () => {
      try {
        setLoading(true);
        const response = await organizationService.getOrgChart();
        const chart = response.success ? response.data : response;
        setOrgChart(chart);
        // Auto-expand all top-level departments
        if (chart?.departments) {
          setExpandedDepartments(
            new Set(chart.departments.filter((d) => !d.parentId).map((d) => d.id.toString()))
          );
        }
      } catch (error) {
        console.error("Error fetching org chart:", error);
        toast.error("Failed to load organization chart");
      } finally {
        setLoading(false);
      }
    };

    fetchOrgChart();
  }, []);

  const toggleDepartment = (deptId) => {
    setExpandedDepartments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(deptId.toString())) {
        newSet.delete(deptId.toString());
      } else {
        newSet.add(deptId.toString());
      }
      return newSet;
    });
  };

  const renderDepartment = (department, level = 0) => {
    const isExpanded = expandedDepartments.has(department.id.toString());
    const hasChildren = department.children && department.children.length > 0;

    return (
      <div key={department.id} className="mb-4">
        <div
          className={`p-4 rounded-lg border ${
            level === 0
              ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          } hover:shadow-lg transition-shadow`}
          style={{ marginLeft: `${level * 32}px` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {department.name}
                  </h4>
                  {department.code && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Code: {department.code}
                    </p>
                  )}
                </div>
              </div>

              {department.manager && (
                <div className="ml-8 mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Manager: {department.manager.name || `${department.manager.firstName} ${department.manager.lastName}`}
                    </span>
                  </div>
                </div>
              )}

              {department.designations && department.designations.length > 0 && (
                <div className="ml-8 space-y-3 mt-3">
                  {department.designations.map((designation) => (
                    <div
                      key={designation.id}
                      className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {designation.name}
                          </span>
                          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                            {designation.code || designation.level}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {designation.employeeCount || 0} employees
                        </span>
                      </div>

                      {designation.employees && designation.employees.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {designation.employees.slice(0, 5).map((emp) => (
                            <div
                              key={emp.id}
                              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 ml-6"
                            >
                              <Users className="w-3 h-3" />
                              <span>
                                {emp.name || `${emp.firstName} ${emp.lastName}`} ({emp.employeeId})
                              </span>
                              {emp.reportsTo && (
                                <span className="text-xs text-gray-500">
                                  → {emp.reportsTo.name || `${emp.reportsTo.firstName} ${emp.reportsTo.lastName}`}
                                </span>
                              )}
                            </div>
                          ))}
                          {designation.employees.length > 5 && (
                            <p className="text-xs text-gray-500 ml-6">
                              +{designation.employees.length - 5} more employees
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="ml-8 mt-2 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Employees: {department.totalEmployees || 0}</span>
                <span>Designations: {department.totalDesignations || 0}</span>
              </div>
            </div>

            {hasChildren && (
              <button
                onClick={() => toggleDepartment(department.id)}
                className="ml-4 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {department.children.map((child) => renderDepartment(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orgChart) {
    return (
      <div className="text-center py-12">
        <GitBranch className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No organization chart data available</p>
      </div>
    );
  }

  // Filter top-level departments (no parent)
  const topLevelDepartments =
    orgChart.departments?.filter((dept) => !dept.parentId) || [];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      {orgChart.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Departments</p>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {orgChart.summary.totalDepartments || 0}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Designations</p>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {orgChart.summary.totalDesignations || 0}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Employees</p>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {orgChart.summary.totalEmployees || 0}
            </p>
          </div>
        </div>
      )}

      {/* Organization Chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Organization Hierarchy
        </h3>

        {topLevelDepartments.length > 0 ? (
          <div className="space-y-2">
            {topLevelDepartments.map((department) => renderDepartment(department, 0))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No departments found. Start by creating departments to build your organization chart.
          </div>
        )}
      </div>
    </div>
  );
}
