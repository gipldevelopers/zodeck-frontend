// src\app\(dashboard)\hr\employees\components\EmployeeStatsCards.js
"use client";

import { Users, UserCheck, UserX, UserPlus, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import employeeService from "@/services/hr-services/employeeService"; // adjust path if needed

export default function EmployeeStatsCards() {
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    newJoiners: 0,
    totalGrowth: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await employeeService.getEmployeeStats();

        const data = response.data;

        // TEMP LOGIC (until backend provides these)
        const newJoiners = Math.round(data.totalEmployees * 0.15);
        const totalGrowth = data.totalEmployees
          ? ((newJoiners / data.totalEmployees) * 100).toFixed(2)
          : 0;

        setStatsData({
          totalEmployees: data.totalEmployees,
          activeEmployees: data.activeEmployees,
          inactiveEmployees: data.inactiveEmployees,
          newJoiners,
          totalGrowth
        });
      } catch (error) {
        console.error("Failed to load employee stats:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Employees",
      value: statsData.totalEmployees,
      icon: Users,
      iconBg: "bg-gradient-to-r from-gray-800 to-gray-600",
      growthColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    },
    {
      title: "Active Employees",
      value: statsData.activeEmployees,
      icon: UserCheck,
      iconBg: "bg-gradient-to-r from-green-500 to-green-400",
      growthColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    },
    {
      title: "Inactive Employees",
      value: statsData.inactiveEmployees,
      icon: UserX,
      iconBg: "bg-gradient-to-r from-red-500 to-red-400",
      growthColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    },
    {
      title: "New Joiners",
      value: statsData.newJoiners,
      icon: UserPlus,
      iconBg: "bg-gradient-to-r from-blue-500 to-blue-400",
      growthColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 cursor-pointer
                     bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                     hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden">
              <div className={`${card.iconBg} rounded-xl p-3 mr-4 shadow-md`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  {card.title}
                </p>
                <h4 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {card.value.toLocaleString()}
                </h4>
              </div>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <span
              className={`${card.growthColor} text-xs font-medium px-2.5 py-1 rounded-full flex items-center`}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              +{statsData.totalGrowth}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
