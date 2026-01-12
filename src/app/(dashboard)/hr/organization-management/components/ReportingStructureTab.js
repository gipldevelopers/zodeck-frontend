"use client";

import { useState, useEffect } from "react";
import { Network, User, Mail, Building, Briefcase, Users, ChevronRight } from "lucide-react";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";

export default function ReportingStructureTab() {
  const [reportingStructure, setReportingStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedManagers, setExpandedManagers] = useState(new Set());

  useEffect(() => {
    const fetchReportingStructure = async () => {
      try {
        setLoading(true);
        const response = await organizationService.getReportingStructure();
        const structure = response.success ? response.data : response;
        setReportingStructure(structure);
        // Auto-expand top-level managers
        if (structure?.topLevelManagers) {
          setExpandedManagers(
            new Set(structure.topLevelManagers.map((m) => m.id.toString()))
          );
        }
      } catch (error) {
        console.error("Error fetching reporting structure:", error);
        toast.error("Failed to load reporting structure");
      } finally {
        setLoading(false);
      }
    };

    fetchReportingStructure();
  }, []);

  const toggleManager = (managerId) => {
    setExpandedManagers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(managerId.toString())) {
        newSet.delete(managerId.toString());
      } else {
        newSet.add(managerId.toString());
      }
      return newSet;
    });
  };

  const renderEmployee = (employee, level = 0) => {
    const isExpanded = expandedManagers.has(employee.id.toString());
    const hasReports = employee.directReports && employee.directReports.length > 0;

    return (
      <div key={employee.id} className="mb-2">
        <div
          className={`flex items-center gap-3 p-3 rounded-lg border ${
            level === 0
              ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          } hover:shadow-md transition-shadow`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {hasReports && (
            <button
              onClick={() => toggleManager(employee.id)}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight
                className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
          {!hasReports && <div className="w-6" />}

          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.name || `${employee.firstName} ${employee.lastName}`}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {employee.employeeId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {employee.email || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {employee.department || "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {employee.designation || "N/A"}
              </span>
              {employee.orgLevel && (
                <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                  L{employee.orgLevel}
                </span>
              )}
            </div>
          </div>

          {hasReports && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{employee.directReports.length} reports</span>
            </div>
          )}
        </div>

        {hasReports && isExpanded && (
          <div className="mt-2">
            {employee.directReports.map((report) => renderEmployee(report, level + 1))}
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

  if (!reportingStructure) {
    return (
      <div className="text-center py-12">
        <Network className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No reporting structure data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Top-Level Managers</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {reportingStructure.topLevelManagers?.length || 0}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Reporting Lines</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {reportingStructure.reportingLines?.length || 0}
          </p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {reportingStructure.totalEmployees ||
              (reportingStructure.topLevelManagers?.length || 0) +
                (reportingStructure.reportingLines?.length || 0)}
          </p>
        </div>
      </div>

      {/* Reporting Hierarchy */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Network className="w-5 h-5" />
          Reporting Hierarchy
        </h3>

        {reportingStructure.topLevelManagers && reportingStructure.topLevelManagers.length > 0 ? (
          <div className="space-y-2">
            {reportingStructure.topLevelManagers.map((manager) =>
              renderEmployee(manager, 0)
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No top-level managers found
          </div>
        )}
      </div>

      {/* Reporting Lines List (Alternative View) */}
      {reportingStructure.reportingLines && reportingStructure.reportingLines.length > 0 && (
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Reporting Lines
          </h3>
          <div className="space-y-2">
            {reportingStructure.reportingLines.map((line, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {line.employee?.name || `${line.employee?.firstName} ${line.employee?.lastName}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {line.employee?.designation}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {line.reportsTo?.name || `${line.reportsTo?.firstName} ${line.reportsTo?.lastName}`}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {line.reportsTo?.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
