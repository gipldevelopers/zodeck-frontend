"use client";

import { useState } from "react";
import { Clock, Calendar, AlertCircle, Timer, Activity, Database } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import DailyAttendanceViewTab from "./components/DailyAttendanceViewTab";
import AttendanceCorrectionsTab from "./components/AttendanceCorrectionsTab";
import LateEarlyTrackingTab from "./components/LateEarlyTrackingTab";
import OvertimeVisibilityTab from "./components/OvertimeVisibilityTab";
import BiometricSyncTab from "./components/BiometricSyncTab";

export default function AttendanceManagementPage() {
  const [activeTab, setActiveTab] = useState("daily-view");

  const tabs = [
    {
      id: "daily-view",
      label: "Daily Attendance View",
      icon: <Calendar size={18} />,
      component: <DailyAttendanceViewTab />,
    },
    {
      id: "corrections",
      label: "Attendance Corrections",
      icon: <AlertCircle size={18} />,
      component: <AttendanceCorrectionsTab />,
    },
    {
      id: "late-early",
      label: "Late / Early Tracking",
      icon: <Clock size={18} />,
      component: <LateEarlyTrackingTab />,
    },
    {
      id: "overtime",
      label: "Overtime Visibility",
      icon: <Timer size={18} />,
      component: <OvertimeVisibilityTab />,
    },
    {
      id: "biometric",
      label: "Biometric Sync Monitoring",
      icon: <Database size={18} />,
      component: <BiometricSyncTab />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-3 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "HR", href: "/hr" },
          { label: "Attendance Management", href: "/hr/attendance" },
        ]}
      />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Attendance Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Monitor and manage employee attendance data with daily views, corrections, late/early tracking, overtime visibility, and biometric sync monitoring
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
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
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
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}
