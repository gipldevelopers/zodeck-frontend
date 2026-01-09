// src/app/(dashboard)/hr/payroll/components/PayrollStatsCards.js
"use client";
import { IndianRupee, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { payrollService } from '../../../../../services/hr-services/payroll.service';

export default function PayrollStatsCards() {
  const [statsData, setStatsData] = useState({
    totalPayroll: 0,
    employeesPaid: 0,
    pendingPayments: 0,
    averageSalary: 0,
    totalGrowth: 0,
    employeesGrowth: 0,
    pendingGrowth: 0,
    salaryGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await payrollService.getDashboardStats();
        setStatsData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching payroll stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4 md:p-6 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-6 text-left">
        <p className="text-red-600 dark:text-red-400">Error loading payroll stats: {error}</p>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Payroll",
      value: payrollService.formatCurrency(statsData.totalPayroll),
      icon: IndianRupee,
      iconBg: "bg-gradient-to-r from-green-500 to-green-400",
      iconColor: "text-white",
      growth: statsData.totalGrowth || 0,
      growthColor: (statsData.totalGrowth || 0) >= 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      cardBg: "bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Employees Paid",
      value: statsData.employeesPaid,
      icon: Users,
      iconBg: "bg-gradient-to-r from-blue-500 to-blue-400",
      iconColor: "text-white",
      growth: statsData.employeesGrowth || 0,
      growthColor: (statsData.employeesGrowth || 0) >= 0 ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      cardBg: "bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Pending Payments",
      value: statsData.pendingPayments,
      icon: Clock,
      iconBg: "bg-gradient-to-r from-yellow-500 to-yellow-400",
      iconColor: "text-white",
      growth: statsData.pendingGrowth || 0,
      growthColor: (statsData.pendingGrowth || 0) <= 0 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      cardBg: "bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    },
    {
      title: "Average Salary",
      value: payrollService.formatCurrency(statsData.averageSalary),
      icon: CheckCircle,
      iconBg: "bg-gradient-to-r from-purple-500 to-purple-400",
      iconColor: "text-white",
      growth: statsData.salaryGrowth || 0,
      growthColor: (statsData.salaryGrowth || 0) >= 0 ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      cardBg: "bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900",
      hoverEffect: "hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 sm:p-4 md:p-6 cursor-pointer ${card.cardBg} ${card.hoverEffect}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center overflow-hidden text-left">
              <div className={`${card.iconBg} rounded-lg sm:rounded-xl p-2 sm:p-3 mr-3 sm:mr-4 shadow-md`}>
                <card.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] xs:text-xs font-semibold text-gray-600 dark:text-gray-300 mb-0.5 xs:mb-1 uppercase tracking-wide truncate ml-0">
                  {card.title}
                </p>
                <h4 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">
                  {card.value}
                </h4>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2 sm:mt-4">
            <span className={`${card.growthColor} text-[10px] xs:text-xs font-medium px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-full flex items-center`}>
              <TrendingUp className={`h-2.5 w-2.5 xs:h-3 xs:w-3 mr-0.5 xs:mr-1 ${card.growth < 0 ? 'rotate-180 transition-transform' : ''}`} />
              {card.growth > 0 ? '+' : ''}{card.growth}%
            </span>
            <span className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 ml-1 xs:ml-2 truncate">
              from last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
