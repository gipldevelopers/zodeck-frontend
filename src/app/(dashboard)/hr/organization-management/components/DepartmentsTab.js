"use client";

import { useState, useEffect } from "react";
import { Building2, CheckCircle2, XCircle, Users } from "lucide-react";
import { organizationService } from "@/services/hr-services/organization.service";
import { toast } from "react-hot-toast";
import DepartmentTableWrapper from "./DepartmentTableWrapper";

export default function DepartmentsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await organizationService.getDepartmentStats();
        const statsData = response.success ? response.data : response;
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching department stats:", error);
        toast.error("Failed to load department statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Departments",
      value: stats?.totalDepartments || 0,
      icon: <Building2 className="text-blue-500" size={24} />,
      bgColor: "bg-blue-50 dark:bg-blue-900/10",
      borderColor: "border-blue-100 dark:border-blue-800",
    },
    {
      title: "Active Departments",
      value: stats?.activeDepartments || stats?.byStatus?.active || 0,
      icon: <CheckCircle2 className="text-green-500" size={24} />,
      bgColor: "bg-green-50 dark:bg-green-900/10",
      borderColor: "border-green-100 dark:border-green-800",
    },
    {
      title: "Inactive Departments",
      value: stats?.inactiveDepartments || stats?.byStatus?.inactive || 0,
      icon: <XCircle className="text-red-500" size={24} />,
      bgColor: "bg-red-50 dark:bg-red-900/10",
      borderColor: "border-red-100 dark:border-red-800",
    },
    {
      title: "Total Employees",
      value: stats?.totalEmployees || 0,
      icon: <Users className="text-purple-500" size={24} />,
      bgColor: "bg-purple-50 dark:bg-purple-900/10",
      borderColor: "border-purple-100 dark:border-purple-800",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 p-5 rounded-xl border ${card.borderColor} shadow-sm transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Department Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <DepartmentTableWrapper />
      </div>
    </div>
  );
}
