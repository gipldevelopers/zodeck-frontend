"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react";
import { payrollDashboardService } from "@/services/payroll-role-services/dashboard.service";

export default function StatutoryComplianceWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const response = await payrollDashboardService.getDashboard({
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear(),
        });
        // Handle response structure: response.data or response directly
        const dashboardData = response.data || response;
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching compliance status:", error);
        // Set empty data on error so UI doesn't break
        setData({
          compliance: {
            pf: "PENDING",
            gratuity: "PENDING",
            esi: "PENDING",
            tds: "PENDING",
          },
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "COMPLIANT":
        return {
          label: "Compliant",
          icon: <CheckCircle2 className="w-5 h-5" />,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          badgeColor: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        };
      case "PENDING":
        return {
          label: "Pending",
          icon: <Clock className="w-5 h-5" />,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        };
      case "WARNING":
        return {
          label: "Warning",
          icon: <AlertCircle className="w-5 h-5" />,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          badgeColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
        };
      case "OVERDUE":
        return {
          label: "Overdue",
          icon: <AlertCircle className="w-5 h-5" />,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          badgeColor: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        };
      default:
        return {
          label: "Pending",
          icon: <Clock className="w-5 h-5" />,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-50 dark:bg-gray-700",
          borderColor: "border-gray-200 dark:border-gray-600",
          badgeColor: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300",
        };
    }
  };

  const complianceItems = [
    {
      name: "PF Calculation",
      status: data?.compliance?.pf || "PENDING",
      description: "Provident Fund",
    },
    {
      name: "Gratuity Status",
      status: data?.compliance?.gratuity || "PENDING",
      description: "Gratuity calculations",
    },
    {
      name: "ESI Calculation",
      status: data?.compliance?.esi || "PENDING",
      description: "Employee State Insurance",
    },
    {
      name: "TDS Calculation",
      status: data?.compliance?.tds || "PENDING",
      description: "Tax Deducted at Source",
    },
  ];

  const compliantCount = complianceItems.filter(
    (item) => item.status === "COMPLIANT"
  ).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
          <Shield className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Statutory Compliance Status
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {compliantCount} / {complianceItems.length} Compliant
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {complianceItems.map((item, index) => {
          const config = getStatusConfig(item.status);
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 ${config.borderColor} ${config.bgColor} transition-all hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${config.color} bg-white dark:bg-gray-800`}>
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badgeColor}`}
                >
                  {config.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
