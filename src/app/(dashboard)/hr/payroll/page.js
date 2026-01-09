// src/app/(dashboard)/hr/payroll/page.js
"use client";
import Breadcrumb from '@/components/common/Breadcrumb';
import PayrollStatsCards from './components/PayrollStatsCards';
import RecentPayrollRuns from './components/RecentPayrollRuns';

export default function PayrollDashboard() {
  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-4 sm:p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        // pageTitle="Payroll Dashboard"
        rightContent={null}
      />

      {/* Stats Cards */}
      <PayrollStatsCards />

      {/* Recent Payroll Runs */}
      <div className="bg-white rounded-lg shadow dark:bg-gray-800 mt-6">
        <RecentPayrollRuns />
      </div>
    </div>
  );
}