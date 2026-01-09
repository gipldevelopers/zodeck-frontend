import React from "react";
import LeaveChart from "./LeaveChart";

const LeaveAnalytics = () => {
  // Sample data for the chart
  const data = [
    { name: 'Mon', approved: 4, rejected: 1, pending: 2 },
    { name: 'Tue', approved: 3, rejected: 2, pending: 3 },
    { name: 'Wed', approved: 5, rejected: 1, pending: 1 },
    { name: 'Thu', approved: 2, rejected: 0, pending: 4 },
    { name: 'Fri', approved: 6, rejected: 2, pending: 2 },
    { name: 'Sat', approved: 1, rejected: 0, pending: 1 },
    { name: 'Sun', approved: 0, rejected: 0, pending: 0 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Weekly Leave Analytics
        </h2>
        <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>

      <LeaveChart data={data} />

      <div className="flex flex-wrap justify-center mt-4 gap-4 sm:gap-6 space-x-0 sm:space-x-6">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Approved</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Rejected</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">Pending</span>
        </div>
      </div>
    </div>
  );
};

export default LeaveAnalytics;