"use client";

import { useState } from "react";
import { BarChart3, Users, TrendingDown, Calendar, CalendarDays } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

// Import tab components
import HeadcountReportTab from "./components/HeadcountReportTab";
import AttritionReportTab from "./components/AttritionReportTab";
import AttendanceSummaryTab from "./components/AttendanceSummaryTab";
import LeaveUtilizationTab from "./components/LeaveUtilizationTab";

export default function ReportsAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("headcount");

  const tabs = [
    {
      id: "headcount",
      label: "Headcount Report",
      icon: <Users size={18} />,
    },
    {
      id: "attrition",
      label: "Attrition Report",
      icon: <TrendingDown size={18} />,
    },
    {
      id: "attendance",
      label: "Attendance Summary",
      icon: <Calendar size={18} />,
    },
    {
      id: "leave",
      label: "Leave Utilization",
      icon: <CalendarDays size={18} />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "headcount":
        return <HeadcountReportTab />;
      case "attrition":
        return <AttritionReportTab />;
      case "attendance":
        return <AttendanceSummaryTab />;
      case "leave":
        return <LeaveUtilizationTab />;
      default:
        return <HeadcountReportTab />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-3 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
            <BarChart3 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              HR Reports & Analytics
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              HR-focused insights and analytics
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
