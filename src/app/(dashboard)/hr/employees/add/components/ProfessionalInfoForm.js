// src\app\(dashboard)\hr\employees\add\components\ProfessionalInfoForm.js
"use client";
import { Briefcase, Calendar, User, IndianRupee, Clock, Building, Users, FileText, Loader2 } from 'lucide-react';
import InputField from '@/components/form/input/InputField';
import SelectField from './SelectField';
import Label from '@/components/form/Label';
import { useEffect, useState } from 'react';
import employeeService from '@/services/hr-services/employeeService';
import { departmentService } from '@/services/hr-services/departmentService';
import { designationService } from '@/services/hr-services/designationService';

export default function ProfessionalInfoForm({ formData, errors, onChange, dropdownData }) {
  const [isGeneratingId, setIsGeneratingId] = useState(false);
  const [isIdGenerated, setIsIdGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  const employmentTypeOptions = [
    { value: '', label: 'Select Employment Type' },
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INTERNSHIP', label: 'Internship' },
    { value: 'FREELANCE', label: 'Freelance' }
  ];

  // Auto-generate employee ID when component mounts
  useEffect(() => {
    const generateEmployeeId = async () => {
      if (!formData.employeeId && !isIdGenerated) {
        try {
          setIsGeneratingId(true);
          const response = await employeeService.getNextEmployeeId();
          onChange('employeeId', response.data.nextEmployeeId);
          setIsIdGenerated(true);
        } catch (error) {
          console.error('Failed to generate employee ID:', error);
          // Fallback: Generate a temporary ID
          const tempId = `TEMP-${Date.now().toString().slice(-6)}`;
          onChange('employeeId', tempId);
        } finally {
          setIsGeneratingId(false);
        }
      }
    };

    generateEmployeeId();
  }, [formData.employeeId, isIdGenerated, onChange]);

  // Fetch managers when component mounts
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoadingManagers(true);
        const response = await employeeService.getManagers();
        setManagers(response.data);
      } catch (error) {
        console.error('Failed to fetch managers:', error);
        // Fallback to existing dropdown data if available
        if (dropdownData.reportingManagers) {
          setManagers(dropdownData.reportingManagers);
        }
      } finally {
        setLoadingManagers(false);
      }
    };

    fetchManagers();
  }, []);

  const departmentOptions = [
    { value: '', label: 'Select Department' },
    ...(dropdownData.departments || []).map(dept => ({
      value: dept.id.toString(),
      label: dept.name
    }))
  ];

  const designationOptions = [
    { value: '', label: 'Select Designation' },
    ...(dropdownData.designations || []).map(designation => ({
      value: designation.id.toString(),
      label: designation.name
    }))
  ];

  // const reportingManagerOptions = [
  //   { value: '', label: 'Select Reporting Manager' },
  //   ...managers.map(manager => ({
  //     value: manager.id.toString(),
  //     label: `${manager.firstName} ${manager.lastName} (${manager.employeeId})${manager.designation?.name ? ` - ${manager.designation.name}` : ''}`
  //   }))
  // ];
  const reportingManagerOptions = [
    { value: '', label: 'Select Reporting Manager' },
    ...(managers?.data || managers || []).map(manager => ({
      value: manager.id.toString(),
      label: `${manager.firstName} ${manager.lastName} (${manager.employeeId})${manager.designation?.name ? ` - ${manager.designation.name}` : ''}`
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Professional Information
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enter the employment details and professional information
            </p>
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Employment Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employee ID - Auto-generated and read-only */}
          <div className="space-y-2">
            <Label htmlFor="employeeId">
              Employee ID
            </Label>
            <div className="relative">
              <InputField
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={(e) => onChange('employeeId', e.target.value)}
                placeholder="Generating employee ID..."
                error={errors.employeeId}
                icon={<User className="w-4 h-4" />}
                disabled={isGeneratingId}
                readOnly={true}
              />
              {isGeneratingId && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Employee ID is automatically generated by the system
            </p>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="departmentId">
              Department
            </Label>
            <SelectField
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={(value) => onChange('departmentId', value)}
              options={departmentOptions}
              error={errors.departmentId}
            />
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <Label htmlFor="designationId">
              Designation
            </Label>
            <SelectField
              id="designationId"
              name="designationId"
              value={formData.designationId}
              onChange={(value) => onChange('designationId', value)}
              options={designationOptions}
              error={errors.designationId}
            />
          </div>

          {/* Reporting Manager */}
          <div className="space-y-2">
            <Label htmlFor="reportingManagerId">
              Reporting Manager
            </Label>
            <div className="relative">
              <SelectField
                id="reportingManagerId"
                name="reportingManagerId"
                value={formData.reportingManagerId}
                onChange={(value) => onChange('reportingManagerId', value)}
                options={reportingManagerOptions}
                error={errors.reportingManagerId}
                disabled={loadingManagers}
              />
              {loadingManagers && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                </div>
              )}
            </div>
            {loadingManagers && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Loading managers...
              </p>
            )}
          </div>

          {/* Joining Date */}
          <div className="space-y-2">
            <Label htmlFor="joiningDate">
              Joining Date
            </Label>
            <InputField
              id="joiningDate"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => onChange('joiningDate', e.target.value)}
              error={errors.joiningDate}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>

          {/* Confirmation Date */}
          <div className="space-y-2">
            <Label htmlFor="confirmationDate">
              Confirmation Date
            </Label>
            <InputField
              id="confirmationDate"
              name="confirmationDate"
              type="date"
              value={formData.confirmationDate}
              onChange={(e) => onChange('confirmationDate', e.target.value)}
              error={errors.confirmationDate}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <Label htmlFor="employmentType">
              Employment Type
            </Label>
            <SelectField
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={(value) => onChange('employmentType', value)}
              options={employmentTypeOptions}
              error={errors.employmentType}
            />
          </div>

          {/* Work Location */}
          <div className="space-y-2">
            <Label htmlFor="workLocation">
              Work Location
            </Label>
            <InputField
              id="workLocation"
              name="workLocation"
              value={formData.workLocation}
              onChange={(e) => onChange('workLocation', e.target.value)}
              placeholder="Enter work location"
              error={errors.workLocation}
            />
          </div>
        </div>
      </div>

      {/* Compensation & Work Details */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <IndianRupee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Compensation & Work Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Base Salary */}
          <div className="space-y-2">
            <Label htmlFor="baseSalary">
              Base Salary (₹)
            </Label>
            <InputField
              id="baseSalary"
              name="baseSalary"
              type="number"
              value={formData.baseSalary}
              onChange={(e) => onChange('baseSalary', e.target.value)}
              placeholder="Enter base salary"
              error={errors.baseSalary}
              icon={<IndianRupee className="w-4 h-4" />}
            />
          </div>

          {/* Probation Period */}
          <div className="space-y-2">
            <Label htmlFor="probationPeriod">
              Probation Period (months)
            </Label>
            <InputField
              id="probationPeriod"
              name="probationPeriod"
              type="number"
              value={formData.probationPeriod}
              onChange={(e) => onChange('probationPeriod', e.target.value)}
              placeholder="Enter probation period in months"
              error={errors.probationPeriod}
            />
          </div>

          {/* Work Shift */}
          <div className="space-y-2">
            <Label htmlFor="workShift">
              Work Shift
            </Label>
            <InputField
              id="workShift"
              name="workShift"
              value={formData.workShift}
              onChange={(e) => onChange('workShift', e.target.value)}
              placeholder="Enter work shift"
              error={errors.workShift}
            />
          </div>
        </div>
      </div>

      {/* Status Information */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Status Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Employment Status
            </Label>
            <SelectField
              id="status"
              name="status"
              value={formData.status}
              onChange={(value) => onChange('status', value)}
              options={[
                { value: '', label: 'Select Status' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'PROBATION', label: 'Probation' },
                { value: 'NOTICE_PERIOD', label: 'Notice Period' },
                { value: 'SUSPENDED', label: 'Suspended' },
                { value: 'TERMINATED', label: 'Terminated' },
                { value: 'RESIGNED', label: 'Resigned' },
                { value: 'RETIRED', label: 'Retired' }
              ]}
              error={errors.status}
            />
          </div>

          {/* Onboarding Status */}
          <div className="space-y-2">
            <Label htmlFor="onboardingStatus">
              Onboarding Status
            </Label>
            <SelectField
              id="onboardingStatus"
              name="onboardingStatus"
              value={formData.onboardingStatus}
              onChange={(value) => onChange('onboardingStatus', value)}
              options={[
                { value: '', label: 'Select Onboarding Status' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'IN_PROGRESS', label: 'In Progress' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'FAILED', label: 'Failed' }
              ]}
              error={errors.onboardingStatus}
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-purple-600 rounded-md flex-shrink-0 mt-0.5">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Professional Information Guidelines
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Accurate professional information ensures proper payroll processing, department allocation, and reporting structure setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}