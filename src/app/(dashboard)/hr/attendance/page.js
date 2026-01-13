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
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-500/20 dark:to-brand-500/10 rounded-xl shadow-sm">
            <Clock className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Attendance Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monitor and manage employee attendance data with daily views, corrections, late/early tracking, overtime visibility, and biometric sync monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 bg-gray-50/50 dark:bg-gray-800/50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all border-b-2 relative ${
                activeTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-800 shadow-sm"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-600/50"
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
