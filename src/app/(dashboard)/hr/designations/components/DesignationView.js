"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Calendar, Building, Award, Activity } from 'lucide-react';

// Mock function to fetch designation data - replace with actual API call
const getDesignationData = (id) => {
  const designations = [
    {
      id: 1,
      title: 'Software Engineer',
      level: 'L2',
      department: 'Information Technology',
      minExperience: 2,
      maxExperience: 5,
      status: 'Active',
      employeeCount: 15,
      createdAt: '2023-01-15',
      updatedAt: '2023-11-20'
    },
    {
      id: 2,
      title: 'Senior Software Engineer',
      level: 'L3',
      department: 'Information Technology',
      minExperience: 5,
      maxExperience: 8,
      status: 'Active',
      employeeCount: 8,
      createdAt: '2022-08-10',
      updatedAt: '2023-10-05'
    },
    // ... other designations from your table data
  ];
  return designations.find(designation => designation.id === parseInt(id));
};

export default function DesignationView({ params }) {
  const router = useRouter();
  const [designation, setDesignation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        const data = getDesignationData(params.id);
        setDesignation(data);
      } catch (error) {
        console.error('Error fetching designation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!designation) {
    return (
      <div className="w-full p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Designation Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The designation you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/hr/designations')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Designations
          </button>
        </div>
      </div>
    );
  }

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
            <Award className="text-blue-600 dark:text-blue-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {designation.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Designation Details
            </p>
          </div>
        </div>
      </div>

      {/* Designation Details */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Basic Information Card */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Award size={18} className="mr-2" />
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</span>
                <p className="text-gray-900 dark:text-white">{designation.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Level</span>
                <p className="text-gray-900 dark:text-white">{designation.level}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</span>
                <p className="text-gray-900 dark:text-white">{designation.department}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                <span className={`px-2.5 py-0.5 rounded-xs text-xs font-medium ${designation.status === 'Active'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                  {designation.status}
                </span>
              </div>
            </div>
          </div>

          {/* Experience & Employees Card */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users size={18} className="mr-2" />
              Experience & Employees
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience Required</span>
                <p className="text-gray-900 dark:text-white">
                  {designation.minExperience} - {designation.maxExperience} years
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Employees</span>
                <p className="text-gray-900 dark:text-white">{designation.employeeCount}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</span>
                <p className="text-gray-900 dark:text-white">{designation.createdAt}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</span>
                <p className="text-gray-900 dark:text-white">{designation.updatedAt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg mr-3">
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400">Total Employees</p>
              <p className="text-xl font-semibold text-blue-700 dark:text-blue-300">{designation.employeeCount}</p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-3">
              <Calendar className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-green-600 dark:text-green-400">Experience Range</p>
              <p className="text-xl font-semibold text-green-700 dark:text-green-300">
                {designation.minExperience}-{designation.maxExperience}yrs
              </p>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg mr-3">
              <Activity className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Status</p>
              <p className="text-xl font-semibold text-purple-700 dark:text-purple-300">{designation.status}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => router.push('/hr/designations')}
            className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 text-center"
          >
            Back to List
          </button>
          <button
            onClick={() => router.push(`/hr/designations/edit/${designation.id}`)}
            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Edit Designation
          </button>
        </div>
      </div>
    </div>
  );
}