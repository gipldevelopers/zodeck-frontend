"use client";
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award } from 'lucide-react';

export default function DesignationHeader({ designation }) {
  const router = useRouter();
  
  return (
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
            Designation details and information
          </p>
        </div>
      </div>
    </div>
  );
}