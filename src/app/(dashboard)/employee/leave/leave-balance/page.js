"use client";

import { useState, useEffect } from "react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BreadcrumbRightContent from "../components/BreadcrumbRightContent";
import LeaveBalanceCard from "../components/LeaveBalanceCard";
import LeaveOverviewCards from "../components/LeaveOverviewCards";
import EmployeeLeaveService from "@/services/employee/leave.service";

export default function LeaveBalancePage() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long", year: "numeric" })
  );
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveBalance();
  }, []);

  const fetchLeaveBalance = async () => {
    try {
      setLoading(true);
      const response = await EmployeeLeaveService.getLeaveBalance();
      // Assuming response has structure like { leaveTypes: [{name, total, used, remaining}] }
      // or array. Adjusting based on common API patterns. 
      // If response is just the data array:
      const data = response.leaveTypes || response || [];
      setLeaveData(data);
    } catch (error) {
      console.error("Failed to fetch leave balance", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Leave Balance"
        subtitle="Check your remaining leave days"
        rightContent={
          <BreadcrumbRightContent
            selectedDate={selectedMonth}
            setSelectedDate={setSelectedMonth}
          />
        }
      />

      {/* Leave Overview Cards */}
      <div className="mt-6">
        <LeaveOverviewCards selectedMonth={selectedMonth} />
      </div>

      {/* Leave Balance Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-xl"></div>
          ))
        ) : (
          leaveData.length > 0 ? (
            leaveData.map((leave, index) => (
              <LeaveBalanceCard
                key={index}
                type={leave.name || leave.leaveType}
                allocated={leave.total || leave.allocated}
                used={leave.used}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">No leave balance data available.</div>
          )
        )}
      </div>
    </div>
  );
}
