import React from "react";
// import MonthlyTarget from "@/app/(dashboard)/hr/dashboard/components/MonthlyTarget";
import WelcomeWrap from "./components/WelcomeWrap";
import StatsCard from "./components/StatsCard";
import EmployeeDepartmentChart from "./components/EmployeeDepartmentChart";
import JobApplicants from "./components/JobApplicants";
import Schedules from "./components/Schedules";
import AttendanceOverview from "./components/AttendanceOverview";
import Birthdays from "./components/Birthdays";
import ClockInOut from "./components/ClockInOut";
import EmployeesTable from "./components/EmployeesTable";

export const metadata = {
  title: "HR Dashboard | HRMS Portal",
  description: "HR Dashboard for HRMS Portal",
};

export default function HrDashboard() {
  // Sample data - in a real app, this would come from your state management or API
  const userData = {
    userName: "Adrian",
    pendingApprovals: 21,
    leaveRequests: 14,
    avatarUrl: "/images/users/default-avatar.png", // Make sure to add this image to your public folder
  };

  const statsData = [
    {
      title: "Attendance Overview",
      value: "120/154",
      comparison: "+2.1%",
      trend: "up",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      iconBgColor: "bg-blue-500",
      href: "/hr/attendance",
    },
    {
      title: "Total Projects",
      value: "90/125",
      comparison: "-2.1%",
      trend: "down",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
      ),
      iconBgColor: "bg-gray-600",
      href: "/hr/projects",
    },
    {
      title: "Total Clients",
      value: "69/86",
      comparison: "-11.2%",
      trend: "down",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      iconBgColor: "bg-blue-400",
      href: "/hr/clients",
    },
    {
      title: "Total Tasks",
      value: "225/280",
      comparison: "+11.2%",
      trend: "up",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      iconBgColor: "bg-pink-500",
      href: "/hr/tasks",
    },
    {
      title: "Earnings",
      value: "$21,445",
      comparison: "+10.2%",
      trend: "up",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      iconBgColor: "bg-purple-500",
      href: "/hr/expenses",
    },
    {
      title: "Profit This Week",
      value: "$5,544",
      comparison: "+2.1%",
      trend: "up",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      iconBgColor: "bg-red-500",
      href: "/hr/transactions",
    },
    {
      title: "Job Applicants",
      value: "98",
      comparison: "+2.1%",
      trend: "up",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      iconBgColor: "bg-green-500",
      href: "/hr/recruitment",
    },
    {
      title: "New Hire",
      value: "45/48",
      comparison: "-11.2%",
      trend: "down",
      icon: (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      iconBgColor: "bg-gray-800",
      href: "/hr/employees",
    },
  ];

  return (
      <div className="space-y-6">
        {/* Welcome Wrap Section */}
        <WelcomeWrap
          userName={userData.userName}
          pendingApprovals={userData.pendingApprovals}
          leaveRequests={userData.leaveRequests}
          avatarUrl={userData.avatarUrl}
        />

        {/* Stats + Chart in One Row */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
          {/* Stats Cards */}
          <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {statsData.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                comparison={stat.comparison}
                trend={stat.trend}
                icon={stat.icon}
                iconBgColor={stat.iconBgColor}
                href={stat.href}
              />
            ))}
          </div>

          {/* Employee Department Chart */}
          <div className="xl:col-span-4 h-full">
            <EmployeeDepartmentChart />
          </div>
        </div>

        {/* New Row for Additional Components */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Job Applicants Component */}
          <div className="w-full">
            <JobApplicants />
          </div>

          {/* Schedules Component */}
          <div className="w-full">
            <Schedules />
          </div>
          {/* Attendance Overview Component */}
          <div className="w-full">
            <AttendanceOverview />
          </div>

          {/* Birthdays Component */}
          <div className="w-full">
            <Birthdays />
          </div>
        
          {/* ClockInOut Component */}
          <div className="w-full sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <ClockInOut />
          </div>

          {/* Employees Table Component */}
          <div className="w-full sm:col-span-2 lg:col-span-2 xl:col-span-2">
            <EmployeesTable />
          </div>

        </div>
      </div>
  );
}

