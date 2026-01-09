import React from "react";
import LeaveStatsCards from "./components/LeaveStatsCards";
import LeaveAnalytics from "./components/LeaveAnalytics";
import LeaveRequestsTable from "./components/LeaveRequestsDashboardTable";
import UpcomingHolidays from "./components/UpcomingHolidays";
import DepartmentLeaveChart from "./components/DepartmentLeaveChart";
import NextHoliday from "./components/NextHoliday";
import LeaveRequestsDashboardTable from "./components/LeaveRequestsDashboardTable";

export const metadata = {
  title: "Leave Management | HRMS Portal",
  description: "Manage and track employee leaves",
};

export default function LeaveDashboard() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Stats Cards and Next Holiday Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats Cards - 8 columns */}
        <div className="lg:col-span-8 h-full">
          <LeaveStatsCards />
        </div>

        {/* Next Holiday - 4 columns */}
        <div className="lg:col-span-4 h-full">
          <NextHoliday />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section - 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          <LeaveAnalytics />
          <LeaveRequestsDashboardTable />
        </div>

        {/* Right Section - 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          <UpcomingHolidays />
          <DepartmentLeaveChart />
        </div>
      </div>
    </div>
  );
}