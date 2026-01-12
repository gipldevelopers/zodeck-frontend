"use client";

import { useState } from "react";
import { Building, Briefcase, Network, GitBranch, PlusCircle } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Link from "next/link";
import DepartmentsTab from "./components/DepartmentsTab";
import DesignationsTab from "./components/DesignationsTab";
import ReportingStructureTab from "./components/ReportingStructureTab";
import OrgChartTab from "./components/OrgChartTab";

export default function OrganizationManagementPage() {
  const [activeTab, setActiveTab] = useState("departments");

  const tabs = [
    {
      id: "departments",
      label: "Departments",
      icon: <Building size={18} />,
      component: <DepartmentsTab />,
    },
    {
      id: "designations",
      label: "Designations",
      icon: <Briefcase size={18} />,
      component: <DesignationsTab />,
    },
    {
      id: "reporting-structure",
      label: "Reporting Structure",
      icon: <Network size={18} />,
      component: <ReportingStructureTab />,
    },
    {
      id: "org-chart",
      label: "Org Chart View",
      icon: <GitBranch size={18} />,
      component: <OrgChartTab />,
    },
  ];

  const getRightContent = () => {
    if (activeTab === "departments") {
      return (
        <Link
          href="/hr/organization-management/departments/add"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Add Department
        </Link>
      );
    } else if (activeTab === "designations") {
      return (
        <Link
          href="/hr/organization-management/designations/add"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Add Designation
        </Link>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-3 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "HR", href: "/hr" },
          { label: "Organization Management", href: "/hr/organization-management" },
        ]}
        rightContent={getRightContent()}
      />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <GitBranch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Organization Structure
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage company hierarchy, departments, designations, and reporting lines
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
