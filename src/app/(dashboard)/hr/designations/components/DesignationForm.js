// src/app/(dashboard)/hr/designations/components/DesignationForm.js
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Briefcase, Loader2 } from 'lucide-react';
import { designationService } from '@/services/hr-services/designationService';
import { departmentService } from '@/services/hr-services/departmentService';
import { toast } from 'sonner';

export default function DesignationForm({ designation = null, isEdit = false }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: 'L1',
    departmentId: '',
    minExperience: 0,
    maxExperience: 0,
    status: 'ACTIVE',
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepartments(true);
      try {
        const response = await departmentService.getAllDepartments({ limit: 100 });
        setDepartments(response.data || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('Failed to load departments');
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (designation) {
      setFormData({
        name: designation.name || '',
        level: designation.level || 'L1',
        departmentId: designation.departmentId || designation.department?.id || '',
        minExperience: designation.minExperience || 0,
        maxExperience: designation.maxExperience || 0,
        status: designation.status || 'ACTIVE',
      });
    }
  }, [designation]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEdit) {
        await designationService.updateDesignation(designation.id, formData);
        toast.success('Designation updated successfully');
      } else {
        await designationService.createDesignation(formData);
        toast.success('Designation created successfully');
      }

      // Redirect back to designations list after successful submission
      router.push('/hr/designations');
      router.refresh();
    } catch (error) {
      console.error('Error saving designation:', error);
      toast.error(error.message || 'Failed to save designation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6">
      {/* Header with title and back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.push('/hr/designations')}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mr-3">
            <Briefcase className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Edit Designation' : 'Add New Designation'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isEdit ? 'Update designation information' : 'Create a new designation in the organization'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Department */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department *
              </label>
              <div className="relative">
                {isLoadingDepartments ? (
                  <div className="flex items-center justify-center h-12 border border-gray-300 rounded-lg dark:border-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="ml-2 text-sm text-gray-500">Loading departments...</span>
                  </div>
                ) : (
                  <>
                    <select
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none transition-colors"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Designation Name */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Designation Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
                placeholder="Enter designation name"
                required
              />
            </div>

            {/* Level */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Level *
              </label>
              <div className="relative">
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none transition-colors"
                  required
                >
                  <option value="L1">L1 (Entry Level)</option>
                  <option value="L2">L2 (Junior)</option>
                  <option value="L3">L3 (Mid Level)</option>
                  <option value="L4">L4 (Senior)</option>
                  <option value="L5">L5 (Lead)</option>
                  <option value="L6">L6 (Principal)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>



            {/* Experience Range */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Experience (Years) *
              </label>
              <input
                type="number"
                name="minExperience"
                value={formData.minExperience}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
                placeholder="Min experience"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Experience (Years) *
              </label>
              <input
                type="number"
                name="maxExperience"
                value={formData.maxExperience}
                onChange={handleChange}
                min="0"
                max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 transition-colors"
                placeholder="Max experience"
                required
              />
            </div>

            {/* Status */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white appearance-none transition-colors"
                  required
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => router.push('/hr/designations')}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 text-center"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingDepartments}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSubmitting
                ? (isEdit ? 'Updating...' : 'Creating...')
                : (isEdit ? 'Update Designation' : 'Create Designation')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}