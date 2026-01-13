// // src\app\(dashboard)\super-admin\dashboard\page.js
// 'use client';

// import React, { useState, useEffect } from "react";
// import { dashboardService } from "@/services/super-admin-services/dashboard.service";
// import { Building2, Users, Settings, Activity, Workflow, Share2, ClipboardList, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
// import WelcomeWrap from "./components/WelcomeWrap";

// export default function SuperAdminDashboard() {
//   const [stats, setStats] = useState(null);
//   const [activities, setActivities] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [statsData, activityData] = await Promise.all([
//           dashboardService.getDashboardStats(),
//           dashboardService.getRecentActivities()
//         ]);
//         setStats(statsData?.data || statsData);
//         setActivities(activityData?.data || activityData);
//       } catch (error) {
//         console.error("Failed to fetch dashboard data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Helper to render boolean config status
//   const ConfigStatus = ({ label, isConfigured }) => (
//     <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//       <span className="text-gray-700 font-medium text-sm">{label}</span>
//       {isConfigured ? (
//         <span className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">
//           <CheckCircle size={14} /> Configured
//         </span>
//       ) : (
//         <span className="flex items-center gap-1 text-red-600 text-xs font-bold bg-red-100 px-2 py-1 rounded">
//           <XCircle size={14} /> Not Set
//         </span>
//       )}
//     </div>
//   );

//   if (isLoading) {
//     return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <WelcomeWrap
//         userName="Super Admin"
//         systemAlerts={0}
//         pendingTasks={0}
//         avatarUrl="/images/users/admin-avatar.png"
//       />

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {/* 1. Company Overview */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
//               <Building2 size={24} />
//             </div>
//             <h3 className="text-lg font-bold text-gray-800">Company Overview</h3>
//           </div>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3">
//               <span className="text-gray-500 text-sm">Total Companies</span>
//               <span className="text-xl font-bold text-gray-900">{stats?.companyOverview?.totalCompanies || 0}</span>
//             </div>
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3">
//               <span className="text-gray-500 text-sm">Total Locations</span>
//               <span className="text-xl font-bold text-gray-900">{stats?.companyOverview?.totalLocations || 0}</span>
//             </div>
//             <div className="flex justify-between items-center pt-1">
//               <span className="text-gray-500 text-sm">Active / Inactive</span>
//               <div className="flex gap-2">
//                 <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-0.5 rounded">{stats?.companyOverview?.activeCompanies || 0} Active</span>
//                 <span className="text-gray-400 text-xs py-1">/</span>
//                 <span className="text-red-600 font-semibold text-sm bg-red-50 px-2 py-0.5 rounded">{stats?.companyOverview?.inactiveCompanies || 0} Inactive</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 2. User Overview */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
//               <Users size={24} />
//             </div>
//             <h3 className="text-lg font-bold text-gray-800">User Overview</h3>
//           </div>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3">
//               <span className="text-gray-500 text-sm">Total Users</span>
//               <span className="text-xl font-bold text-gray-900">{stats?.userOverview?.totalUsers || 0}</span>
//             </div>
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3">
//               <span className="text-gray-500 text-sm">Active Users</span>
//               <span className="text-xl font-bold text-green-600">{stats?.userOverview?.activeUsers || 0}</span>
//             </div>
//             <div className="grid grid-cols-2 gap-2 text-xs pt-1">
//               <div className="bg-gray-50 p-2 rounded text-center">
//                 <span className="block font-bold text-gray-900">{stats?.userOverview?.usersByRole?.HR_ADMIN || 0}</span>
//                 <span className="text-gray-500">HR</span>
//               </div>
//               <div className="bg-gray-50 p-2 rounded text-center">
//                 <span className="block font-bold text-gray-900">{stats?.userOverview?.usersByRole?.PAYROLL_ADMIN || 0}</span>
//                 <span className="text-gray-500">Payroll</span>
//               </div>
//               <div className="bg-gray-50 p-2 rounded text-center">
//                 <span className="block font-bold text-gray-900">{stats?.userOverview?.usersByRole?.MANAGER || 0}</span>
//                 <span className="text-gray-500">Manager</span>
//               </div>
//               <div className="bg-gray-50 p-2 rounded text-center">
//                 <span className="block font-bold text-gray-900">{stats?.userOverview?.usersByRole?.EMPLOYEE || 0}</span>
//                 <span className="text-gray-500">Employee</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* 3. System Configuration Status */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-teal-100 text-teal-600 rounded-lg">
//               <Settings size={24} />
//             </div>
//             <h3 className="text-lg font-bold text-gray-800">System Config Status</h3>
//           </div>
//           <div className="space-y-3">
//             <ConfigStatus label="Payroll Configured" isConfigured={(stats?.systemConfig?.payrollConfiguredCount || 0) > 0} />
//             <ConfigStatus label="Attendance Rules" isConfigured={(stats?.systemConfig?.attendanceConfiguredCount || 0) > 0} />
//             <ConfigStatus label="Leave Policies" isConfigured={(stats?.systemConfig?.leaveConfiguredCount || 0) > 0} />
//           </div>
//         </div>

//         {/* 4. Approval Workflow Status */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
//               <Workflow size={24} />
//             </div>
//             <h3 className="text-lg font-bold text-gray-800">Workflow Status</h3>
//           </div>
//           <div className="flex flex-col gap-4">
//             <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
//               <span className="block text-3xl font-bold text-blue-700">{stats?.workflowStatus?.activeWorkflows || 0}</span>
//               <span className="text-sm text-blue-600 font-medium">Active Workflows</span>
//             </div>
//             <div className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-lg border border-gray-100">
//               <CheckCircle size={20} className="text-gray-400" />
//               <span className="font-medium text-sm">{stats?.workflowStatus?.totalWorkflows || 0} Total Workflows</span>
//             </div>
//           </div>
//         </div>

//         {/* 5. Integration Status */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
//               <Share2 size={24} />
//             </div>
//             <h3 className="text-lg font-bold text-gray-800">Integration Status</h3>
//           </div>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center p-2 border-b border-gray-50">
//               <span className="text-gray-600 text-sm">Payroll Bank</span>
//               <span className={`text-xs px-2 py-1 rounded font-bold ${stats?.integrationStatus?.payrollBank ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{stats?.integrationStatus?.payrollBank ? 'Active' : 'N/A'}</span>
//             </div>
//             <div className="flex justify-between items-center p-2 border-b border-gray-50">
//               <span className="text-gray-600 text-sm">Biometric</span>
//               <span className={`text-xs px-2 py-1 rounded font-bold ${stats?.integrationStatus?.biometric ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{stats?.integrationStatus?.biometric ? 'Active' : 'N/A'}</span>
//             </div>
//             <div className="flex justify-between items-center p-2">
//               <span className="text-gray-600 text-sm">ERP</span>
//               <span className={`text-xs px-2 py-1 rounded font-bold ${stats?.integrationStatus?.erp ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{stats?.integrationStatus?.erp ? 'Active' : 'N/A'}</span>
//             </div>
//           </div>
//         </div>

//         {/* 6. Recent Activities (Audit Snapshot) */}
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
//           <div className="flex items-center gap-3 mb-4">
//             <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
//               <ClipboardList size={24} />
//             </div>
//             <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
//           </div>
//           <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
//             {activities.length > 0 ? (
//               activities.map((act, idx) => (
//                 <div key={idx} className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                   <div className="mt-1">
//                     <Activity size={16} className="text-gray-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-800">{act.action || 'Action Performed'}</p>
//                     <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
//                       <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 uppercase text-[10px]">{act.module || 'System'}</span>
//                       <span className="flex items-center gap-1"><Clock size={10} /> {new Date(act.timestamp || Date.now()).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 text-gray-400 text-sm italic">
//                 No recent activities found.
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from "react";
import { dashboardService } from "@/services/super-admin-services/dashboard.service";
import { 
  Building2, Users, Settings, Activity, Workflow, Share2, 
  ClipboardList, CheckCircle2, XCircle, AlertTriangle, ArrowUpRight 
} from 'lucide-react';
import WelcomeWrap from "./components/WelcomeWrap";
import Link from 'next/link';

// --- Helper Components ---

const StatCard = ({ icon: Icon, title, value, subtext, colorClass, bgClass }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      {subtext && (
        <span className="text-xs font-medium px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          {subtext}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{title}</p>
    </div>
  </div>
);

const StatusRow = ({ label, isConfigured }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    {isConfigured ? (
      <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800">
        <CheckCircle2 size={12} /> Live
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-800">
        <AlertTriangle size={12} /> Pending
      </span>
    )}
  </div>
);

const IntegrationItem = ({ label, active }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
    <div className={`h-2.5 w-2.5 rounded-full shadow-sm ${active ? 'bg-green-500 shadow-green-500/50 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
  </div>
);

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentActivities()
        ]);
        setStats(statsData?.data || statsData);
        setActivities(activityData?.data || activityData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-gray-500 font-medium text-sm">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <WelcomeWrap
          userName="Super Admin"
          systemAlerts={0}
          pendingTasks={0}
        />

        {/* --- KPI Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard 
             icon={Building2} 
             title="Total Companies" 
             value={stats?.companyOverview?.totalCompanies || 0}
             subtext={`${stats?.companyOverview?.activeCompanies || 0} Active`}
             bgClass="bg-blue-100 dark:bg-blue-900/30"
             colorClass="text-blue-600 dark:text-blue-400"
           />
           <StatCard 
             icon={Users} 
             title="Total Users" 
             value={stats?.userOverview?.totalUsers || 0}
             subtext={`${stats?.userOverview?.activeUsers || 0} Active`}
             bgClass="bg-purple-100 dark:bg-purple-900/30"
             colorClass="text-purple-600 dark:text-purple-400"
           />
           <StatCard 
             icon={Workflow} 
             title="Active Workflows" 
             value={stats?.workflowStatus?.activeWorkflows || 0}
             bgClass="bg-amber-100 dark:bg-amber-900/30"
             colorClass="text-amber-600 dark:text-amber-400"
           />
           <StatCard 
             icon={Share2} 
             title="Integrations" 
             value="3/3" 
             subtext="Operational"
             bgClass="bg-emerald-100 dark:bg-emerald-900/30"
             colorClass="text-emerald-600 dark:text-emerald-400"
           />
        </div>

        {/* --- Detailed Widgets Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* 1. System Health & Config */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Settings size={20} className="text-gray-700 dark:text-gray-300" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">System Configuration</h3>
              </div>
              
              <div className="space-y-1">
                 <StatusRow label="Payroll Module" isConfigured={(stats?.systemConfig?.payrollConfiguredCount || 0) > 0} />
                 <StatusRow label="Attendance Rules" isConfigured={(stats?.systemConfig?.attendanceConfiguredCount || 0) > 0} />
                 <StatusRow label="Leave Policies" isConfigured={(stats?.systemConfig?.leaveConfiguredCount || 0) > 0} />
                 <StatusRow label="Expense Module" isConfigured={false} /> {/* Mock for demo */}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                 <Link href="/super-admin/system-settings" className="flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
                    Manage Configurations <ArrowUpRight size={16} />
                 </Link>
              </div>
           </div>

           {/* 2. Integration Health */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <Share2 size={20} className="text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">API Integrations</h3>
              </div>

              <div className="space-y-3">
                 <IntegrationItem label="Banking API (Payroll)" active={stats?.integrationStatus?.payrollBank} />
                 <IntegrationItem label="Biometric Sync" active={stats?.integrationStatus?.biometric} />
                 <IntegrationItem label="ERP Connector" active={stats?.integrationStatus?.erp} />
                 <IntegrationItem label="Email Gateway" active={true} />
              </div>
           </div>

           {/* 3. Recent Activity Feed */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:row-span-2">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                       <Activity size={20} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audit Log</h3>
                 </div>
                 <span className="text-xs font-medium text-gray-400">Real-time</span>
              </div>

              <div className="relative pl-4 border-l border-gray-100 dark:border-gray-700 space-y-6">
                 {activities.length > 0 ? (
                    activities.map((act, idx) => (
                       <div key={idx} className="relative group">
                          {/* Timeline Dot */}
                          <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-600 ring-4 ring-white dark:ring-gray-800 group-hover:bg-indigo-500 transition-colors"></div>
                          
                          <div className="flex flex-col gap-1">
                             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                {new Date(act.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                             <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {act.action || 'System Action'}
                             </p>
                             <div className="flex items-center gap-2">
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                   {act.module || 'SYSTEM'}
                                </span>
                                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                   by {act.user || 'Admin'}
                                </span>
                             </div>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="py-12 text-center text-gray-400 text-sm italic">
                       No recent activities recorded.
                    </div>
                 )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                 <Link href="/super-admin/audit-logs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
                    View Full History
                 </Link>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}