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
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-white hover:bg-brand-600 transition-all shadow-sm hover:shadow-md font-semibold"
        >
          <PlusCircle size={18} /> Add Department
        </Link>
      );
    } else if (activeTab === "designations") {
      return (
        <Link
          href="/hr/organization-management/designations/add"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-white hover:bg-brand-600 transition-all shadow-sm hover:shadow-md font-semibold"
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
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-500/20 dark:to-brand-500/10 rounded-xl shadow-sm">
            <GitBranch className="w-7 h-7 text-brand-600 dark:text-brand-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Organization Structure
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage company hierarchy, departments, designations, and reporting lines
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
