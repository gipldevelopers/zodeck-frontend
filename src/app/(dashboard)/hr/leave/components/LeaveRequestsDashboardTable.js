import React from "react";
import { Clock, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

const LeaveRequestsDashboardTable = () => {
  const leaveRequests = [
    {
      id: 1,
      employee: "Sarah Johnson",
      department: "Engineering",
      type: "Sick Leave",
      startDate: "2025-01-15",
      endDate: "2025-01-17",
      days: 3,
      status: "pending",
      avatar: "/images/users/user-01.png"
    },
    {
      id: 2,
      employee: "Michael Chen",
      department: "Marketing",
      type: "Vacation",
      startDate: "2025-01-20",
      endDate: "2025-01-25",
      days: 6,
      status: "pending",
      avatar: "/images/users/user-02.png"
    },
    {
      id: 3,
      employee: "Emily Rodriguez",
      department: "Sales",
      type: "Personal Leave",
      startDate: "2025-01-18",
      endDate: "2025-01-18",
      days: 1,
      status: "approved",
      avatar: "/images/users/user-03.png"
    },
    {
      id: 4,
      employee: "David Kim",
      department: "HR",
      type: "Sick Leave",
      startDate: "2025-01-22",
      endDate: "2025-01-24",
      days: 3,
      status: "rejected",
      avatar: "/images/users/user-04.png"
    },
    {
      id: 5,
      employee: "Lisa Wang",
      department: "Operations",
      type: "Maternity Leave",
      startDate: "2025-02-01",
      endDate: "2025-05-01",
      days: 90,
      status: "pending",
      avatar: "/images/users/user-05.jpg"
    }
  ];

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
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
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
            {leaveRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="py-4">
                  <div className="flex items-center">
                    <img
                      src={request.avatar}
                      alt={request.employee}
                      className="h-8 w-8 rounded-full object-cover mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.employee}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {request.department}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-gray-900 dark:text-white">{request.type}</td>
                <td className="py-4 text-sm text-gray-900 dark:text-white">
                  {request.startDate} to {request.endDate}
                </td>
                <td className="py-4 text-sm text-gray-900 dark:text-white">{request.days}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveRequestsDashboardTable;