// src/app/(dashboard)/hr/payroll/reports/components/ReportFilters.js
"use client";
import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { departmentService } from '../../../../../../services/hr-services/departmentService';
import { employeeService } from '../../../../../../services/hr-services/employeeService';

const ReportFilters = ({
  selectedReportType,
  setSelectedReportType,
  dateRange,
  setDateRange
}) => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState({ deps: false, emps: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedReportType === 'department-wise') {
          setLoading(prev => ({ ...prev, deps: true }));
          const response = await departmentService.getAllDepartments();
          setDepartments(response.data || []);
        } else if (selectedReportType === 'employee-wise') {
          setLoading(prev => ({ ...prev, emps: true }));
          const response = await employeeService.getAllEmployees();
          setEmployees(response.data.employees || []);
        }
      } catch (err) {
        console.error('Error fetching filter data:', err);
      } finally {
        setLoading({ deps: false, emps: false });
      }
    };

    fetchData();
  }, [selectedReportType]);

  const reportTypes = [
    { id: 'all', name: 'All Reports' },
    { id: 'payroll-summary', name: 'Payroll Summary' },
    { id: 'tax-report', name: 'Tax Report' },
    { id: 'department-wise', name: 'Department Wise Report' },
    { id: 'employee-wise', name: 'Employee Wise Report' },
    { id: 'bank-transfer', name: 'Bank Transfer Report' },
    { id: 'deductions', name: 'Deductions Report' },
    { id: 'year-end', name: 'Year End Report' }
  ];

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Report Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Report Type
        </label>
        <div className="relative">
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="w-full pl-3 pr-10 py-2 text-base border border-gray-100 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white appearance-none"
          >
            {reportTypes.map(report => (
              <option key={report.id} value={report.id}>{report.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Date Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full pl-3 pr-10 py-2 text-base border border-gray-100 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full pl-3 pr-10 py-2 text-base border border-gray-100 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Filters (conditional based on report type) */}
      {selectedReportType === 'department-wise' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Department
          </label>
          <select
            disabled={loading.deps}
            className="w-full pl-3 pr-10 py-2 text-base border border-gray-100 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{loading.deps ? 'Loading...' : 'All Departments'}</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.id}>{dep.name}</option>
            ))}
          </select>
        </div>
      )}

      {selectedReportType === 'employee-wise' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Employee
          </label>
          <select
            disabled={loading.emps}
            className="w-full pl-3 pr-10 py-2 text-base border border-gray-100 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{loading.emps ? 'Loading...' : 'All Employees'}</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.employeeId})</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ReportFilters;