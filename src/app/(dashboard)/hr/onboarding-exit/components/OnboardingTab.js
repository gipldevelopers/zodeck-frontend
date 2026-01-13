"use client";

import { useState } from "react";
import { CheckSquare, FileText, ClipboardList, MessageSquare } from "lucide-react";
import PreJoiningChecklistTab from "./onboarding/PreJoiningChecklistTab";
import DocumentCollectionTab from "./onboarding/DocumentCollectionTab";
import TaskAssignmentTab from "./onboarding/TaskAssignmentTab";
import OnboardingSurveyTab from "./onboarding/OnboardingSurveyTab";

export default function OnboardingTab() {
  const [activeSubTab, setActiveSubTab] = useState("checklist");

  const subTabs = [
    {
      id: "checklist",
      label: "Pre-joining Checklist",
      icon: <CheckSquare size={16} />,
    },
    {
      id: "documents",
      label: "Document Collection",
      icon: <FileText size={16} />,
    },
    {
      id: "tasks",
      label: "Task Assignment",
      icon: <ClipboardList size={16} />,
    },
    {
      id: "survey",
      label: "Survey Form",
      icon: <MessageSquare size={16} />,
    },
  ];

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "checklist":
        return <PreJoiningChecklistTab />;
      case "documents":
        return <DocumentCollectionTab />;
      case "tasks":
        return <TaskAssignmentTab />;
      case "survey":
        return <OnboardingSurveyTab />;
      default:
        return <PreJoiningChecklistTab />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-lg px-2">
        <div className="flex flex-wrap gap-1">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all border-b-2 ${
                activeSubTab === tab.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-800 shadow-sm"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 dark:hover:border-brand-600/50"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-tab Content */}
      <div className="mt-4">
        {renderSubTabContent()}
      </div>
    </div>
  );
}
