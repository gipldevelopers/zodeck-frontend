"use client";

import { useState } from "react";
import { Briefcase, Calendar, Users, MapPin } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

// Import components
import WorkModeTab from "./components/WorkModeTab";
import ShiftAssignmentTab from "./components/ShiftAssignmentTab";
import RosterPlanningTab from "./components/RosterPlanningTab";
import WorkforceAvailabilityTab from "./components/WorkforceAvailabilityTab";

export default function WorkforceManagementPage() {
  const [activeTab, setActiveTab] = useState("work-mode");

  const tabs = [
    {
      id: "work-mode",
      label: "Work Mode",
      icon: <MapPin size={18} />,
    },
    {
      id: "shift-assignment",
      label: "Shift Assignment",
      icon: <Briefcase size={18} />,
    },
    {
      id: "roster-planning",
      label: "Roster Planning",
      icon: <Calendar size={18} />,
    },
    {
      id: "availability",
      label: "Workforce Availability",
      icon: <Users size={18} />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "work-mode":
        return <WorkModeTab />;
      case "shift-assignment":
        return <ShiftAssignmentTab />;
      case "roster-planning":
        return <RosterPlanningTab />;
      case "availability":
        return <WorkforceAvailabilityTab />;
      default:
        return <WorkModeTab />;
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
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Workforce Management
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage work modes, shift assignments, roster planning, and view workforce availability
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
