"use client";

import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LeavesStatsCards({ selectedMonth }) {
  // Mock data
  const [statsData, setStatsData] = useState({
    totalLeaves: 20,
    leavesTaken: 5,
    remainingLeaves: 15,
    pendingLeaves: 2
  });

  // Simulate data loading per selected month
  useEffect(() => {
    const timer = setTimeout(() => {
      // Randomly simulate some changes for demo
      setStatsData({
        totalLeaves: 20,
        leavesTaken: Math.floor(Math.random() * 10),
        remainingLeaves: Math.floor(Math.random() * 10) + 5,
        pendingLeaves: Math.floor(Math.random() * 5)
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedMonth]);

  const cards = [
    {
      title: "Total Leaves",
      value: statsData.totalLeaves,
      icon: Calendar,
      iconBg: "bg-gradient-to-r from-gray-800 to-gray-600",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900",
      description: "Total leave entitlement"
    },
    {
      title: "Leaves Taken",
      value: statsData.leavesTaken,
      icon: CheckCircle,
      iconBg: "bg-gradient-to-r from-green-500 to-green-400",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900",
      description: "Approved leaves used"
    },
    {
      title: "Remaining Leaves",
      value: statsData.remainingLeaves,
      icon: Clock,
      iconBg: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900",
      description: "Leaves still available"
    },
    {
      title: "Pending Leaves",
      value: statsData.pendingLeaves,
      icon: XCircle,
      iconBg: "bg-gradient-to-r from-red-500 to-red-400",
      iconColor: "text-white",
      cardBg: "bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900",
      description: "Leaves awaiting approval"
    }
  ];

  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Leave Overview for {selectedMonth}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Summary of your leaves
        </p>
      </div>

      {/* Leave Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4 md:p-6 cursor-pointer ${card.cardBg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center overflow-hidden">
                <div className={`${card.iconBg} rounded-lg sm:rounded-xl p-2 sm:p-3 mr-3 sm:mr-4 shadow-md`}>
                  <card.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] xs:text-xs font-semibold text-gray-600 dark:text-gray-300 mb-0.5 xs:mb-1 uppercase tracking-wide truncate">
                    {card.title}
                  </p>
                  <h4 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
                    {card.value.toLocaleString()}
                  </h4>
                  <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
