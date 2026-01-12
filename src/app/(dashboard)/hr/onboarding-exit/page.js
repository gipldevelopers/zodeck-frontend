"use client";

import { useState } from "react";
import { UserPlus, LogOut, CheckSquare, FileText, ClipboardList, FileCheck, UserCheck, Package, AlertCircle, MessageSquare } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

// Import tab components
import OnboardingTab from "./components/OnboardingTab";
import SeparationTab from "./components/SeparationTab";

export default function OnboardingExitManagementPage() {
  const [activeTab, setActiveTab] = useState("onboarding");

  const tabs = [
    {
      id: "onboarding",
      label: "Onboarding",
      icon: <UserPlus size={18} />,
    },
    {
      id: "separation",
      label: "Separation",
      icon: <LogOut size={18} />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "onboarding":
        return <OnboardingTab />;
      case "separation":
        return <SeparationTab />;
      default:
        return <OnboardingTab />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-3 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Onboarding & Exit Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage employee entry and exit workflows
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
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
