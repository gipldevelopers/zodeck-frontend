"use client";

import React, { useState } from "react";
import Breadcrumb from '@/components/common/Breadcrumb';
import { FileBarChart } from "lucide-react";
import ReportTypeCards from './components/ReportTypeCards';
import ReportGeneratorWidget from './components/ReportGeneratorWidget';
import GeneratedReportsTable from './components/GeneratedReportsTable';

export default function FinanceReportsPage() {
  const breadcrumbItems = [
    { label: "Finance", href: "/finance-role" },
    { label: "Reports", href: "/finance-role/reports" },
  ];

  const [selectedReportType, setSelectedReportType] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}


        {/* Report Type Cards */}
        <ReportTypeCards 
          selectedReportType={selectedReportType}
          setSelectedReportType={setSelectedReportType}
        />

        {/* Report Generator and Generated Reports - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ReportGeneratorWidget selectedReportType={selectedReportType} />
          </div>
          <div className="lg:col-span-2">
            <GeneratedReportsTable />
          </div>
        </div>
      </div>
    </div>
  );
}
