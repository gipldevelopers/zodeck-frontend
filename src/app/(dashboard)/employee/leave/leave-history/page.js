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
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Leave History"
        subtitle="View your past and pending leave requests"
      />

      {/* Leave Overview Cards */}
      <div className="mt-6">
        <LeaveOverviewCards selectedMonth={selectedMonth} />
      </div>

      {/* Leave History Table */}
      <div className="mt-6">
        <LeaveHistoryTable />
      </div>
    </div>
  );
}
