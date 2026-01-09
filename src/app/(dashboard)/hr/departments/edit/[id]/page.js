// src/app/(dashboard)/hr/departments/edit/[id]/page.js
"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import DepartmentForm from '../../components/DepartmentForm';
import { departmentService } from '@/services/hr-services/departmentService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditDepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const [department, setDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!params.id) return;

      try {
        setIsLoading(true);
        const departmentData = await departmentService.getDepartmentById(params.id);
        setDepartment(departmentData.data);
      } catch (error) {
        console.error('Error fetching department:', error);
        setError(error.message || 'Failed to fetch department');
        toast.error(error.message || 'Failed to fetch department');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading department...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
        <Breadcrumb />
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-6 text-center">
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

      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DepartmentForm department={department} isEdit={true} />
      </div>
    </div>
  );
}