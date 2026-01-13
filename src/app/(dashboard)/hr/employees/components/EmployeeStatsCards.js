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
      iconBg: "bg-gradient-to-br from-brand-500 to-brand-600",
      growthColor: "bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400"
    },
    {
      title: "Active Employees",
      value: statsData.activeEmployees,
      icon: UserCheck,
      iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      growthColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
    },
    {
      title: "Inactive Employees",
      value: statsData.inactiveEmployees,
      icon: UserX,
      iconBg: "bg-gradient-to-br from-rose-500 to-rose-600",
      growthColor: "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
    },
    {
      title: "New Joiners",
      value: statsData.newJoiners,
      icon: UserPlus,
      iconBg: "bg-gradient-to-br from-accent-500 to-accent-600",
      growthColor: "bg-accent-50 text-accent-700 dark:bg-accent-500/20 dark:text-accent-400"
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
                     bg-white dark:bg-gray-800
                     hover:shadow-xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300"
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
