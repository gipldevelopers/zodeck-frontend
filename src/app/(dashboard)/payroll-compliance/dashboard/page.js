"use client";

import React from "react";
import Breadcrumb from '@/components/common/Breadcrumb';
import { BarChart3 } from "lucide-react";
import PayrollStatusWidget from './components/PayrollStatusWidget';
import PayrollExceptionsWidget from './components/PayrollExceptionsWidget';
import StatutoryComplianceWidget from './components/StatutoryComplianceWidget';
import UpcomingActionsWidget from './components/UpcomingActionsWidget';
import GettingStartedCard from './components/GettingStartedCard';
import ComplianceGreetingCard from './components/ComplianceGreetingCard';

export default function PayrollComplianceDashboard() {
  const breadcrumbItems = [
    { label: "Payroll Compliance", href: "/payroll-compliance" },
    { label: "Dashboard", href: "/payroll-compliance/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/30 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        {/* Greeting Card */}
        <ComplianceGreetingCard />

        {/* Getting Started Card */}
        <GettingStartedCard />

        {/* Main Dashboard Widgets - 2x2 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PayrollStatusWidget />
          <PayrollExceptionsWidget />
        </div>

        {/* Statutory Compliance & Upcoming Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatutoryComplianceWidget />
          <UpcomingActionsWidget />
        </div>
      </div>
    </div>
  );
}
