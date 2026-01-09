"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import DesignationStats from '../../components/view/DesignationStats';
import DesignationHeader from '../../components/view/DesignationHeader';
import DesignationInfoCard from '../../components/view/DesignationInfoCard';
import RecentActivityCard from '../../../departments/components/view/RecentActivityCard';
import TeamSizeCard from '../../../departments/components/view/TeamSizeCard';
import QuickActionsCard from '../../components/view/QuickActionCard';

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
      updatedAt: '2023-11-20',
      recentActivity: [
        { action: 'Created', person: 'Admin User', date: '2023-01-15' },
        { action: 'Updated', person: 'HR Manager', date: '2023-11-20' }
      ]
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
      updatedAt: '2023-10-05',
      recentActivity: [
        { action: 'Created', person: 'Admin User', date: '2022-08-10' },
        { action: 'Updated', person: 'HR Manager', date: '2023-10-05' }
      ]
    },
    // ... other designations from your table data
  ];
  return designations.find(designation => designation.id === parseInt(id));
};

export default function DesignationViewPage() {
  const params = useParams();
  const [designation, setDesignation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from your API
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
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center dark:bg-gray-800">
          <div className="animate-pulse">Loading designation data...</div>
        </div>
      </div>
    );
  }

  if (!designation) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 text-center dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">Designation not found</p>
          <button
            onClick={() => window.location.href = '/hr/designations'}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Designations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb rightContent={null} />

      <div className='bg-white rounded-lg shadow dark:bg-gray-800'>
        <div className="p-4 sm:p-6">
          {/* Header with back button */}
          <DesignationHeader designation={designation} />

          {/* Stats Cards */}
          <DesignationStats designation={designation} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Designation Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <DesignationInfoCard designation={designation} />

              {/* Recent Activity Card */}
              <RecentActivityCard recentActivity={designation.recentActivity} />
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Employee Count Card */}
              <TeamSizeCard employeeCount={designation.employeeCount} />

              {/* Quick Actions Card */}
              <QuickActionsCard designationId={designation.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}