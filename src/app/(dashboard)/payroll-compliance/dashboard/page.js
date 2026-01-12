"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from '@/components/common/Breadcrumb';
import PayrollStatusWidget from './components/PayrollStatusWidget';
import PayrollExceptionsWidget from './components/PayrollExceptionsWidget';
import StatutoryComplianceWidget from './components/StatutoryComplianceWidget';
import UpcomingActionsWidget from './components/UpcomingActionsWidget';

export default function PayrollComplianceDashboard() {
  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Payroll Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Month-wise operational view of payroll readiness, exceptions, and compliance status
          </p>
        </div>
        <div className="text-sm text-gray-400 font-medium">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Main Dashboard Widgets - 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payroll Status */}
        <PayrollStatusWidget />

        {/* Payroll Exceptions */}
        <PayrollExceptionsWidget />
      </div>

      {/* Statutory Compliance & Upcoming Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Statutory Compliance Status */}
        <StatutoryComplianceWidget />

        {/* Upcoming Actions */}
        <UpcomingActionsWidget />
      </div>
    </div>
  );
}
