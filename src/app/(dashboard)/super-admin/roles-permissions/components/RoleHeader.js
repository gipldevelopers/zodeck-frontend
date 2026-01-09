// src/app/(dashboard)/super-admin/roles-permissions/components/RoleHeader.js
import { useRouter } from "next/navigation";
import { Edit, Trash2, Loader } from "lucide-react";

const RoleHeader = ({ role, loading = false }) => {
  const router = useRouter();

  // Show loading state
  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center py-8">
            <Loader className="animate-spin text-blue-600 dark:text-blue-400" size={24} />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading role information...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if role is null/undefined
  if (!role) {
    return (
      <div className="w-full p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Role Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The requested role could not be loaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {role.name || "Unnamed Role"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {role.description || "No description provided."}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                role.status === "Active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}>
                {role.status || "Unknown"}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Created: {role.createdDate || "Unknown date"}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {role.userCount || 0} users
              </span>
              {role.isSystem && (
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  System Role
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push(`/super-admin/roles-permissions/edit/${role.id}`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <Edit size={16} />
              Edit Role
            </button>
            {!role.isSystem && (
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                <Trash2 size={16} />
                Delete Role
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleHeader;