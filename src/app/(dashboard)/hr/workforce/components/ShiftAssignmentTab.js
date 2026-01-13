"use client";

import { useState, useEffect } from "react";
import { Briefcase, Edit, Loader2, RefreshCw, Users } from "lucide-react";
import { workforceService } from "@/services/hr-services/workforce.service";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";
import ShiftAssignmentModal from "./ShiftAssignmentModal";

export default function ShiftAssignmentTab() {
  const [shiftAssignments, setShiftAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: "all",
    shift: "",
    employeeId: "",
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchShiftAssignments();
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

  const fetchShiftAssignments = async () => {
    try {
      setLoading(true);
      const params = {
        departmentId: filters.departmentId !== "all" ? filters.departmentId : "all",
      };
      if (filters.shift) {
        params.shift = filters.shift;
      }
      if (filters.employeeId) {
        params.employeeId = filters.employeeId;
      }

      const response = await workforceService.getShiftAssignments(params);
      const data = response.success ? response.data : response.data || [];
      setShiftAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching shift assignments:", error);
      toast.error(error.message || "Failed to fetch shift assignments");
      setShiftAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleModalSuccess = () => {
    fetchShiftAssignments();
    handleModalClose();
  };

  const shiftOptions = ["Morning", "Afternoon", "Night", "General", "Rotating", "Flexible"];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Department
            </label>
            <select
              value={filters.departmentId}
              onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shift
            </label>
            <select
              value={filters.shift}
              onChange={(e) => setFilters({ ...filters, shift: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-700 dark:text-white transition-all"
            >
              <option value="">All Shifts</option>
              {shiftOptions.map((shift) => (
                <option key={shift} value={shift}>
                  {shift}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchShiftAssignments}
            className="px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-all shadow-sm hover:shadow-md font-semibold flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            </div>
          ) : shiftAssignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-brand-50 dark:bg-brand-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-10 h-10 text-brand-500 dark:text-brand-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No shift assignments found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-brand-50 to-brand-100/50 dark:from-brand-500/10 dark:to-brand-500/5">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Shift
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Work Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {shiftAssignments.map((employee) => (
                  <tr
                    key={employee.id || employee.publicId}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img
                          src={employee.profileImage || "/images/users/user-default.png"}
                          alt={employee.name}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {employee.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {employee.department || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {employee.designation || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {employee.shift || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {employee.workLocation || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="p-2 rounded-lg bg-brand-50 text-brand-600 hover:bg-brand-100 transition-colors dark:bg-brand-900/30 dark:text-brand-400 shadow-sm hover:shadow"
                        title="Edit Shift"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ShiftAssignmentModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          employee={selectedEmployee}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
