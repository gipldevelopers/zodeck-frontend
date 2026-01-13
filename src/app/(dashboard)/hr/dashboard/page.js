"use client";

import React, { useEffect, useRef, useState } from "react";
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

export default function HrDashboard() {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const elementRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elementId = entry.target.getAttribute('data-animate-id');
            if (elementId) {
              setVisibleElements((prev) => new Set(prev).add(elementId));
            }
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px', // Start animation slightly before element is fully visible
      }
    );

    // Use setTimeout to ensure all refs are set after render
    const timeoutId = setTimeout(() => {
      // Observe all elements with data-animate-id
      Object.values(elementRefs.current).forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);
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
      iconBgColor: "bg-brand-500", // Primary green-teal
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
      iconBgColor: "bg-indigo-500", // Professional indigo
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
      iconBgColor: "bg-accent-500", // Deep teal-blue
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
      iconBgColor: "bg-violet-500", // Professional violet
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
      iconBgColor: "bg-amber-500", // Professional amber/gold
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
      iconBgColor: "bg-emerald-500", // Professional emerald green
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
      iconBgColor: "bg-brand-400", // Lighter green-teal variant
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
      iconBgColor: "bg-slate-600", // Professional slate gray
      href: "/hr/employees",
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Wrap Section */}
      <div
        ref={(el) => (elementRefs.current['welcome'] = el)}
        data-animate-id="welcome"
        className={`scroll-fade-in ${visibleElements.has('welcome') ? 'animate-fade-in' : 'opacity-0'}`}
      >
        <WelcomeWrap
          userName={userData.userName}
          pendingApprovals={userData.pendingApprovals}
          leaveRequests={userData.leaveRequests}
          avatarUrl={userData.avatarUrl}
        />
      </div>

      {/* Stats + Chart in One Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        {/* Stats Cards */}
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {statsData.map((stat, index) => {
            const elementId = `stat-${index}`;
            return (
              <div
                key={index}
                ref={(el) => (elementRefs.current[elementId] = el)}
                data-animate-id={elementId}
                className={`scroll-fade-in ${visibleElements.has(elementId) ? 'animate-fade-in' : 'opacity-0'}`}
                style={visibleElements.has(elementId) ? { animationDelay: `${index * 50}ms` } : {}}
              >
                <StatsCard
                  title={stat.title}
                  value={stat.value}
                  comparison={stat.comparison}
                  trend={stat.trend}
                  icon={stat.icon}
                  iconBgColor={stat.iconBgColor}
                  href={stat.href}
                />
              </div>
            );
          })}
        </div>

        {/* Employee Department Chart */}
        <div
          ref={(el) => (elementRefs.current['chart'] = el)}
          data-animate-id="chart"
          className={`xl:col-span-4 h-full scroll-fade-in ${visibleElements.has('chart') ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <EmployeeDepartmentChart />
        </div>
      </div>

      {/* Secondary Components Row - Two per row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Attendance Overview Component - First */}
        <div
          ref={(el) => (elementRefs.current['attendance'] = el)}
          data-animate-id="attendance"
          className={`w-full scroll-fade-in ${visibleElements.has('attendance') ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <AttendanceOverview />
        </div>

        {/* Job Applicants Component */}
        <div
          ref={(el) => (elementRefs.current['job-applicants'] = el)}
          data-animate-id="job-applicants"
          className={`w-full scroll-fade-in ${visibleElements.has('job-applicants') ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <JobApplicants />
        </div>

        {/* Schedules Component */}
        <div
          ref={(el) => (elementRefs.current['schedules'] = el)}
          data-animate-id="schedules"
          className={`w-full scroll-fade-in ${visibleElements.has('schedules') ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <Schedules />
        </div>

        {/* Birthdays Component */}
        <div
          ref={(el) => (elementRefs.current['birthdays'] = el)}
          data-animate-id="birthdays"
          className={`w-full scroll-fade-in ${visibleElements.has('birthdays') ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <Birthdays />
        </div>
      </div>

      {/* Bottom Row - Larger Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* ClockInOut Component */}
        <div
          ref={(el) => (elementRefs.current['clock-in-out'] = el)}
          data-animate-id="clock-in-out"
          className={`w-full scroll-fade-in ${visibleElements.has('clock-in-out') ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <ClockInOut />
        </div>

        {/* Employees Table Component */}
        <div
          ref={(el) => (elementRefs.current['employees-table'] = el)}
          data-animate-id="employees-table"
          className={`w-full scroll-fade-in ${visibleElements.has('employees-table') ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <EmployeesTable />
        </div>
      </div>
    </div>
  );
}

