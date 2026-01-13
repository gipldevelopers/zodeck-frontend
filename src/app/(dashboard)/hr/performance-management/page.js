"use client";

import { useState } from "react";
import { Target, Settings, CheckCircle, MessageSquare, ShieldCheck } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

// Import tab components
import AppraisalCyclesTab from "./components/AppraisalCyclesTab";
import GoalCompletionTab from "./components/GoalCompletionTab";
import ManagerFeedbackTab from "./components/ManagerFeedbackTab";
import HRModerationTab from "./components/HRModerationTab";

export default function PerformanceManagementPage() {
  const [activeTab, setActiveTab] = useState("cycles");

  const tabs = [
    {
      id: "cycles",
      label: "Appraisal Cycles",
      icon: <Settings size={18} />,
    },
    {
      id: "goals",
      label: "Goal Completion",
      icon: <CheckCircle size={18} />,
    },
    {
      id: "feedback",
      label: "Manager Feedback",
      icon: <MessageSquare size={18} />,
    },
    {
      id: "moderation",
      label: "HR Moderation",
      icon: <ShieldCheck size={18} />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "cycles":
        return <AppraisalCyclesTab />;
      case "goals":
        return <GoalCompletionTab />;
      case "feedback":
        return <ManagerFeedbackTab />;
      case "moderation":
        return <HRModerationTab />;
      default:
        return <AppraisalCyclesTab />;
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
            <Target className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Performance Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Oversee performance cycles and reviews
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
