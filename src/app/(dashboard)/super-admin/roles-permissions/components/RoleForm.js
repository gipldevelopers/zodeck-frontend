// src\app\(dashboard)\super-admin\roles-permissions\components\RoleForm.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Shield, Loader2 } from 'lucide-react';
import { roleService } from '@/services/super-admin-services/user-roleService';
import { toast } from 'sonner';

export default function RoleForm({ role = null, isEdit = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    displayName: "",
    description: "",
    status: "Active"
  });

  useEffect(() => {
    if (role && isEdit) {
      setFormData({
        // name: role.name || "",
        // displayName: role.displayName || role.name || "",
        displayName: role.displayName || role.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "",
        description: role.description || "",
        status: role.status ? role.status.charAt(0) + role.status.slice(1).toLowerCase() : "Active"
      });
    }
  }, [role, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  const validateForm = () => {
    const newErrors = {};

    if (!formData.displayName?.trim()) {
      newErrors.displayName = "Role name is required";
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = "Role name must be at least 2 characters";
    } else {
      // Validate that the auto-generated name will be valid
      const generatedName = formData.displayName.trim()
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');

      if (generatedName.length < 2) {
        newErrors.displayName = "Role name contains invalid characters";
      } else if (generatedName.length > 50) {
        newErrors.displayName = "Role name is too long (max 50 characters after conversion)";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Generate the internal name from displayName
      const name = formData.displayName.trim()
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');

      // Prepare data for API (convert status to uppercase)
      // Prepare data for API 
      const apiData = {
        name: name,
        displayName: formData.displayName.trim(),
        description: formData.description.trim(),
        isActive: formData.status === 'Active' // Convert to boolean
      };

      console.log('Submitting:', apiData);

      let response;

      if (isEdit) {
        response = await roleService.updateRole(role.id, apiData);
        toast.success('Role updated successfully');
        router.push('/super-admin/roles-permissions');
      } else {
        response = await roleService.createRole(apiData);
        toast.success('Role created successfully');
        // Redirect to permissions page with the new role ID
        router.push(`/super-admin/roles-permissions/${response.data.id}/permissions`);
      }

      router.refresh();
    } catch (error) {
      console.error('Error saving role:', error);

      // Handle specific error cases
      if (error.message.includes('already exists')) {
        toast.error('Role name already exists');
        setErrors(prev => ({ ...prev, displayName: 'This role name is already taken' }));
      } else if (error.message.includes('System roles')) {
        toast.error('Cannot modify system roles');
      } else {
        toast.error(error.message || 'Failed to save role');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6">
      {/* Header with title and back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/super-admin/roles-permissions')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
          disabled={isSubmitting}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
            <Shield className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Role' : 'Add New Role'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEdit ? 'Update role information' : 'Create a new role with basic information'}
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

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors ${errors.displayName ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                    }`}
                  placeholder="Enter role name (e.g., HR Manager)"
                  disabled={isSubmitting}
                />
                {errors.displayName && (
                  <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
                )}
                {/* <p className="text-xs text-gray-500 mt-1">Minimum 2 characters</p> */}

                {/* Show auto-generated name preview */}
                {formData.displayName && (
                  <p className="text-xs text-blue-500 mt-1">
                    Internal ID: {formData.displayName.trim().toUpperCase().replace(/\s+/g, '_')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors ${errors.description ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                    }`}
                  placeholder="Describe the role's purpose, responsibilities, and permissions..."
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
              </div>

              {isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={isSubmitting}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Inactive roles cannot be assigned to users</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.push('/super-admin/roles-permissions')}
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
                  {isEdit ? 'Update Role' : 'Create Role'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}