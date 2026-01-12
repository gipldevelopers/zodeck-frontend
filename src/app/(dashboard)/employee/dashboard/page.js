// "use client";

// import React, { useState, useEffect } from "react";
// import { employeeDashboardService } from "@/services/employee/dashboard.service";
// import AttendanceWidget from "./components/widgets/AttendanceWidget";
// import LeaveWidget from "./components/widgets/LeaveWidget";
// import PayrollWidget from "./components/widgets/PayrollWidget";
// import PendingRequestsWidget from "./components/widgets/PendingRequestsWidget";
// import NotificationsWidget from "./components/widgets/NotificationsWidget";

// export default function EmployeeDashboard() {
//     const [dashboardData, setDashboardData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await employeeDashboardService.getDashboardStats();
//                 setDashboardData(data);
//             } catch (error) {
//                 console.error("Failed to fetch dashboard data", error);
//                 setError(error.message);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     if (isLoading) {
//         return (
//             <div className="p-8 space-y-4">
//                 <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
//                 <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Dashboard Unavailable</h2>
//                 <p className="text-gray-600 dark:text-gray-400 max-w-md">
//                     {error || "We couldn't load your dashboard information."}
//                 </p>
//                 {error.includes("Employee record not found") && (
//                     <p className="mt-4 text-sm text-gray-500 bg-gray-100 p-2 rounded">
//                         It looks like you are logged in, but your user account is not linked to an active Employee profile. Please contact your HR administrator.
//                     </p>
//                 )}
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
//             <div>
//                 <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
//                 <p className="text-gray-500">Welcome back! Here's your daily overview.</p>
//             </div>

//             {/* Row 1: 3 Columns */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <div className="h-full">
//                     <AttendanceWidget data={dashboardData?.attendance} />
//                 </div>
//                 <div className="h-full">
//                     <LeaveWidget data={dashboardData?.leaves} />
//                 </div>
//                 <div className="h-full">
//                     <PayrollWidget data={dashboardData?.payroll} />
//                 </div>
//             </div>

//             {/* Row 2: 2 Columns */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="h-full">
//                     <PendingRequestsWidget data={dashboardData?.requests} />
//                 </div>
//                 <div className="h-full">
//                     <NotificationsWidget data={dashboardData?.notifications} />
//                 </div>
//             </div>
//         </div>
//     );
// }

// src\app\(dashboard)\employee\dashboard\page.js
"use client";

import React, { useState, useEffect } from "react";
import { employeeDashboardService } from "@/services/employee/dashboard.service";

// New Components
import OfficeHoursTracker from "./components/OfficeHoursTracker";
import AttendanceCalendar from "./components/AttendanceCalendar";

// Existing Widgets
import LeaveWidget from "./components/widgets/LeaveWidget";
import PayrollWidget from "./components/widgets/PayrollWidget";
import PendingRequestsWidget from "./components/widgets/PendingRequestsWidget";
import NotificationsWidget from "./components/widgets/NotificationsWidget";

export default function EmployeeDashboard() {
const [dashboardData, setDashboardData] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await employeeDashboardService.getDashboardStats();
            setDashboardData(data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
}, []);

if (isLoading) {
    return (
        <div className="p-6 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mb-6"></div>
            
            {/* Skeleton for Tracker & Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-[400px] bg-gray-200 rounded-3xl animate-pulse lg:col-span-1"></div>
                <div className="h-[400px] bg-gray-200 rounded-3xl animate-pulse lg:col-span-2"></div>
            </div>

            {/* Skeleton for Secondary Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-48 bg-gray-200 rounded-3xl animate-pulse"></div>
                <div className="h-48 bg-gray-200 rounded-3xl animate-pulse"></div>
            </div>
        </div>
    );
}

if (error) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
            <div className="bg-red-50 text-red-600 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Dashboard Unavailable</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
                {error || "We couldn't load your dashboard information."}
            </p>
            {error.includes("Employee record not found") && (
                <p className="mt-4 text-sm text-gray-500 bg-gray-100 p-2 rounded">
                    It looks like you are logged in, but your user account is not linked to an active Employee profile. Please contact your HR administrator.
                </p>
            )}
        </div>
    );
}

return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your daily overview.</p>
            </div>
            <div className="text-sm text-gray-400 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
        </div>

        {/* Row 1: Time Tracking & Attendance (Major Modules) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1 Column Width */}
            <div className="lg:col-span-1 min-h-[450px]">
                <OfficeHoursTracker />
            </div>
            {/* 2 Columns Width */}
            <div className="lg:col-span-2 min-h-[450px]">
                <AttendanceCalendar />
            </div>
        </div>

        {/* Row 2: Stats Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-full">
                <LeaveWidget data={dashboardData?.leaves} />
            </div>
            <div className="h-full">
                <PayrollWidget data={dashboardData?.payroll} />
            </div>
        </div>

        {/* Row 3: Interaction Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-full">
                <PendingRequestsWidget data={dashboardData?.requests} />
            </div>
            <div className="h-full">
                <NotificationsWidget data={dashboardData?.notifications} />
            </div>
        </div>
    </div>
);
}