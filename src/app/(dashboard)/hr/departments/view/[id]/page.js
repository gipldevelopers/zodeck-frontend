// src/app/(dashboard)/hr/departments/view/[id]/page.js
"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/common/Breadcrumb';
import DepartmentStats from '../../components/DepartmentStats';
import DepartmentHeader from '../../components/view/DepartmentHeader';
import DepartmentInfoCard from '../../components/view/DepartmentInfoCard';
import RecentActivityCard from '../../components/view/RecentActivityCard';
import TeamSizeCard from '../../components/view/TeamSizeCard';
import QuickActionsCard from '../../components/view/QuickActionsCard';
import { departmentService } from '@/services/hr-services/departmentService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function DepartmentViewPage() {
  const params = useParams();
  const router = useRouter();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!params.id) return;
      
      setLoading(true);
      try {
        const departmentData = await departmentService.getDepartmentById(params.id);
        setDepartment(departmentData.data);
      } catch (error) {
        console.error('Error fetching department:', error);
        setError(error.message || 'Failed to fetch department');
        toast.error(error.message || 'Failed to fetch department');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [params.id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <Breadcrumb />
        <div className="bg-white rounded-xl shadow-sm p-6 text-center dark:bg-gray-800">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading department data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <Breadcrumb />
        <div className="bg-white rounded-xl shadow-sm p-6 text-center dark:bg-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'Department not found'}
          </p>
          <button 
            onClick={() => router.push('/hr/departments')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Departments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb />
      
      <div className='bg-white rounded-lg shadow dark:bg-gray-800'>
        <div className="p-4 sm:p-6">
          {/* Header with back button */}
          <DepartmentHeader department={department} />

          {/* Stats Cards */}
          <DepartmentStats department={department} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Department Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <DepartmentInfoCard department={department} />

              {/* Recent Activity Card - You might want to fetch this from a separate API */}
              <RecentActivityCard recentActivity={[]} />
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Employee Count Card */}
              <TeamSizeCard employeeCount={department.employeeCount} />

              {/* Quick Actions Card */}
              <QuickActionsCard departmentId={department.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}