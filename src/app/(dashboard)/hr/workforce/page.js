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
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
