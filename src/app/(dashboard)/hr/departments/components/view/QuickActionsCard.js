"use client";
import { useRouter } from 'next/navigation';

export default function QuickActionsCard({ departmentId }) {
  const router = useRouter();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </h2>
      </div>
      <div className="p-6 space-y-3">
        <button
          onClick={() => router.push(`/hr/departments/edit/${departmentId}`)}
          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Edit Department
        </button>
        <button
          onClick={() => router.push(`/hr/employees?department=${departmentId}`)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Employees
        </button>
        <button
          onClick={() => router.push('/hr/departments')}
          className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>
    </div>
  );
}