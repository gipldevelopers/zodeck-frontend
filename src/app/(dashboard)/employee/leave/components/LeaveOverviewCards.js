"use client";

import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import EmployeeLeaveService from "@/services/employee/leave.service";

export default function LeaveOverviewCards({ selectedMonth }) {
  const [statsData, setStatsData] = useState({
    totalLeaves: 0,
    leavesTaken: 0,
    remainingLeaves: 0,
    pendingLeaves: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [selectedMonth]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await EmployeeLeaveService.getDashboardStats();
      // Assuming the API returns these fields or mapping is needed.
      // For now using the data as is or providing defaults
      setStatsData({
        totalLeaves: data.totalLeaves || 0,
        leavesTaken: data.leavesTaken || 0,
        remainingLeaves: data.remainingLeaves || 0,
        pendingLeaves: data.pendingLeaves || 0
      });
    } catch (error) {
      console.error("Failed to fetch leave stats", error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Leaves", value: statsData.totalLeaves, icon: Calendar, iconBg: "bg-gradient-to-r from-gray-800 to-gray-600", cardBg: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900", description: "Total leave entitlement" },
    { title: "Leaves Taken", value: statsData.leavesTaken, icon: CheckCircle, iconBg: "bg-gradient-to-r from-green-500 to-green-400", cardBg: "bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900", description: "Approved leaves used" },
    { title: "Remaining Leaves", value: statsData.remainingLeaves, icon: Clock, iconBg: "bg-gradient-to-r from-yellow-500 to-yellow-400", cardBg: "bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900", description: "Leaves still available" },
    { title: "Pending Leaves", value: statsData.pendingLeaves, icon: XCircle, iconBg: "bg-gradient-to-r from-red-500 to-red-400", cardBg: "bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-gray-900", description: "Leaves awaiting approval" },
  ];

  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="mb-6">
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card, index) => (
          <div key={index} className={`rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 cursor-pointer ${card.cardBg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
            <div className="flex items-center">
              <div className={`${card.iconBg} rounded-lg p-3 mr-4 shadow-md`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">{card.title}</p>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white">{card.value}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
