"use client";

import React, { useState, useEffect } from "react";
import LeaveStatsCards from "./components/LeaveStatsCards";
import LeaveAnalytics from "./components/LeaveAnalytics";
import UpcomingHolidays from "./components/UpcomingHolidays";
import DepartmentLeaveChart from "./components/DepartmentLeaveChart";
import NextHoliday from "./components/NextHoliday";
import LeaveRequestsDashboardTable from "./components/LeaveRequestsDashboardTable";
import { leaveDashboardService } from "@/services/hr-services/leave-dashboard.service";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function LeaveDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [nextHoliday, setNextHoliday] = useState(null);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState(null);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [departmentDistribution, setDepartmentDistribution] = useState(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState("thisWeek");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [
          statsResponse,
          nextHolidayResponse,
          analyticsResponse,
          holidaysResponse,
          requestsResponse,
          distributionResponse,
        ] = await Promise.all([
          leaveDashboardService.getStats(),
          leaveDashboardService.getNextHoliday(),
          leaveDashboardService.getWeeklyAnalytics({ period: analyticsPeriod }),
          leaveDashboardService.getUpcomingHolidays({ limit: 5 }),
          leaveDashboardService.getRecentRequests({ limit: 5 }),
          leaveDashboardService.getDepartmentDistribution(),
        ]);

        // Extract data from responses
        setStats(statsResponse.success ? statsResponse.data : statsResponse);
        setNextHoliday(nextHolidayResponse.success ? nextHolidayResponse.data : nextHolidayResponse);
        setWeeklyAnalytics(analyticsResponse.success ? analyticsResponse.data : analyticsResponse);
        setUpcomingHolidays(holidaysResponse.success ? holidaysResponse.data : holidaysResponse.data || []);
        setRecentRequests(requestsResponse.success ? requestsResponse.data : requestsResponse.data || []);
        setDepartmentDistribution(distributionResponse.success ? distributionResponse.data : distributionResponse);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [analyticsPeriod]);

  const handleAnalyticsPeriodChange = (period) => {
    setAnalyticsPeriod(period);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Stats Cards and Next Holiday Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats Cards - 8 columns */}
        <div className="lg:col-span-8 h-full">
          <LeaveStatsCards stats={stats} />
        </div>

        {/* Next Holiday - 4 columns */}
        <div className="lg:col-span-4 h-full">
          <NextHoliday nextHoliday={nextHoliday} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section - 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          <LeaveAnalytics 
            analytics={weeklyAnalytics} 
            period={analyticsPeriod}
            onPeriodChange={handleAnalyticsPeriodChange}
          />
          <LeaveRequestsDashboardTable requests={recentRequests} />
        </div>

        {/* Right Section - 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          <UpcomingHolidays holidays={upcomingHolidays} />
          <DepartmentLeaveChart distribution={departmentDistribution} />
        </div>
      </div>
    </div>
  );
}