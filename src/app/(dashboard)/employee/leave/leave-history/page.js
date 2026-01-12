"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import LeaveOverviewCards from "../components/LeaveOverviewCards";
import LeaveHistoryTable from "../components/LeaveHistoryTable";

export default function LeaveHistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb
          customTitle="Leave History"
          subtitle="View your past and pending leave requests"
        />

        <LeaveOverviewCards selectedMonth={selectedMonth} />

        <LeaveHistoryTable />
      </div>
    </div>
  );
}
