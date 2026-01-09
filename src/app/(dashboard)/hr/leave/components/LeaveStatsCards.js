import React from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';

const LeaveStatsCards = () => {
  const statsData = [
    {
      title: "Requests to Approve",
      value: "12",
      comparison: "+2 from yesterday",
      trend: "up",
      icon: <Clock className="h-5 w-5 text-white" />,
      iconBgColor: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      href: "/hr/leave/approvals",
    },
    {
      title: "Approved This Month",
      value: "24",
      comparison: "+5.2%",
      trend: "up",
      icon: <CheckCircle className="h-5 w-5 text-white" />,
      iconBgColor: "bg-gradient-to-r from-green-500 to-green-400",
      href: "/hr/leave/approved",
    },
    {
      title: "Rejected This Month",
      value: "8",
      comparison: "-2.1%",
      trend: "down",
      icon: <XCircle className="h-5 w-5 text-white" />,
      iconBgColor: "bg-gradient-to-r from-red-500 to-red-400",
      href: "/hr/leave/rejected",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
      {statsData.map((stat, index) => (
        <div key={index} className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col justify-between h-full">
            {/* Icon Row */}
            <div className="flex items-start justify-between mb-4">
              <div className={`rounded-xl p-3 ${stat.iconBgColor} shadow-md flex-shrink-0`}>
                {stat.icon}
              </div>
            </div>

            {/* Title and Value Row */}
            <div className="mb-3">
              <h6 className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2">
                {stat.title}
              </h6>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </h3>
            </div>

            {/* Comparison and Link Row */}
            <div className="flex items-center justify-between mt-auto">
              {stat.comparison && (
                <div className="flex items-center">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center ${stat.trend === 'up'
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.comparison}
                  </span>
                </div>
              )}

              {stat.href && (
                <Link
                  href={stat.href}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-medium ml-2"
                >
                  View Details
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveStatsCards;