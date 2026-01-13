"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [visibleElements, setVisibleElements] = useState(new Set());
  const elementRefs = useRef({});

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

  // Intersection Observer for scroll-triggered animations
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
  }, [loading]); // Re-run when loading completes to observe newly rendered elements

  const handleAnalyticsPeriodChange = (period) => {
    setAnalyticsPeriod(period);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Stats Cards and Next Holiday Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stats Cards - 8 columns */}
        <div
          ref={(el) => (elementRefs.current['stats-cards'] = el)}
          data-animate-id="stats-cards"
          className={`lg:col-span-8 h-full scroll-fade-in ${visibleElements.has('stats-cards') ? 'animate-fade-in' : 'opacity-0'}`}
        >
          <LeaveStatsCards stats={stats} />
        </div>

        {/* Next Holiday - 4 columns */}
        <div
          ref={(el) => (elementRefs.current['next-holiday'] = el)}
          data-animate-id="next-holiday"
          className={`lg:col-span-4 h-full scroll-fade-in ${visibleElements.has('next-holiday') ? 'animate-fade-in' : 'opacity-0'}`}
          style={visibleElements.has('next-holiday') ? { animationDelay: '150ms' } : {}}
        >
          <NextHoliday nextHoliday={nextHoliday} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section - 8 columns */}
        <div className="lg:col-span-8 space-y-6">
          <div
            ref={(el) => (elementRefs.current['analytics'] = el)}
            data-animate-id="analytics"
            className={`scroll-fade-in ${visibleElements.has('analytics') ? 'animate-fade-in' : 'opacity-0'}`}
            style={visibleElements.has('analytics') ? { animationDelay: '100ms' } : {}}
          >
            <LeaveAnalytics 
              analytics={weeklyAnalytics} 
              period={analyticsPeriod}
              onPeriodChange={handleAnalyticsPeriodChange}
            />
          </div>
          <div
            ref={(el) => (elementRefs.current['requests-table'] = el)}
            data-animate-id="requests-table"
            className={`scroll-fade-in ${visibleElements.has('requests-table') ? 'animate-fade-in' : 'opacity-0'}`}
            style={visibleElements.has('requests-table') ? { animationDelay: '200ms' } : {}}
          >
            <LeaveRequestsDashboardTable requests={recentRequests} />
          </div>
        </div>

        {/* Right Section - 4 columns */}
        <div className="lg:col-span-4 space-y-6">
          <div
            ref={(el) => (elementRefs.current['upcoming-holidays'] = el)}
            data-animate-id="upcoming-holidays"
            className={`scroll-fade-in ${visibleElements.has('upcoming-holidays') ? 'animate-fade-in' : 'opacity-0'}`}
            style={visibleElements.has('upcoming-holidays') ? { animationDelay: '100ms' } : {}}
          >
            <UpcomingHolidays holidays={upcomingHolidays} />
          </div>
          <div
            ref={(el) => (elementRefs.current['department-chart'] = el)}
            data-animate-id="department-chart"
            className={`scroll-fade-in ${visibleElements.has('department-chart') ? 'animate-fade-in' : 'opacity-0'}`}
            style={visibleElements.has('department-chart') ? { animationDelay: '250ms' } : {}}
          >
            <DepartmentLeaveChart distribution={departmentDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
}