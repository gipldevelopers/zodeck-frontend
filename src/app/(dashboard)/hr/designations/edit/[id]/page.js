// src/app/(dashboard)/hr/designations/edit/[id]/page.js
"use client";
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import DesignationForm from '../../components/DesignationForm';
import { designationService } from '@/services/hr-services/designationService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function EditDesignationPage() {
  const params = useParams();
  const router = useRouter();
  const [designation, setDesignation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDesignation = async () => {
      if (!params.id) return;

      setIsLoading(true);
      try {
        const designationData = await designationService.getDesignationById(params.id);
        setDesignation(designationData.data);
      } catch (error) {
        console.error('Error fetching designation:', error);
        setError(error.message || 'Failed to fetch designation');
        toast.error(error.message || 'Failed to fetch designation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDesignation();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <Breadcrumb rightContent={null} />
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-6">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading designation...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !designation) {
    return (
      <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
        <Breadcrumb rightContent={null} />
        <div className="bg-white rounded-lg shadow dark:bg-gray-800 p-4 sm:p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'Designation not found'}
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
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb rightContent={null} />

      <div className="bg-white rounded-lg shadow dark:bg-gray-800">
        <DesignationForm designation={designation} isEdit={true} />
      </div>
    </div>
  );
}