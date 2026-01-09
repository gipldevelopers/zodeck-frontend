import { Activity } from 'lucide-react';

export default function RecentActivityCard({ recentActivity }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
      </div>
      <div className="p-6">
        <ul className="space-y-4">
          {recentActivity && recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <li key={index} className="flex items-start animate-fadeIn">
                <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/30 mr-3">
                  <Activity className="text-blue-600 dark:text-blue-400" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.person} was {activity.action.toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
          )}
        </ul>
      </div>
    </div>
  );
}