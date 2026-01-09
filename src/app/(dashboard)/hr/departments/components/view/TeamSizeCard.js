import { Users } from 'lucide-react';

export default function TeamSizeCard({ employeeCount }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Team Size
        </h2>
      </div>
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full dark:bg-blue-900/30 mb-4">
          <Users className="text-blue-600 dark:text-blue-400" size={36} />
        </div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{employeeCount}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Employees</p>
      </div>
    </div>
  );
}