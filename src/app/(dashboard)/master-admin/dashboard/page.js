'use client';

import React, { useState, useEffect } from "react";
import { 
  Building2, Users, Settings, Activity, Workflow, Share2, 
  ClipboardList, CheckCircle2, XCircle, AlertTriangle, ArrowUpRight,
  TrendingUp, DollarSign, FileText, UserCheck
} from 'lucide-react';
import WelcomeWrap from "../../super-admin/dashboard/components/WelcomeWrap";
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
        <CheckCircle2 size={12} /> Active
      </span>
    ) : (
      <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-800">
        <AlertTriangle size={12} /> Pending
      </span>
    )}
  </div>
);

export default function MasterAdminDashboard() {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalLeads: 0,
    pendingOnboarding: 0,
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setStats({
          totalCompanies: 12,
          activeCompanies: 10,
          totalUsers: 450,
          activeUsers: 420,
          totalLeads: 28,
          pendingOnboarding: 5,
        });
        setActivities([
          { action: 'New company registered', module: 'COMPANY', timestamp: new Date(), user: 'System' },
          { action: 'Lead converted to company', module: 'CRM', timestamp: new Date(), user: 'Admin' },
        ]);
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
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <WelcomeWrap
          userName="Master Admin"
          systemAlerts={0}
          pendingTasks={stats.pendingOnboarding}
        />

        {/* --- KPI Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard 
             icon={Building2} 
             title="Total Companies" 
             value={stats.totalCompanies}
             subtext={`${stats.activeCompanies} Active`}
             bgClass="bg-blue-100 dark:bg-blue-900/30"
             colorClass="text-blue-600 dark:text-blue-400"
           />
           <StatCard 
             icon={Users} 
             title="Total Users" 
             value={stats.totalUsers}
             subtext={`${stats.activeUsers} Active`}
             bgClass="bg-purple-100 dark:bg-purple-900/30"
             colorClass="text-purple-600 dark:text-purple-400"
           />
           <StatCard 
             icon={TrendingUp} 
             title="CRM Leads" 
             value={stats.totalLeads}
             subtext="This Month"
             bgClass="bg-amber-100 dark:bg-amber-900/30"
             colorClass="text-amber-600 dark:text-amber-400"
           />
           <StatCard 
             icon={UserCheck} 
             title="Onboarding" 
             value={stats.pendingOnboarding}
             subtext="Pending"
             bgClass="bg-emerald-100 dark:bg-emerald-900/30"
             colorClass="text-emerald-600 dark:text-emerald-400"
           />
        </div>

        {/* --- Detailed Widgets Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* 1. Quick Actions */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <Settings size={20} className="text-gray-700 dark:text-gray-300" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              
              <div className="space-y-3">
                 <Link href="/master-admin/company" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Manage Companies</span>
                    <ArrowUpRight size={16} className="text-gray-400" />
                 </Link>
                 <Link href="/master-admin/crm-lead" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">View Leads</span>
                    <ArrowUpRight size={16} className="text-gray-400" />
                 </Link>
                 <Link href="/master-admin/onboarding-flow" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Onboarding Flow</span>
                    <ArrowUpRight size={16} className="text-gray-400" />
                 </Link>
                 <Link href="/master-admin/policy-rule" className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Policy & Rules</span>
                    <ArrowUpRight size={16} className="text-gray-400" />
                 </Link>
              </div>
           </div>

           {/* 2. System Overview */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    <FileText size={20} className="text-indigo-600 dark:text-indigo-400" />
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">System Overview</h3>
              </div>

              <div className="space-y-1">
                 <StatusRow label="Companies Active" isConfigured={stats.activeCompanies > 0} />
                 <StatusRow label="Onboarding Configured" isConfigured={true} />
                 <StatusRow label="Policies Active" isConfigured={true} />
                 <StatusRow label="Support Tickets" isConfigured={false} />
              </div>
           </div>

           {/* 3. Recent Activity Feed */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                       <Activity size={20} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                 </div>
                 <span className="text-xs font-medium text-gray-400">Real-time</span>
              </div>

              <div className="relative pl-4 border-l border-gray-100 dark:border-gray-700 space-y-6">
                 {activities.length > 0 ? (
                    activities.map((act, idx) => (
                       <div key={idx} className="relative group">
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
           </div>

        </div>
      </div>
    </div>
  );
}
