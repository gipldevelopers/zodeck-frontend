"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";
import LeaveOverviewCards from "../components/LeaveOverviewCards";
import RequestLeaveForm from "../components/RequestLeaveForm";

export default function RequestLeavePage() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    })
  );

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Request Leave"
        subtitle="Submit a new leave request"
        rightContent={
          <BreadcrumbRightContent
            selectedDate={selectedMonth}
            setSelectedDate={setSelectedMonth}
          />
        }
      />

      

      {/* Request Form */}
      <div className="mt-6">
        <RequestLeaveForm />
      </div>
    </div>
  );
}
