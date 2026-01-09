// src/app/(dashboard)/super-admin/dashboard/components/WelcomeWrap.js
import React from "react";
import Link from "next/link";

const WelcomeWrap = ({ userName, systemAlerts, pendingTasks, avatarUrl }) => {
  return (
    <div className="card bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg shadow-sm border-0 overflow-hidden text-white">
      <div className="card-body p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h4 className="text-2xl font-bold mb-2">Welcome back, {userName}!</h4>
            <p className="opacity-90">
              System Overview & Administration Dashboard
            </p>
          </div>
          
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="block text-xl font-bold">{systemAlerts}</span>
                <span className="block text-sm">System Alerts</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <span className="block text-xl font-bold">{pendingTasks}</span>
                <span className="block text-sm">Pending Tasks</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/super-admin/roles-permissions"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
            >
              Manage Roles
            </Link>
            <Link
              href="/super-admin/system-settings"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
            >
              System Settings
            </Link>
            <Link
              href="/super-admin/audit-logs"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
            >
              View Audit Logs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeWrap;