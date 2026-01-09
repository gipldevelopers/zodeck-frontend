"use client";

import { useState } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";
import TeamCalendar from "../components/TeamCalendar";

export default function TeamCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 p-6">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Team Calendar"
        subtitle="View team leaves and schedule"
        rightContent={
          <BreadcrumbRightContent
            selectedDate={selectedMonth}
            setSelectedDate={setSelectedMonth}
          />
        }
      />

      {/* Calendar Component */}
      <div className="mt-6">
        <TeamCalendar selectedMonth={selectedMonth} />
      </div>
    </div>
  );
}
