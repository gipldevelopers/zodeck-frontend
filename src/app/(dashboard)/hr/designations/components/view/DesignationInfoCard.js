import { Users, Activity, Building, Calendar, Award } from 'lucide-react';

export default function DesignationInfoCard({ designation }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Designation Information
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg dark:bg-blue-900/30 mr-3">
              <Award className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Title</p>
              <p className="font-medium text-gray-900 dark:text-white">{designation.title}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-lg dark:bg-green-900/30 mr-3">
              <Activity className="text-green-600 dark:text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-xs text-xs font-medium ${
                designation.status === 'Active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {designation.status}
              </span>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-purple-100 p-2 rounded-lg dark:bg-purple-900/30 mr-3">
              <Building className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
              <p className="font-medium text-gray-900 dark:text-white">{designation.department}</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-lg dark:bg-yellow-900/30 mr-3">
              <Users className="text-yellow-600 dark:text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Experience Required</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {designation.minExperience} - {designation.maxExperience} years
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-pink-100 p-2 rounded-lg dark:bg-pink-900/30 mr-3">
              <Calendar className="text-pink-600 dark:text-pink-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(designation.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-indigo-100 p-2 rounded-lg dark:bg-indigo-900/30 mr-3">
              <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(designation.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}