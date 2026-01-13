import React from "react";
import { Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

const LeaveRequestsDashboardTable = ({ requests = [] }) => {
  const leaveRequests = requests || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'rejected':
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return "Approved";
      case 'rejected':
        return "Rejected";
      default:
        return "Pending";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Recent Leave Requests
        </h2>
        <button className="text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Employee</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Duration</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Days</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="pb-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaveRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No recent leave requests found
                </td>
              </tr>
            ) : (
              leaveRequests.map((request) => (
                <tr key={request.id || request.publicId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4">
                    <div className="flex items-center">
                      <img
                        src={request.employee?.profileImage || "/images/users/user-default.png"}
                        alt={request.employee?.name || "Employee"}
                        className="h-8 w-8 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.employee?.name || "-"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {request.employee?.department || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-900 dark:text-white">{request.type || "-"}</td>
                  <td className="py-4 text-sm text-gray-900 dark:text-white">
                    {request.duration || (request.startDate && request.endDate ? `${request.startDate} to ${request.endDate}` : "-")}
                  </td>
                  <td className="py-4 text-sm text-gray-900 dark:text-white">{request.days || "-"}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{getStatusText(request.status)}</span>
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestsDashboardTable;