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
          className={`p-5 rounded-xl border-2 transition-all ${
            level === 0
              ? "bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50 border-gray-200 dark:border-gray-700 shadow-sm"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          } hover:shadow-lg hover:scale-[1.01]`}
          style={{ marginLeft: `${level * 32}px` }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <Building className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                    {department.name}
                  </h4>
                  {department.code && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                      Code: {department.code}
                    </p>
                  )}
                </div>
              </div>

              {department.manager && (
                <div className="ml-11 mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                      <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Manager: {department.manager.name || `${department.manager.firstName} ${department.manager.lastName}`}
                    </span>
                  </div>
                </div>
              )}

              {department.designations && department.designations.length > 0 && (
                <div className="ml-11 space-y-3 mt-3">
                  {department.designations.map((designation) => (
                    <div
                      key={designation.id}
                      className="p-4 bg-accent-50 dark:bg-accent-500/10 rounded-xl border-2 border-accent-200 dark:border-accent-500/20 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 bg-accent-100 dark:bg-accent-500/20 rounded-lg">
                            <Briefcase className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {designation.name}
                          </span>
                          <span className="px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                            {designation.code || designation.level}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-accent-700 dark:text-accent-400 px-2.5 py-1 bg-accent-100 dark:bg-accent-500/20 rounded-lg">
                          {designation.employeeCount || 0} employees
                        </span>
                      </div>

                      {designation.employees && designation.employees.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {designation.employees.slice(0, 5).map((emp) => (
                            <div
                              key={emp.id}
                              className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-300 ml-8 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <div className="p-1 bg-emerald-100 dark:bg-emerald-500/20 rounded">
                                <Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <span className="font-medium">
                                {emp.name || `${emp.firstName} ${emp.lastName}`} ({emp.employeeId})
                              </span>
                              {emp.reportsTo && (
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                  → {emp.reportsTo.name || `${emp.reportsTo.firstName} ${emp.reportsTo.lastName}`}
                                </span>
                              )}
                            </div>
                          ))}
                          {designation.employees.length > 5 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-8">
                              +{designation.employees.length - 5} more employees
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="ml-11 mt-3 flex gap-4">
                <span className="px-3 py-1.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-400 rounded-lg">
                  Employees: {department.totalEmployees || 0}
                </span>
                <span className="px-3 py-1.5 text-xs font-semibold bg-accent-100 text-accent-800 dark:bg-accent-500/30 dark:text-accent-400 rounded-lg">
                  Designations: {department.totalDesignations || 0}
                </span>
              </div>
            </div>

            {hasChildren && (
              <button
                onClick={() => toggleDepartment(department.id)}
                className="ml-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!orgChart) {
    return (
      <div className="text-center py-12">
        <div className="p-4 bg-brand-50 dark:bg-brand-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <GitBranch className="w-10 h-10 text-brand-500 dark:text-brand-400" />
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-brand-50 to-brand-100/50 dark:from-brand-500/20 dark:to-brand-500/10 p-5 rounded-xl border-2 border-brand-200 dark:border-brand-500/30 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg">
                <Building className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Departments</p>
            </div>
            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
              {orgChart.summary.totalDepartments || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-accent-50 to-accent-100/50 dark:from-accent-500/20 dark:to-accent-500/10 p-5 rounded-xl border-2 border-accent-200 dark:border-accent-500/30 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-accent-100 dark:bg-accent-500/20 rounded-lg">
                <Briefcase className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Designations</p>
            </div>
            <p className="text-3xl font-bold text-accent-600 dark:text-accent-400">
              {orgChart.summary.totalDesignations || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-500/20 dark:to-emerald-500/10 p-5 rounded-xl border-2 border-emerald-200 dark:border-emerald-500/30 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg">
                <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Employees</p>
            </div>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {orgChart.summary.totalEmployees || 0}
            </p>
          </div>
        </div>
      )}

      {/* Organization Chart */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="p-2 bg-brand-100 dark:bg-brand-500/20 rounded-lg">
            <GitBranch className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Organization Hierarchy
          </h3>
        </div>

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
