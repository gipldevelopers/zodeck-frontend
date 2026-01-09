// src/app/(dashboard)/super-admin/users/components/UserForm.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, User, Mail, Shield, Lock, Loader2, Briefcase, Building } from 'lucide-react';
import { userManagementService } from '@/services/userManagementService';
import { toast } from 'sonner';

export default function UserForm({ user = null, isEdit = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);
  const [systemRoles, setSystemRoles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    systemRole: "",
    companyRoleId: "",
    employeeId: "",
    isActive: true
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);

        // Fetch roles and employees in parallel
        const [rolesResponse, sysRolesResponse, employeesResponse] = await Promise.all([
          userManagementService.getCompanyRoles(),
          userManagementService.getSystemRoles(),
          fetch('/api/employees?limit=100').then(res => res.json()) // You'll need to create this endpoint
        ]);

        if (rolesResponse.success) {
          setAvailableRoles(rolesResponse.data?.roles || rolesResponse.data || []);
        }

        if (sysRolesResponse.success) {
          setSystemRoles(sysRolesResponse.data || []);
        }

        if (employeesResponse.success) {
          setEmployees(employeesResponse.data || []);
        }

        // If editing, load user data
        if (user && isEdit) {
          const userResponse = await userManagementService.getUserById(user.id);
          if (userResponse.success) {
            const userData = userResponse.data;
            setFormData({
              email: userData.email || "",
              systemRole: userData.systemRole || "",
              companyRoleId: userData.companyRoleId || "",
              employeeId: userData.employeeId || "",
              isActive: userData.isActive || true
            });
          }
        }

      } catch (error) {
        console.error('Error loading form data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [user, isEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.systemRole) {
      newErrors.systemRole = "System role is required";
    }

    // Company role is optional

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const apiData = {
        email: formData.email.trim(),
        systemRole: formData.systemRole,
        companyRoleId: formData.companyRoleId || null,
        employeeId: formData.employeeId || null,
        isActive: formData.isActive
      };

      let response;

      if (isEdit) {
        response = await userManagementService.updateUser(user.id, apiData);
        toast.success('User updated successfully');
        router.push('/super-admin/users');
      } else {
        response = await userManagementService.createUser(apiData);
        toast.success('User created successfully');
        // Optionally redirect to user details or send password reset
        router.push('/super-admin/users');
      }

      router.refresh();
    } catch (error) {
      console.error('Error saving user:', error);

      // Handle specific error cases
      if (error.message.includes('already exists')) {
        toast.error('Email already exists');
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
      } else if (error.message.includes('invalid')) {
        toast.error('Invalid data provided');
      } else {
        toast.error(error.message || 'Failed to save user');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading form data...</span>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6">
      {/* Header with title and back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/super-admin/users')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
            <User className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit User' : 'Add New User'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEdit ? 'Update user information and role assignments' : 'Create a new user account and assign roles'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Mail size={16} className="mr-2" /> Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter email address"
                  disabled={isSubmitting || isEdit}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
                {!isEdit && (
                  <p className="text-xs text-gray-500 mt-1">
                    A temporary password will be generated and emailed to the user
                  </p>
                )}
              </div>

              {/* System Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Shield size={16} className="mr-2" /> System Role *
                </label>
                <select
                  name="systemRole"
                  value={formData.systemRole}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.systemRole ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                    }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select System Role</option>
                  {systemRoles.map(role => (
                    <option key={role.name} value={role.name}>
                      {role.displayName}
                    </option>
                  ))}
                </select>
                {errors.systemRole && (
                  <p className="text-red-500 text-sm mt-1">{errors.systemRole}</p>
                )}
              </div>

              {/* Company Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Briefcase size={16} className="mr-2" /> Company Role
                </label>
                <select
                  name="companyRoleId"
                  value={formData.companyRoleId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isSubmitting}
                >
                  <option value="">No Company Role</option>
                  {availableRoles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.displayName}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Assign additional company-specific permissions
                </p>
              </div>

              {/* Link to Employee (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Building size={16} className="mr-2" /> Link to Employee
                </label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  disabled={isSubmitting}
                >
                  <option value="">No Employee Link</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.employeeId} - {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Optional: Link this user account to an employee record
                </p>
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                id="isActive"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                Active Account (User can login)
              </label>
            </div>
          </div>

          {/* Password Information (for new users) */}
          {!isEdit && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-600 rounded-md flex-shrink-0">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Password Information
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    A temporary password will be automatically generated and sent to the user's email address.
                    They will be required to change it on first login.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.push('/super-admin/users')}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 text-center disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save size={18} />
                  {isEdit ? 'Update User' : 'Create User'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}